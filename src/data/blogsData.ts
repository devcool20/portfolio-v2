export interface Blog {
  slug: string;
  title: string;
  date: string;
  claps: number;
  tags: string[];
  link: string;
  isExternal: boolean;
  excerpt?: string;
  heroImage?: string;
  content?: string;
}

export const blogsData: Blog[] = [
  {
    slug: "the-journey-of-building-loql",
    title: "the journey of building loql",
    date: "Feb 17, 2026",
    claps: 120,
    tags: ["Product", "Startup", "Tech"],
    link: "/blogs/the-journey-of-building-loql",
    isExternal: false,
    excerpt: "A deep dive into architecting a local peer-to-peer rental marketplace built around trust, nearby discovery, and QR handshakes.",
    heroImage: "/blog-hero.jpg",
    content: `
Building **Loql** started with a simple observation: most of the items we own sit idle 90% of the time, while our neighbors often need those exact items for short-term projects.

### The Vision
We set out to create a local peer-to-peer rental marketplace centered around **trust**, **hyper-local discovery**, and **seamless QR handshakes**.

### Key Architectural Decisions
1. **Nearby Matching Engine**: Built using spatial indexing to surface available items within walking distance.
2. **Secure Verification & Handshakes**: Integrated QR verification flows to confirm item state during handoff and return.
3. **Clean, Responsive UI**: Designed with zero friction, instant search, and immediate booking confirmation.

### Lessons Learned
Scaling a two-sided marketplace requires balancing supply density with demand signals in micro-communities. Focusing on high-trust neighborhoods proved crucial to early traction.
    `,
  },
  {
    slug: "my-thesis-on-ai-generated-image-verification-gateway",
    title: "my thesis on ai-generated image verification gateway",
    date: "Feb 15, 2026",
    claps: 85,
    tags: ["AI", "Security", "Infrastructure"],
    link: "/blogs/my-thesis-on-ai-generated-image-verification-gateway",
    isExternal: false,
    excerpt: "Exploring real-time verification gateways for AI-generated media to protect content authenticity and prevent deepfake spoofing.",
    heroImage: "/blog-hero.jpg",
    content: `
As generative AI models become indistinguishable from reality, validating the origin and authenticity of digital media at network ingress is critical.

### Abstract
This thesis presents an edge-compatible **AI Verification Gateway** designed to inspect incoming image payloads for synthetic artifacts, provenance metadata signatures, and spectral anomalies.

### Core Components
- **Perceptual Feature Extraction**: Lightweight neural network heads running at low latency on edge nodes.
- **Watermark & Provenance Inspection**: Cryptographic verification of C2PA metadata and latent watermarks.
- **Risk Score Aggregation**: Dynamic scoring mechanism that routes high-risk media for human review or sandbox isolation.

### Results
Achieved sub-40ms latency overhead on high-throughput media ingestion pipelines while maintaining a 96.4% detection accuracy across synthetic diffusion outputs.
    `,
  }
];
