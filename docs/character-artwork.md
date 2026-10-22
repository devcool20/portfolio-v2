# Character artwork

The homepage portrait is a restrained, realistic 2.5D illustration generated with the built-in image tool. The user's second photo supplies facial characteristics and short textured hair; the original photo supplies the pale rolled-sleeve shirt, dark trousers, belt, watch and hands-in-pockets pose. Facial hair was explicitly removed. Neither source photo is published.

## Assets and registration

- `public/character/neutral-v2.png`: complete master and static fallback.
- `public/character/body-v2.png`: headless body with an extended neck underneath the jaw.
- `public/character/eyes-base-v2.png`: empty sclera, sampled only inside the eye openings.
- `public/character/blink-v2.png`: relaxed closed eyelids, sampled only inside eyelid masks.
- `public/character/wave-v2.png`: optional raised-arm body; the palm is animated around its wrist.

All assets use the same 1254 by 1254 transparent RGBA canvas. The rig requests 384px optimized images through Next.js; the fallback uses a 256/384px source set. The asset URL revision prevents the rejected cartoon from remaining in the image cache. Generated originals remain in the Codex generated-images folder.

Registration, neck pivot, eye openings, iris and blink bounds, and motion limits live in `src/components/character/character-config.ts`. Recalibrate these together whenever the master changes. The body overlaps the lower face; do not cut its neck flush against the jaw. All enhancement layers must decode before the static portrait is hidden.

Desktop slots are 112/128/144px; compact slots are 64/80px with a closer crop. Pointer motion uses separate springs for head, eyes and shoulders; eye travel is limited to 4 by 2.5 canvas pixels. Touch skips cursor tracking but supports the tap greeting and idle motion. Reduced motion, core-layer failure, and no JavaScript retain the neutral portrait. Hidden variants, offscreen portraits and background tabs do not animate.

Idle motion includes visible glances, posture shifts, breathing, blinking and an occasional wave. Hovering produces a nod, hand wave and a "Hi!" speech bubble. Keyboard focus reveals the greeting, and clicking, tapping or pressing Enter triggers it for 2.4 seconds. Escape dismisses it. Reduced motion keeps a static portrait and a non-moving greeting. The optional wave asset failing does not disable the normal portrait or text greeting. The compact crop smoothly widens during a wave so the raised hand remains visible.

The old expanding portrait component was removed. Original shared portrait files and Three.js remain for social hover cards and unrelated effects.

## Final artwork prompts

### Greeting body layer

Use case: precise-object-edit. This transparent headless body is an animation layer. Create a GREETING POSE by changing ONLY the character's right arm (VIEWER LEFT): lift that arm with elbow bent, forearm upright, open palm facing the viewer beside where the head would be. Five natural fingers, relaxed friendly wave. Hand should fit within the same square canvas, about x=270 y=350, wrist about x=270 y=510 on a 1254x1254 canvas; elbow below it near x=320 y=740. Keep the pale lavender-white shirt with rolled sleeves, natural skin tone, and match original lighting. Keep torso center, shoulders, neck stub, shirt buttons, belt, trousers, the OTHER arm (viewer right) still in pocket and silver wristwatch exactly unchanged and registered to the input. Head remains completely absent/transparent, never add face or hair. Whole body stays in EXACT same canvas position and scale, no recentering, cropping or camera change. Do NOT keep the original viewer-left arm in the pocket: replace it with raised arm, only two arms. Genuine transparent RGBA background, no floating pixels, no objects, no speech bubble, no text.

### Realistic identity revision

