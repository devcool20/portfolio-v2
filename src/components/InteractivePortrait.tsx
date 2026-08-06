"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface InteractivePortraitProps {
  imageSrc?: string;
  depthMapSrc?: string;
  className?: string;
  grayscale?: boolean;
  allowExpand?: boolean;
}

export default function InteractivePortrait({
  imageSrc = "/portrait.png?v=3",
  depthMapSrc = "/portrait_depth.png?v=3",
  className = "",
  grayscale = false,
  allowExpand = true,
}: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
    rotX: 0,
    rotY: 0,
    shadowX: 0,
    shadowY: 0,
    rect: null as DOMRect | null,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    const updateRect = () => {
      if (container) {
        stateRef.current.rect = container.getBoundingClientRect();
      }
    };
    updateRect();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resizeRenderer = () => {
      if (!container) return;
      updateRect();
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();
    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);

    window.addEventListener("scroll", updateRect, { passive: true });

    const textureLoader = new THREE.TextureLoader();
    let colorTexture: THREE.Texture;
    let depthTexture: THREE.Texture;

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setIsLoaded(true);
      }
    };

    colorTexture = textureLoader.load(imageSrc, checkLoaded);
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.minFilter = THREE.LinearFilter;
    colorTexture.magFilter = THREE.LinearFilter;

    depthTexture = textureLoader.load(depthMapSrc, checkLoaded);
    depthTexture.minFilter = THREE.LinearFilter;
    depthTexture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(1.85, 1.85, 128, 128);

    const uniforms = {
      uTexture: { value: colorTexture },
      uDepthMap: { value: depthTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uGrayscale: { value: grayscale ? 1.0 : 0.0 },
      uDepthStrength: { value: 0.14 },
      uParallaxStrength: { value: 0.09 },
      uLightIntensity: { value: 0.22 },
    };

    const vertexShader = `
      varying vec2 vUv;
      varying float vDepth;
      varying vec3 vViewPosition;

      uniform vec2 uMouse;
      uniform float uTime;
      uniform sampler2D uDepthMap;
      uniform float uDepthStrength;
      uniform float uParallaxStrength;

      void main() {
        vUv = uv;
        
        float depth = texture2D(uDepthMap, uv).r;
        vDepth = depth;
        
        vec3 pos = position;
        
        // Z Displacement
        pos.z += (depth - 0.2) * uDepthStrength;
        
        // Parallax Movement
        float mouseDist = length(uMouse);
        float easeRadius = smoothstep(0.0, 1.0, mouseDist);
        vec2 easedMouse = mouseDist > 0.001 ? normalize(uMouse) * easeRadius : vec2(0.0);
        
        pos.x += easedMouse.x * (depth - 0.25) * uParallaxStrength;
        pos.y += easedMouse.y * (depth - 0.25) * uParallaxStrength * 0.75;
        
        // Mesh Warp Distortion
        float cheekFactor = (1.0 - smoothstep(0.0, 0.45, abs(uv.x - 0.5))) * (depth - 0.15);
        pos.x += easedMouse.x * cheekFactor * 0.025;
        pos.y += easedMouse.y * cheekFactor * 0.018;
        
        // Subtle Breathing
        pos.y += sin(uTime * 1.1) * 0.012;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying float vDepth;
      varying vec3 vViewPosition;

      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uGrayscale;
      uniform float uLightIntensity;

      void main() {
        float depth = texture2D(uDepthMap, vUv).r;
        vec2 uvOffset = uMouse * (depth - 0.35) * 0.012;
        vec2 targetUv = clamp(vUv - uvOffset, 0.001, 0.999);
        
        vec4 color = texture2D(uTexture, targetUv);
        
        // Grayscale conversion option
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        vec3 baseColor = mix(color.rgb, vec3(gray), uGrayscale);
        
        // Surface normal estimation
        float dRight = texture2D(uDepthMap, vUv + vec2(0.004, 0.0)).r;
        float dTop   = texture2D(uDepthMap, vUv + vec2(0.0, 0.004)).r;
        vec3 normal  = normalize(vec3((depth - dRight) * 12.0, (depth - dTop) * 12.0, 1.0));
        
        // Light & Specular calculation
        vec3 lightPos = vec3(uMouse.x * 1.5, uMouse.y * 1.5, 1.2);
        vec3 lightDir = normalize(lightPos - vec3(vUv - 0.5, depth * 0.2));
        
        float diff = max(dot(normal, lightDir), 0.0);
        
        vec3 viewDir = normalize(vViewPosition);
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec   = pow(max(dot(normal, halfDir), 0.0), 20.0);
        
        vec3 lightHighlight = vec3(1.0, 0.97, 0.92) * (diff * 0.10 + spec * 0.22) * uLightIntensity;
        
        float lightDist = distance(vUv, uMouse * 0.5 + 0.5);
        float radialSheen = (1.0 - smoothstep(0.0, 0.65, lightDist)) * 0.12 * uLightIntensity;
        
        vec3 finalRgb = baseColor + lightHighlight + vec3(radialSheen);
        
        gl_FragColor = vec4(finalRgb, color.a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const st = stateRef.current;
      if (!st.rect) return;

      const rect = st.rect;
      const margin = 250;
      if (
        e.clientX >= rect.left - margin &&
        e.clientX <= rect.right + margin &&
        e.clientY >= rect.top - margin &&
        e.clientY <= rect.bottom + margin
      ) {
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 + margin);
        const y = -((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2 + margin));
        st.targetX = Math.max(-1, Math.min(1, x));
        st.targetY = Math.max(-1, Math.min(1, y));
        st.isHovered = true;
      } else if (!st.isHovered) {
        st.targetX = 0;
        st.targetY = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const st = stateRef.current;
      if (!st.rect || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = st.rect;
      const x = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = -((touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      st.targetX = Math.max(-1, Math.min(1, x));
      st.targetY = Math.max(-1, Math.min(1, y));
      st.isHovered = true;
    };

    const handleMouseLeave = () => {
      stateRef.current.targetX = 0;
      stateRef.current.targetY = 0;
      stateRef.current.isHovered = false;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchend", handleMouseLeave);

    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;
      const st = stateRef.current;

      st.mouseX += (st.targetX - st.mouseX) * 0.08;
      st.mouseY += (st.targetY - st.mouseY) * 0.08;

      st.rotY = st.mouseX * 12;
      st.rotX = -st.mouseY * 8;

      st.shadowX = -st.mouseX * 14;
      st.shadowY = st.mouseY * 14;

      container.style.transform = `perspective(1200px) rotateX(${st.rotX.toFixed(2)}deg) rotateY(${st.rotY.toFixed(2)}deg) translateZ(0px)`;
      container.style.boxShadow = `${st.shadowX.toFixed(1)}px ${st.shadowY.toFixed(1)}px 40px rgba(0, 0, 0, 0.25)`;

      uniforms.uMouse.value.set(st.mouseX, st.mouseY);
      uniforms.uTime.value = elapsedTime;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchend", handleMouseLeave);
      geometry.dispose();
      material.dispose();
      colorTexture.dispose();
      depthTexture.dispose();
      renderer.dispose();
    };
  }, [imageSrc, depthMapSrc, grayscale]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (allowExpand) {
      e.stopPropagation();
      setIsExpanded(true);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleCardClick}
        className={`relative shrink-0 rounded-[6px] sm:rounded-[8px] overflow-hidden border-[1.5px] border-black/30 dark:border-white/[0.15] bg-zinc-900 transition-shadow duration-300 will-change-transform ${
          allowExpand ? "cursor-pointer active:scale-95 transition-all duration-200" : ""
        } ${className}`}
        style={{
          transformStyle: "preserve-3d",
          transition: "box-shadow 0.15s ease-out, transform 0.15s ease-out",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-[4px] sm:rounded-[6px] object-cover pointer-events-none"
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse rounded-[4px]" />
        )}
      </div>

      {/* 3D UNO Card Flip & Zoom Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none cursor-pointer"
            style={{ perspective: 1200 }}
          >
            {/* Close Icon Badge */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/80 border border-white/20 text-white hover:bg-zinc-800 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* UNO Card 3D Flip Container */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.25,
                rotateY: 180,
                rotateZ: -25,
                y: 120,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateZ: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.25,
                rotateY: -180,
                rotateZ: 25,
                y: 120,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-2xl p-3 border-2 border-white/20 bg-zinc-950/90 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col items-center gap-3 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Holographic Glow Edge */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-transparent to-amber-500/20 pointer-events-none" />

              {/* High-res Enlarged 2.5D Portrait */}
              <InteractivePortrait
                imageSrc={imageSrc}
                depthMapSrc={depthMapSrc}
                grayscale={false}
                allowExpand={false}
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xl shadow-inner"
              />

              {/* Action Hint */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[12px] font-medium text-zinc-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Tap anywhere to dismiss
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