Use case: identity-preserving character revision.
Input 1 is the new FACE IDENTITY REFERENCE: the young adult man visible on the laptop screen. Use the actual man's facial characteristics and his short, thick, textured dark hair: defined angular jaw and chin, straight strong eyebrows, normal-sized almond-shaped dark brown eyes, straight nose, natural lips, warm medium-brown skin. Ignore the laptop, screen color cast, room, earbuds and all background.
Input 2 is the existing character to replace; use it ONLY as the reference for the standing pose, body position, shirt, rolled sleeves, belt, trousers, watch, and square transparent composition.
The user rejected the exaggerated cartoon appearance. Redesign the head as an attractive, mature, mostly realistic 3D digital portrait of the man in Input 1. Clean-shaven: remove ALL beard and moustache, no stubble or dark beard shadow. Natural adult facial and eye proportions, defined masculine facial structure, restrained confident closed-mouth expression with only a faint relaxed smile. Short textured dark hair like Input 1, not the long middle-parted wavy hair of Input 2. Subtle polished 3D modeling and soft natural skin shading; photorealistic-leaning, not anime, chibi, baby-faced, giant-eyed, doll-like, toy-like or glossy plastic. Natural brown eyes, not giant glass eyes. Do not reproduce blue monitor lighting.
Reduce the exaggerated head size from Input 2 by about 18 percent while keeping the chin-to-neck connection at the same position. Preserve all body geometry and clothing from Input 2: pale lavender-white button-down shirt with open collar, rolled sleeves, dark charcoal trousers and black belt, silver watch on the left wrist (viewer right), hands in pockets. Front-facing head and gaze so it can be animated. Keep the body and shoulders in exactly the same canvas position as Input 2. Entire character from hair to upper thighs. Keep a modest amount of transparent padding above the head.
Square image, character only, genuinely transparent RGBA background. No text, background panel, scenery, ground, cast shadow, frame, screen UI or added accessories.

### Clean-shaven refinement

Make ONE precise localized edit to this transparent portrait: completely REMOVE ALL FACIAL HAIR. The upper lip currently has a dark moustache, the chin has a soul patch, and cheeks/jaw have gray stubble: remove all of them. Smooth naturally clean-shaven skin on upper lip, around mouth, chin and jaw, matching the warm skin tone of the cheeks. NO five-o-clock shadow, NO gray beard tint, NO moustache, NO stubble, NO chin tuft. Preserve the strong jaw shape, nose, lips, eyebrows, hairstyle, facial identity, realistic adult proportions and expression. Do not change head position, eye position, canvas size, crop, clothing, watch or body. Keep everything else pixel-aligned to the input; this is an animation master texture. Genuine transparent background remains. Keep entire current square canvas.

### Final facial-hair removal and edge refinement

Retouch this portrait to a truly CLEAN-SHAVEN man. Crucial: the dark grey moustache shadow ABOVE the upper lip and the dark triangular patch BELOW the lower lip are facial hair and MUST BE COMPLETELY ERASED. Repaint those areas with warm peach-brown skin, matching cheeks, not grey. Remove all gray beard shadow around chin and jaw. Clear smooth warm skin like a freshly shaved face, no visible facial hair anywhere except eyebrows. Keep lips shape and shadows immediately on lip edges only, no dark band under nose. Also clean the silhouette: eliminate all isolated white specks and stray white halo fragments around sleeves, ears and arms to fully transparent alpha; retain clean antialiased fabric edges. Preserve identity, head size/placement, eyes, hairstyle, shirt, watch, pose, framing and canvas. Naturally realistic polished 3D illustrated portrait. Transparent background. These changes must be clearly visible.

### body layer

Animation body-layer extraction. Keep the EXACT same square canvas, resolution, framing and all body/clothing/arms/watch pixels in precisely their existing positions. Remove the head, hair, face, and ears completely to transparency. Keep the entire neck and extend its warm skin texture upward into where the chin was, up to just below the former mouth, making an overlapping rounded neck stub. Keep shirt collar, shoulders, torso, belt, arms, trousers and watch unchanged, same size, same position. No head. Do not recenter or resize anything. Genuine transparent background and empty alpha where head used to be. Clean clothing silhouette with no floating white specks.

### eyes layer

Tiny localized animation texture edit. Keep the EXACT same square canvas, resolution, framing, face position, head and body pixels. In BOTH eyes only: erase brown iris, black pupil and highlights and replace with softly shaded off-white sclera consistent with surrounding eyeball. Eye openings, eyelids, lashes and eyebrow positions remain EXACTLY unchanged. Intentionally empty white eyeballs: separate iris sprites will be added in code. Do not change any other facial feature. Preserve clean-shaven smooth face, hair, clothing, pose and transparency. Do not recenter, resize, crop or alter proportions.

### blink layer

One animation frame: close BOTH eyes in a relaxed natural blink. Change ONLY eyelids, maintain exact eye socket positions, eyebrows, nose, mouth and clean-shaven face unchanged. Preserve the EXACT square canvas resolution, character scale, framing, position, haircut, clothing, body, watch and alpha transparency. No squint, no scrunch, no smile change. Do not resize or recenter. Everything except the two closed eyelids must remain unchanged. No facial hair.

