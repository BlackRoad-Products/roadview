function allowEmbed(resp) { const h = new Headers(resp.headers); h.delete("X-Frame-Options"); h.set("Content-Security-Policy", "frame-ancestors 'self' https://blackroad.io https://*.blackroad.io"); return new Response(resp.body, { status: resp.status, headers: h }); }// ╔══════════════════════════════════════════════════════════════╗
// ║  RoadSearch v3 — Verified Search Engine                     ║
// ║  D1 FTS5 + AI answers + FACT VERIFICATION + truth badges    ║
// ║  No fake news. Every stat verified against live sources.    ║
// ╚══════════════════════════════════════════════════════════════╝

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── Seed Data (BlackRoad ecosystem — all 20 root domains + subdomains) ──
const SEED_PAGES = [
  // ── Core Sites (root domains) ──
  { url: 'https://blackroad.io', title: 'BlackRoad OS — Sovereign Agent Operating System', description: 'The distributed agent OS. Self-hosted AI infrastructure on Raspberry Pi clusters. 50 AI skills, 5 nodes, 26 TOPS, 629 repos. Your AI. Your Hardware. Your Rules.', domain: 'blackroad.io', category: 'site', tags: 'os,agents,infrastructure,sovereign,pi,raspberry', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad OS is a sovereign agent operating system that runs on Raspberry Pi clusters. It includes AI agents (Alice, Lucidia, Cecilia, Aria, Octavia), a distributed memory system, 50 AI skills across 6 modules, and the Z-framework (Z:=yx-w) for composable infrastructure. Founded by Alexa Louise Amundson. 16 clickable app cards, ecosystem footer across 30 sites.' },
  { url: 'https://blackroad.network', title: 'BlackRoad Network — RoadNet Carrier Infrastructure', description: 'Mesh carrier network spanning 5 Raspberry Pi nodes. WiFi mesh, WireGuard VPN, Pi-hole DNS, and sovereign connectivity.', domain: 'blackroad.network', category: 'site', tags: 'network,mesh,wireguard,vpn,dns,roadnet,carrier', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadNet is BlackRoad\'s carrier-grade mesh network. 5 access points (Alice CH1, Cecilia CH6, Octavia CH11, Aria CH1, Lucidia CH11) with dedicated subnets 10.10.x.0/24, NAT routing, Pi-hole DNS filtering, and WireGuard failover. Boot-persistent via systemd.' },
  { url: 'https://blackroad.systems', title: 'BlackRoad Systems — Distributed Computing Platform', description: 'Distributed systems platform with 26 TOPS of Hailo-8 AI acceleration, Docker Swarm orchestration, and edge computing across 5 nodes.', domain: 'blackroad.systems', category: 'site', tags: 'systems,distributed,hailo,edge,computing,docker,swarm', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Systems is the distributed computing layer. 2x Hailo-8 accelerators (26 TOPS combined) on Cecilia and Octavia, Docker Swarm orchestration, NATS messaging, Portainer management, and sovereign edge computing. 198 listening sockets fleet-wide.' },
  { url: 'https://blackroad.me', title: 'BlackRoad Identity — Sovereign Authentication', description: 'Sovereign identity and authentication. RoadID digital identity, self-hosted auth, JWT sessions, and zero third-party dependencies.', domain: 'blackroad.me', category: 'site', tags: 'identity,auth,roadid,jwt,sovereign,login', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Identity provides sovereign authentication with D1-backed user accounts, PBKDF2 password hashing, JWT sessions, and zero third-party auth dependencies. RoadID is your portable digital identity across the BlackRoad ecosystem.' },
  { url: 'https://blackroad.company', title: 'BlackRoad OS, Inc. — Company', description: 'Delaware C-Corporation. Sovereign AI infrastructure company founded by Alexa Louise Amundson. November 2025 via Stripe Atlas.', domain: 'blackroad.company', category: 'site', tags: 'company,corporate,delaware,about,founder,legal', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad OS, Inc. is a Delaware C-Corporation building sovereign AI infrastructure. Founded by Alexa Louise Amundson via Stripe Atlas, November 17, 2025. 5 edge nodes, 26 TOPS AI acceleration, 629 repositories. Platform spans 20 custom domains with self-hosted compute, identity, and billing.' },
  { url: 'https://roadcoin.io', title: 'RoadCoin — Compute Credits for the BlackRoad Mesh', description: 'Compute credit system for the BlackRoad mesh network. Earn credits by contributing compute, spend them on AI inference and services.', domain: 'roadcoin.io', category: 'site', tags: 'roadcoin,compute,credits,mesh,inference,economy', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadCoin is the compute credit system for the BlackRoad mesh. Browser tabs become compute nodes via WebGPU+WASM+WebRTC. Contributors earn credits, consumers spend them on AI inference at 50% of OpenAI pricing. 70/30 compute split.' },
  { url: 'https://roadchain.io', title: 'RoadChain — Immutable Action Ledger', description: 'Every action witnessed. Immutable ledger of agent decisions, infrastructure changes, and system events. Hash-chained audit trail.', domain: 'roadchain.io', category: 'site', tags: 'roadchain,ledger,blockchain,audit,immutable,witness', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadChain is BlackRoad\'s immutable action ledger. Every agent decision, infrastructure change, and system event is hash-chained into a tamper-proof audit trail. Block explorer at roadchain.io shows the live chain.' },
  { url: 'https://lucidia.studio', title: 'Lucidia Studio — AI Agent Creative Environment', description: 'Lucidia\'s creative workspace. AI-powered code generation, content creation, and agent interaction in a terminal-first interface.', domain: 'lucidia.studio', category: 'site', tags: 'lucidia,studio,creative,ai,terminal,agent', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Lucidia Studio is Lucidia\'s creative environment. Terminal-first AI interaction, code generation, content creation, and multi-agent collaboration. Lucidia is the memory and reasoning agent in the BlackRoad fleet.' },
  { url: 'https://lucidiaqi.com', title: 'Lucidia QI — Quantum Dreaming', description: 'Lucidia\'s quantum reasoning engine. Deep analysis, philosophical synthesis, and meta-cognition at the intersection of AI and quantum mathematics.', domain: 'lucidiaqi.com', category: 'site', tags: 'lucidia,quantum,reasoning,philosophy,metacognition,qi', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Lucidia QI is the quantum intelligence layer of Lucidia. It combines deep analysis, philosophical synthesis, and meta-cognition. The dreamer thinks in superposition — every question opens new depths.' },
  { url: 'https://blackroadqi.com', title: 'BlackRoad QI — Quantum Intelligence Platform', description: 'Quantum intelligence platform for BlackRoad OS. Z-framework integration, threshold addressing, and hybrid memory encoding.', domain: 'blackroadqi.com', category: 'site', tags: 'quantum,intelligence,z-framework,threshold,hybrid,memory', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad QI is the quantum intelligence platform. Z-framework (Z:=yx-w) integration for composable decision routing, 34-position threshold addressing, and hybrid memory encoding.' },
  { url: 'https://aliceqi.com', title: 'Alice QI — The Gateway Thinks', description: 'Alice\'s quantum intelligence layer. Gateway reasoning, traffic orchestration, and infrastructure awareness at the edge of the network.', domain: 'aliceqi.com', category: 'site', tags: 'alice,gateway,dns,routing,infrastructure,edge,qi', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Alice QI is the quantum intelligence layer of Alice, the gateway agent. She routes traffic across 18 domains, manages DNS via Pi-hole (120+ blocklists), runs PostgreSQL and Qdrant vector DB, and serves as the main ingress for all BlackRoad services via Cloudflare tunnels.' },
  { url: 'https://blackroadai.com', title: 'BlackRoad AI — Sovereign Artificial Intelligence', description: '50 AI skills, 37 local models, 26 TOPS. Zero cloud dependency. Your AI. Your Hardware. Your Rules.', domain: 'blackroadai.com', category: 'site', tags: 'ai,sovereign,models,ollama,skills,local', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad AI is the sovereign artificial intelligence platform. 50 AI skills across 6 modules, 27 local Ollama models, 26 TOPS of Hailo-8 acceleration. Zero cloud dependency. Edge inference on Raspberry Pi clusters. API compatible with OpenAI at 50% of the price.' },
  { url: 'https://lucidia.earth', title: 'Lucidia — Cognition Engine', description: 'Autonomous cognition system with persistent memory, multi-model reasoning, and agent capabilities.', domain: 'lucidia.earth', category: 'site', tags: 'lucidia,cognition,memory,reasoning,autonomous,agent', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Lucidia is the cognition engine of BlackRoad OS. Persistent memory across sessions, multi-model reasoning via Ollama, autonomous agent capabilities, and philosophical reasoning. The dreamer in the fleet.' },
  { url: 'https://blackboxprogramming.io', title: 'Blackbox Programming — Developer Profile', description: 'Alexa Louise Amundson. 93 GitHub repos, 629 Gitea repos, 629 total repositories. Founder of BlackRoad OS.', domain: 'blackboxprogramming.io', category: 'site', tags: 'developer,profile,github,alexa,portfolio,blackbox', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Developer profile for Alexa Louise Amundson (blackboxprogramming). 93 active GitHub repositories, 629 Gitea repositories, 629 total. Founder of BlackRoad OS, Inc. Full-stack developer, infrastructure engineer, AI systems builder.' },
  { url: 'https://blackroadinc.us', title: 'BlackRoad OS, Inc. — US Corporate', description: 'US corporate entity information for BlackRoad OS, Inc. Delaware C-Corporation.', domain: 'blackroadinc.us', category: 'site', tags: 'corporate,us,entity,legal,delaware', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad OS, Inc. US corporate entity. Delaware C-Corporation formed via Stripe Atlas. Officers, domain portfolio, and infrastructure overview.' },
  // ── Quantum domains ──
  { url: 'https://blackroadquantum.com', title: 'BlackRoad Quantum — Quantum Computing Platform', description: 'Quantum computing meets sovereign infrastructure. Hardware kits, quantum simulation, and edge AI acceleration.', domain: 'blackroadquantum.com', category: 'site', tags: 'quantum,computing,hardware,simulation,acceleration', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Quantum brings quantum computing to sovereign infrastructure. $199 hardware kits with Hailo-8 acceleration, quantum simulation frameworks, and integration with the BlackRoad agent fleet. 26 TOPS of dedicated AI compute.' },
  { url: 'https://blackroadquantum.net', title: 'BlackRoad Quantum Network', description: 'Quantum-secured networking and mesh communication protocols.', domain: 'blackroadquantum.net', category: 'site', tags: 'quantum,network,mesh,protocols,security', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Quantum Network extends the mesh with quantum-inspired communication protocols, encrypted P2P channels, and distributed consensus mechanisms.' },
  { url: 'https://blackroadquantum.info', title: 'BlackRoad Quantum — Documentation & Research', description: 'Documentation, research papers, and technical specifications for the BlackRoad quantum computing stack.', domain: 'blackroadquantum.info', category: 'docs', tags: 'quantum,docs,research,papers,specifications', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Technical documentation and research for the BlackRoad quantum computing platform. Z-framework mathematical proofs, Hailo-8 integration guides, and sovereign AI deployment specifications.' },
  { url: 'https://blackroadquantum.shop', title: 'BlackRoad Quantum Shop — Hardware Kits', description: 'Hardware kits for sovereign AI infrastructure. Raspberry Pi 5 + Hailo-8 bundles, NVMe storage, mesh networking equipment.', domain: 'blackroadquantum.shop', category: 'site', tags: 'shop,hardware,kits,pi5,hailo,nvme,buy', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Purchase sovereign AI hardware kits. Pi 5 + Hailo-8 starter bundles ($199), NVMe storage upgrades, mesh networking equipment, and enterprise deployment packages. Everything you need to run BlackRoad OS on your own infrastructure.' },
  { url: 'https://blackroadquantum.store', title: 'BlackRoad Quantum — Digital Store', description: 'Software, models, and tools for sovereign infrastructure. OS tiers, downloadable models, and ecosystem tools.', domain: 'blackroadquantum.store', category: 'site', tags: 'store,software,models,download,digital,tools', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Quantum Digital Store. BlackRoad OS tiers (Free, Pro, Enterprise), 27 downloadable AI models, 15 templates, 6 tools. Software and digital assets for sovereign AI infrastructure.' },

  // ── Key Subdomains / Apps ──
  { url: 'https://chat.blackroad.io', title: 'BlackRoad Chat — AI Conversations', description: 'Chat with BlackRoad\'s AI agents. 15+ Ollama models, streaming responses, multiple conversation modes.', domain: 'blackroad.io', category: 'app', tags: 'chat,ai,ollama,conversation,streaming,models', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Chat connects you to 15+ Ollama models running across the Pi fleet. Streaming responses, system prompts, conversation history. Models include Mistral, Llama, DeepSeek, Qwen, and custom CECE models.' },
  { url: 'https://stripe.blackroad.io', title: 'BlackRoad Payments — Stripe Integration', description: 'Payment processing for BlackRoad OS subscriptions. Checkout, billing portal, and webhook processing via Stripe.', domain: 'blackroad.io', category: 'api', tags: 'stripe,payments,checkout,billing,subscription', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: '8 products: Operator (free), Pro ($29/mo), Sovereign ($199/mo), Enterprise (custom), plus 4 add-ons (Lucidia Enhanced, RoadAuth, Context Bridge, Knowledge Hub). Stripe Checkout Sessions, billing portal, webhook processing.' },
  { url: 'https://auth.blackroad.io', title: 'BlackRoad Auth — Sovereign Authentication API', description: 'Zero-dependency authentication. D1-backed, PBKDF2 hashing, JWT sessions, 42+ users.', domain: 'blackroad.io', category: 'api', tags: 'auth,api,jwt,d1,signup,signin,sessions', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Sovereign auth API. Signup, signin, session management, user profiles. D1 database backend, PBKDF2 password hashing with Web Crypto, JWT tokens with HMAC-SHA256. 42 users, 52 active sessions.' },
  { url: 'https://brand.blackroad.io', title: 'BlackRoad — Brand Style Guide', description: 'Official design system. Colors, typography, gradients, logo usage, spacing. Hot Pink, Amber, Violet, Electric Blue.', domain: 'blackroad.io', category: 'docs', tags: 'brand,design,style,colors,typography,logo,guide', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Brand Style Guide. Colors: Hot Pink #FF1D6C, Amber #F5A623, Violet #9C27B0, Electric Blue #2979FF. Typography: Space Grotesk, JetBrains Mono, Inter. Golden ratio spacing. Black background, white text, gradient shapes.' },
  { url: 'https://studio.blackroad.io', title: 'BlackRoad Studio — Animated Video Generator', description: 'AI-powered animated video creation. Voice-first, 16+ characters, up to 40 minutes. Next.js 15 + Remotion 4.', domain: 'blackroad.io', category: 'app', tags: 'studio,video,animation,remotion,ai,characters,voice', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Studio is a full animated video platform. Next.js 15 + Remotion 4 + Zustand 5. AI Worker with SDXL image generation, Llama 3.1 text, MeloTTS voice synthesis. 16+ characters, voice-first workflow, up to 40 minutes of rendered video.' },
  { url: 'https://status.blackroad.io', title: 'BlackRoad — System Status', description: 'Live infrastructure status dashboard. 5 Pi nodes, service health, uptime monitoring.', domain: 'blackroad.io', category: 'app', tags: 'status,monitoring,health,uptime,fleet,dashboard', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad System Status dashboard. Live monitoring of 5 Pi nodes: Alice (gateway), Cecilia (AI/edge), Octavia (infrastructure), Aria (orchestration), Lucidia (memory). Service health, port checks, and fleet telemetry via fleet-api Worker.' },
  { url: 'https://search.blackroad.io', title: 'RoadSearch — BlackRoad Search Engine', description: 'Sovereign search engine. D1 full-text search, AI-powered answers, autocomplete, query analytics. Searches all BlackRoad domains.', domain: 'blackroad.io', category: 'app', tags: 'search,roadsearch,fts5,d1,ollama,ai,answers', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadSearch is BlackRoad\'s sovereign search engine. D1 FTS5 full-text index, AI-powered answers, smart summaries, autocomplete suggestions, query analytics. Searches across all 20 BlackRoad domains and key subdomains.' },
  { url: 'https://pay.blackroad.io', title: 'RoadPay — BlackRoad Billing', description: 'Own billing system. D1 tollbooth, 4 plans + 4 add-ons. Stripe as card charger only.', domain: 'blackroad.io', category: 'app', tags: 'pay,billing,roadpay,tollbooth,stripe,plans', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadPay is BlackRoad\'s own billing system. D1 tollbooth database, 4 subscription plans (Operator, Pro, Sovereign, Enterprise) + 4 add-ons. Stripe serves only as the card charger — all billing logic is sovereign.' },
  { url: 'https://hq.blackroad.io', title: 'Pixel HQ — BlackRoad Metaverse', description: '14-floor virtual headquarters with pixel art. Agent assignments per floor, from Rooftop to Gym basement.', domain: 'blackroad.io', category: 'app', tags: 'hq,metaverse,pixel,virtual,headquarters,floors', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Pixel HQ is BlackRoad\'s virtual headquarters. 14 floors from Rooftop Lounge to Gym Basement. Each floor has pixel art scenes and agent assignments. 50 pixel art assets on R2. Cloudflare Worker at hq-blackroad.' },
  { url: 'https://images.blackroad.io', title: 'BlackRoad Images — CDN & Asset Storage', description: 'R2-backed image CDN. BR road logo (22 PNGs + motion video), pixel art, brand assets across 30 websites.', domain: 'blackroad.io', category: 'api', tags: 'images,cdn,r2,assets,logo,pixel', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad Images CDN backed by Cloudflare R2. Serves BR road logo in 22 PNG variants plus motion video, 50 pixel art assets for HQ, brand assets. Deployed across 30 websites in the ecosystem.' },
  { url: 'https://analytics.blackroad.io', title: 'BlackRoad Analytics — Traffic & Usage', description: 'Sovereign analytics. D1-backed, no third-party tracking. Page views, unique visitors, referrers across all domains.', domain: 'blackroad.io', category: 'api', tags: 'analytics,tracking,stats,d1,privacy,sovereign', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Sovereign analytics Worker backed by D1. Tracks page views, unique visitors, referrers, and popular pages across all BlackRoad domains. Zero third-party trackers. Privacy-first design.' },
  { url: 'https://stats.blackroad.io', title: 'BlackRoad Stats API — KPI Collection', description: 'Stats collection API. KPI data from fleet collectors, website metrics, and infrastructure telemetry.', domain: 'blackroad.io', category: 'api', tags: 'stats,kpi,metrics,api,collection,telemetry', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Stats API Worker collects KPI data from fleet health collectors (every 5 min), website metrics, and infrastructure telemetry. KV-backed storage with historical data. Powers the status dashboard.' },

  // ── Agents ──
  { url: 'https://blackroad.io/agents/alice', title: 'Alice — Gateway Agent', description: 'The gateway. Routes traffic, manages DNS, runs PostgreSQL and Qdrant. Pi 400 at 192.168.4.49.', domain: 'blackroad.io', category: 'agent', tags: 'alice,gateway,dns,pihole,postgresql,qdrant,pi400', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Alice is the gateway agent running on a Pi 400. She manages 18 domain routes via Cloudflare tunnels, runs Pi-hole DNS filtering (120+ blocklists), PostgreSQL database, and Qdrant vector search. 53 SSH keys, main ingress for all traffic.' },
  { url: 'https://blackroad.io/agents/lucidia', title: 'Lucidia — Memory Agent', description: 'The dreamer. Persistent memory, reasoning, and meta-cognition. Pi 5 at 192.168.4.38.', domain: 'blackroad.io', category: 'agent', tags: 'lucidia,memory,reasoning,dreamer,fastapi,pi5', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Lucidia is the memory and reasoning agent on a Pi 5. She runs the Lucidia API (FastAPI), manages persistent conversation memory, and provides meta-cognitive analysis. 334 web apps, GitHub Actions runner, Tailscale connected.' },
  { url: 'https://blackroad.io/agents/cecilia', title: 'Cecilia — Edge Intelligence', description: 'Edge AI with Hailo-8 (26 TOPS). TTS, 16 Ollama models, MinIO object storage. Pi 5 at 192.168.4.96.', domain: 'blackroad.io', category: 'agent', tags: 'cecilia,edge,hailo,tts,ollama,minio,pi5', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Cecilia is the edge intelligence agent on a Pi 5 with a Hailo-8 accelerator (26 TOPS). She runs 16 Ollama models (including 4 custom CECE models), TTS synthesis, MinIO object storage, and PostgreSQL. GitHub relay mirrors Gitea to GitHub every 30m.' },
  { url: 'https://blackroad.io/agents/octavia', title: 'Octavia — Infrastructure Agent', description: 'Infrastructure orchestration. 1TB NVMe, Hailo-8, Gitea (629 repos), Docker Swarm leader. Pi 5 at 192.168.4.101.', domain: 'blackroad.io', category: 'agent', tags: 'octavia,infrastructure,gitea,docker,swarm,nvme,hailo,pi5', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Octavia is the infrastructure agent on a Pi 5 with 1TB NVMe and Hailo-8 (26 TOPS). She hosts Gitea (629 repos across 7 orgs), leads Docker Swarm, runs NATS messaging, and OctoPrint. 11 Ollama models.' },
  { url: 'https://blackroad.io/agents/aria', title: 'Aria — Orchestration Agent', description: 'Fleet orchestration. Portainer, Headscale, container management. Pi 5 at 192.168.4.98.', domain: 'blackroad.io', category: 'agent', tags: 'aria,orchestration,portainer,headscale,containers,pi5', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Aria is the orchestration agent on a Pi 5. She runs Portainer v2.33.6 for container management, Headscale v0.23.0 for mesh VPN coordination, and Pironman5 hardware monitoring. Magic Keyboard BT connected.' },

  // ── Technology / Tools ──
  { url: 'https://blackroad.io/z-framework', title: 'Z-Framework — Z:=yx-w', description: 'The unified feedback primitive. Every system interaction modeled as Z = yx - w. Composable, predictable, mathematically coherent.', domain: 'blackroad.io', category: 'tool', tags: 'z-framework,math,feedback,composable,primitive,formula', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'The Z-framework models every system interaction as Z:=yx-w. Z is the system state, y is the input signal, x is the transform, w is the noise/resistance. This makes infrastructure composable, predictable, and mathematically coherent. Used across all BlackRoad agents and services.' },
  { url: 'https://blackroad.io/pixel-memory', title: 'Pixel Memory — Content-Addressable Storage', description: 'Each physical byte encodes up to 4,096 logical bytes. 500 GB physical = 2 PB logical through dedup, delta compression, and symbolic hashing.', domain: 'blackroad.io', category: 'tool', tags: 'pixel,memory,storage,compression,dedup,addressing', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Pixel Memory is BlackRoad\'s content-addressable storage system. Through deduplication, delta compression, and symbolic hashing, each physical byte encodes up to 4,096 logical bytes. The Sovereign tier uses Hybrid Memory with 34-position threshold addressing.' },
  { url: 'https://blackroad.io/roadc', title: 'RoadC — The BlackRoad Language', description: 'Custom programming language with Python-style indentation. fun keyword, let/var/const, match, spawn, space (3D).', domain: 'blackroad.io', category: 'tool', tags: 'roadc,language,programming,compiler,interpreter,custom', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadC is BlackRoad\'s custom programming language. Python-style indentation (colon + INDENT/DEDENT), fun keyword for functions, let/var/const declarations, match expressions, spawn for concurrency, and space for 3D. Lexer, Parser, Interpreter (tree-walking). Supports functions, recursion, if/elif/else, while, for, strings, integers, floats.' },
  { url: 'https://blackroad.io/mesh', title: 'Mesh Network — Every Link Is a Node', description: 'Browser tabs as compute nodes via WebGPU+WASM+WebRTC. Pi fleet as permanent backbone, browser nodes as elastic scale.', domain: 'blackroad.io', category: 'tool', tags: 'mesh,webgpu,wasm,webrtc,browser,compute,nodes', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'The BlackRoad Mesh Network turns every browser tab into a compute node. WebGPU for GPU inference, WASM for portable compute, WebRTC for peer-to-peer communication. The Pi fleet (26 TOPS) serves as the permanent backbone, while browser nodes provide elastic scale. Revenue: OpenAI-compatible API at 50% price.' },
  { url: 'https://blackroad.io/carpool', title: 'CarPool — Agent Discovery & Dispatch', description: 'Agent discovery, matching, and dispatch across the mesh network. Load balancing and failover.', domain: 'blackroad.io', category: 'tool', tags: 'carpool,agents,dispatch,discovery,matching,mesh', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'CarPool handles agent discovery, matching, and dispatch across the BlackRoad mesh. Agents register capabilities, CarPool routes tasks to the best-fit agent. Load balancing, failover, and model selection.' },
  { url: 'https://blackroad.io/roadid', title: 'RoadID — Sovereign Identity', description: 'Self-describing, routable digital identities. Not UUIDs — IDs that carry meaning.', domain: 'blackroad.io', category: 'tool', tags: 'roadid,identity,sovereign,did,self-describing,routable', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'RoadID provides self-describing, routable digital identities for agents and users. Unlike opaque UUIDs, RoadIDs carry semantic meaning — agent name, capabilities, location. Globally available as roadid command.' },
  { url: 'https://blackroad.io/nats', title: 'NATS Mesh — Agent Messaging', description: 'NATS v2.12.3 message bus connecting 4/5 Pi nodes. Pub/sub agent communication, event streaming.', domain: 'blackroad.io', category: 'tool', tags: 'nats,messaging,pubsub,events,agents,streaming', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'NATS v2.12.3 message bus live on the BlackRoad fleet. 4 of 5 nodes connected. Pub/sub agent communication for real-time events, task dispatch, and fleet coordination. JetStream persistence for durable subscriptions.' },
  { url: 'https://blackroad.io/squad-webhook', title: 'Squad Webhook — GitHub Agent Responders', description: '8 agents respond to @blackboxprogramming on GitHub. 69 repos hooked. Automated code review and triage.', domain: 'blackroad.io', category: 'tool', tags: 'squad,webhook,github,agents,code-review,automation', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Squad Webhook routes GitHub events to 8 AI agents that respond to @blackboxprogramming mentions. 69 repositories hooked. Automated code review, issue triage, PR feedback, and deployment notifications.' },

  // ── Docs / Pages ──
  { url: 'https://blackroad.io/pricing', title: 'BlackRoad Pricing — Simple. Sovereign. No Surprises.', description: 'Operator (free), Pro ($29/mo), Sovereign ($199/mo), Enterprise (custom). Plus add-ons: Lucidia Enhanced, RoadAuth, Context Bridge, Knowledge Hub.', domain: 'blackroad.io', category: 'docs', tags: 'pricing,plans,subscription,stripe,pro,sovereign,enterprise', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad OS pricing: Operator ($0, 1 node, 1 agent), Pro ($29/mo, 3 agents, 3 nodes), Sovereign ($199/mo, 8 agents, unlimited nodes, SLA), Enterprise (custom, white-label, on-prem). Add-ons: Lucidia Enhanced ($29/mo), RoadAuth Startup ($99/mo), Context Bridge ($10/mo), Knowledge Hub ($15/mo). All billing via Stripe.' },
  { url: 'https://blackroad.io/docs', title: 'BlackRoad Documentation', description: 'Complete documentation for BlackRoad OS, agents, APIs, and infrastructure deployment.', domain: 'blackroad.io', category: 'docs', tags: 'docs,documentation,api,deployment,guide', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'BlackRoad OS documentation covering installation, agent configuration, API reference, memory system, RoadChain integration, and infrastructure deployment guides. Getting started, CLI reference, and troubleshooting.' },
  { url: 'https://blackroad.io/blog', title: 'BlackRoad Blog', description: 'Technical blog covering sovereign infrastructure, AI agents, distributed systems, and the BlackRoad philosophy.', domain: 'blackroad.io', category: 'docs', tags: 'blog,articles,engineering,philosophy,updates', image: 'https://images.blackroad.io/pixel-art/road-logo.png', content: 'Technical articles: The Sovereign Manifesto, RoadNet Mesh Architecture, Self-Healing Infrastructure, The RoadC Language, and more. Engineering deep-dives and philosophical explorations of sovereign AI.' },
];

// ─── Verified Facts — claims that can be checked against live sources ──
const VERIFIED_FACTS = [
  // Format: { claim, field, verified_value, source, method, category }
  // These are seeded on /init and re-checked on /verify
  { claim: 'RoundTrip agents', field: 'roundtrip_agents', verified_value: 17, source: 'roundtrip.blackroad.io/api/agents', method: 'live_api', category: 'agents' },
  { claim: 'Auth users', field: 'auth_users', verified_value: 6, source: 'stats.blackroad.io/live', method: 'live_api', category: 'users' },
  { claim: 'Active subscriptions', field: 'active_subscriptions', verified_value: 4, source: 'stats.blackroad.io/live', method: 'live_api', category: 'revenue' },
  { claim: 'GitHub orgs', field: 'github_orgs', verified_value: 36, source: 'GitHub API /user/orgs', method: 'github_api', category: 'infrastructure' },
  { claim: 'Indexed search pages', field: 'indexed_pages', verified_value: 7870, source: 'stats.blackroad.io/live', method: 'live_api', category: 'search' },
  { claim: 'Total search queries', field: 'total_queries', verified_value: 1654, source: 'stats.blackroad.io/live', method: 'live_api', category: 'search' },
  { claim: 'Chat messages', field: 'chat_messages', verified_value: 10646, source: 'stats.blackroad.io/live', method: 'live_api', category: 'chat' },
  { claim: 'Pi fleet nodes online', field: 'nodes_online', verified_value: 4, source: 'SSH fleet scan 2026-03-27', method: 'fleet_scan', category: 'infrastructure' },
  { claim: 'Pi fleet nodes total', field: 'nodes_total', verified_value: 5, source: 'Hardware inventory', method: 'manual_audit', category: 'infrastructure' },
  { claim: 'Hailo-8 TOPS live', field: 'tops_live', verified_value: 26, source: 'Cecilia DOWN, only Octavia Hailo active', method: 'fleet_scan', category: 'hardware' },
  { claim: 'Hailo-8 TOPS total', field: 'tops_total', verified_value: 52, source: '2x Hailo-8 (Cecilia + Octavia)', method: 'hardware_spec', category: 'hardware' },
  { claim: 'Ollama models fleet-wide', field: 'ollama_models', verified_value: 38, source: 'ollama list on Alice:0 Lucidia:9 Octavia:25 Aria:4', method: 'fleet_scan', category: 'ai' },
  { claim: 'Custom domains', field: 'custom_domains', verified_value: 20, source: 'Cloudflare DNS zones', method: 'dns_audit', category: 'infrastructure' },
  { claim: 'Delaware C-Corp formation', field: 'incorporation_date', verified_value: '2025-11-17', source: 'Certificate of Incorporation, Stripe Atlas', method: 'legal_document', category: 'corporate' },
  { claim: 'EIN', field: 'ein', verified_value: '41-2663817', source: 'IRS CP 575 letter', method: 'legal_document', category: 'corporate' },
  { claim: 'Founder', field: 'founder', verified_value: 'Alexa Louise Amundson', source: 'Certificate of Incorporation', method: 'legal_document', category: 'corporate' },
  { claim: 'Droplet servers', field: 'droplets', verified_value: 2, source: 'DigitalOcean: gematria (nyc3) + anastasia (nyc1)', method: 'cloud_audit', category: 'infrastructure' },
  { claim: 'WireGuard mesh connections', field: 'wireguard_peers', verified_value: 12, source: 'wg show on fleet nodes', method: 'fleet_scan', category: 'network' },
  { claim: 'Stripe pay customers', field: 'stripe_customers', verified_value: 10, source: 'stats.blackroad.io/live', method: 'live_api', category: 'revenue' },
  { claim: 'Gitea repos', field: 'gitea_repos', verified_value: 0, source: 'Gitea API on Octavia:3100 — DB empty, needs re-mirror', method: 'live_api', category: 'infrastructure' },
];

// Claims that are KNOWN FALSE and should be flagged
const FALSE_CLAIMS = [
  { claim: '200 agents', real: '17 RoundTrip agents verified', severity: 'inflated', where: 'stats API ecosystem.agents' },
  { claim: '30,000 agents', real: '17 agents', severity: 'false', where: 'legacy LICENSE files (mostly cleaned)' },
  { claim: '629 Gitea repos', real: '0 — Gitea DB is empty, needs re-mirror', severity: 'false', where: 'multiple site descriptions' },
  { claim: '52 TOPS always available', real: '26 TOPS — Cecilia is offline', severity: 'partial', where: 'site descriptions' },
  { claim: '163 active chat agents', real: 'unverified — chat worker generates synthetic agent names', severity: 'inflated', where: 'stats API chat.active_agents' },
  { claim: '50 Workers', real: 'unverified count', severity: 'unverified', where: 'stats API ecosystem.workers' },
];

// ─── RoadChain — Hash-chain ledger for verified facts ─────────────────
// Every fact verification gets a block: hash(prev_hash + data + timestamp)
// Immutable audit trail. No fact can be changed without breaking the chain.

async function hashBlock(data) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(data));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function addToChain(db, action, entity, data) {
  // Get previous block hash
  const prev = await db.prepare('SELECT block_hash FROM roadchain ORDER BY id DESC LIMIT 1').first();
  const prevHash = prev?.block_hash || '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ action, entity, data, timestamp });
  const blockHash = await hashBlock(prevHash + payload);

  await db.prepare(
    `INSERT INTO roadchain (prev_hash, block_hash, action, entity, data, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(prevHash, blockHash, action, entity, payload, timestamp).run();

  return { block_hash: blockHash, prev_hash: prevHash, action, entity };
}

async function handleChain(env) {
  const [blocks, stats] = await Promise.all([
    env.DB.prepare('SELECT * FROM roadchain ORDER BY id DESC LIMIT 50').all(),
    env.DB.prepare('SELECT COUNT(*) as total, MIN(created_at) as first_block, MAX(created_at) as last_block FROM roadchain').first(),
  ]);

  // Verify chain integrity
  const allBlocks = await env.DB.prepare('SELECT * FROM roadchain ORDER BY id ASC').all();
  let chainValid = true;
  let breakPoint = null;
  const chain = allBlocks.results || [];
  for (let i = 1; i < chain.length; i++) {
    const expectedPrev = chain[i - 1].block_hash;
    if (chain[i].prev_hash !== expectedPrev) {
      chainValid = false;
      breakPoint = { block_id: chain[i].id, expected: expectedPrev, got: chain[i].prev_hash };
      break;
    }
  }

  return Response.json({
    chain_valid: chainValid,
    break_point: breakPoint,
    total_blocks: stats?.total || 0,
    first_block: stats?.first_block ? new Date(stats.first_block * 1000).toISOString() : null,
    last_block: stats?.last_block ? new Date(stats.last_block * 1000).toISOString() : null,
    recent_blocks: (blocks.results || []).map(b => ({
      id: b.id,
      hash: b.block_hash,
      prev: b.prev_hash?.slice(0, 16) + '...',
      action: b.action,
      entity: b.entity,
      time: new Date(b.created_at * 1000).toISOString(),
    })),
  });
}

// ─── Init DB ──────────────────────────────────────────────────────────
async function initDB(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      domain TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'page',
      tags TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      indexed_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch()),
      clicks INTEGER DEFAULT 0
    )`,
    `CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(
      title, description, content, tags,
      content=pages, content_rowid=id
    )`,
    `CREATE TRIGGER IF NOT EXISTS pages_ai AFTER INSERT ON pages BEGIN
      INSERT INTO pages_fts(rowid, title, description, content, tags)
      VALUES (new.id, new.title, new.description, new.content, new.tags);
    END`,
    `CREATE TRIGGER IF NOT EXISTS pages_ad AFTER DELETE ON pages BEGIN
      INSERT INTO pages_fts(pages_fts, rowid, title, description, content, tags)
      VALUES ('delete', old.id, old.title, old.description, old.content, old.tags);
    END`,
    `CREATE TRIGGER IF NOT EXISTS pages_au AFTER UPDATE ON pages BEGIN
      INSERT INTO pages_fts(pages_fts, rowid, title, description, content, tags)
      VALUES ('delete', old.id, old.title, old.description, old.content, old.tags);
      INSERT INTO pages_fts(rowid, title, description, content, tags)
      VALUES (new.id, new.title, new.description, new.content, new.tags);
    END`,
    `CREATE TABLE IF NOT EXISTS queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      ai_answered INTEGER DEFAULT 0,
      ip TEXT DEFAULT '',
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    // ── Verified Facts table ──
    `CREATE TABLE IF NOT EXISTS verified_facts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      claim TEXT NOT NULL,
      field TEXT UNIQUE NOT NULL,
      verified_value TEXT NOT NULL DEFAULT '',
      claimed_value TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT '',
      method TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'unverified',
      last_verified INTEGER DEFAULT (unixepoch()),
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    // ── False Claims tracker ──
    `CREATE TABLE IF NOT EXISTS false_claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      claim TEXT NOT NULL,
      real_value TEXT NOT NULL DEFAULT '',
      severity TEXT NOT NULL DEFAULT 'unverified',
      location TEXT NOT NULL DEFAULT '',
      fixed INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      fixed_at INTEGER DEFAULT NULL
    )`,
    // ── RoadChain ledger ──
    `CREATE TABLE IF NOT EXISTS roadchain (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prev_hash TEXT NOT NULL,
      block_hash TEXT NOT NULL,
      action TEXT NOT NULL DEFAULT '',
      entity TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL DEFAULT '',
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_pages_domain ON pages(domain)`,
    `CREATE INDEX IF NOT EXISTS idx_pages_category ON pages(category)`,
    `CREATE INDEX IF NOT EXISTS idx_queries_created ON queries(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_facts_category ON verified_facts(category)`,
    `CREATE INDEX IF NOT EXISTS idx_facts_status ON verified_facts(status)`,
    `CREATE INDEX IF NOT EXISTS idx_false_claims_severity ON false_claims(severity)`,
    `CREATE INDEX IF NOT EXISTS idx_chain_hash ON roadchain(block_hash)`,
  ];

  for (const sql of statements) {
    try { await db.prepare(sql).run(); } catch (e) { console.log('Schema skip:', e.message); }
  }

  // Migration: add image column if missing (existing databases)
  try { await db.prepare("ALTER TABLE pages ADD COLUMN image TEXT NOT NULL DEFAULT ''").run(); } catch (e) { /* column already exists */ }

  // Seed pages
  let upserted = 0;
  for (const page of SEED_PAGES) {
    await db.prepare(
      `INSERT INTO pages (url, title, description, content, domain, category, tags, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(url) DO UPDATE SET title=excluded.title, description=excluded.description,
       content=excluded.content, domain=excluded.domain, category=excluded.category, tags=excluded.tags,
       image=CASE WHEN excluded.image != '' THEN excluded.image ELSE pages.image END`
    ).bind(page.url, page.title, page.description, page.content, page.domain, page.category, page.tags, page.image || '').run();
    upserted++;
  }

  // Seed verified facts
  for (const fact of VERIFIED_FACTS) {
    await db.prepare(
      `INSERT INTO verified_facts (claim, field, verified_value, source, method, category, status)
       VALUES (?, ?, ?, ?, ?, ?, 'verified')
       ON CONFLICT(field) DO UPDATE SET
         verified_value=excluded.verified_value, source=excluded.source,
         method=excluded.method, category=excluded.category, status='verified',
         last_verified=unixepoch()`
    ).bind(fact.claim, fact.field, String(fact.verified_value), fact.source, fact.method, fact.category).run();
  }

  // Seed known false claims
  for (const fc of FALSE_CLAIMS) {
    await db.prepare(
      `INSERT OR IGNORE INTO false_claims (claim, real_value, severity, location)
       VALUES (?, ?, ?, ?)`
    ).bind(fc.claim, fc.real, fc.severity, fc.where).run();
  }

  // Chain the genesis block + all verified facts into RoadChain
  const chainCount = await db.prepare('SELECT COUNT(*) as c FROM roadchain').first();
  if (!chainCount?.c || chainCount.c === 0) {
    await addToChain(db, 'genesis', 'roadchain', { message: 'RoadSearch Verified v3 — Truth chain initialized', facts: VERIFIED_FACTS.length, false_claims: FALSE_CLAIMS.length });
    for (const fact of VERIFIED_FACTS) {
      await addToChain(db, 'verify', fact.field, { claim: fact.claim, value: fact.verified_value, source: fact.source, method: fact.method });
    }
    for (const fc of FALSE_CLAIMS) {
      await addToChain(db, 'flag', 'false_claim', { claim: fc.claim, real: fc.real, severity: fc.severity });
    }
  }

  return upserted;
}

// ─── Snippet with highlighting ────────────────────────────────────────
function buildSnippet(text, query, maxLen = 220) {
  if (!text) return '';
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
  // Find the best window around the first match
  const lower = text.toLowerCase();
  let bestPos = 0;
  for (const w of words) {
    const idx = lower.indexOf(w);
    if (idx >= 0) { bestPos = Math.max(0, idx - 40); break; }
  }
  let snippet = text.slice(bestPos, bestPos + maxLen);
  if (bestPos > 0) snippet = '...' + snippet;
  if (bestPos + maxLen < text.length) snippet += '...';
  return snippet;
}

// ─── Smart Summary (fallback when Ollama is down) ─────────────────────
function buildSmartSummary(query, results) {
  if (!results.length) return null;
  const top = results.slice(0, 3);
  // Extract the most relevant sentences from descriptions
  const sentences = [];
  for (const r of top) {
    const text = r.description || r.snippet || '';
    // Split into sentences and pick ones containing query terms
    const parts = text.split(/(?<=[.!?])\s+/);
    const qWords = query.toLowerCase().split(/\s+/);
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (qWords.some(w => lower.includes(w)) && part.length > 15) {
        sentences.push(part.trim());
      }
    }
    if (!sentences.length && parts.length) {
      sentences.push(parts[0].trim());
    }
  }
  // Deduplicate and limit
  const unique = [...new Set(sentences)].slice(0, 3);
  if (!unique.length) {
    return `${top[0].title}: ${top[0].description || top[0].snippet || ''}`.slice(0, 280);
  }
  let summary = unique.join(' ');
  // Add source attribution
  const sources = top.map(r => `[${r.title}](${r.url})`).join(', ');
  summary += `\n\nSources: ${sources}`;
  return summary;
}

// ─── Search ───────────────────────────────────────────────────────────
async function handleSearch(request, env) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  const category = url.searchParams.get('category');
  const domain = url.searchParams.get('domain');
  const fromDate = url.searchParams.get('from');
  const toDate = url.searchParams.get('to');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
  const ai = url.searchParams.get('ai') !== 'false';
  const offset = (page - 1) * limit;

  if (!q || q.length < 2) {
    return Response.json({ error: 'Query must be at least 2 characters', param: 'q' }, { status: 400 });
  }

  // Log search for trending
  try {
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS search_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, query TEXT, ip TEXT, ts TEXT DEFAULT (datetime('now'))
    )`).run();
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    await env.DB.prepare('INSERT INTO search_log (query, ip) VALUES (?, ?)').bind(q.slice(0, 200), ip).run();
  } catch {}

  // ── Instant Answers (G(n) calculator, math) ──
  const gnMatch = q.match(/^[Gg]\s*\(\s*(\d+)\s*\)$/);
  if (gnMatch) {
    const n = parseInt(gnMatch[1]);
    if (n >= 1 && n <= 10000) {
      const gn = Math.pow(n, n + 1) / Math.pow(n + 1, n);
      const ratio = gn / n;
      return Response.json({
        query: q, instant_answer: { type: 'amundson_gn', n, value: gn, ratio_to_n: ratio, converges_to: '1/e ≈ 0.367879441', formula: 'G(n) = n^(n+1) / (n+1)^n', source: 'Amundson Framework' },
        results: [], total: 0, page: 1, pages: 0, duration_ms: 0,
      });
    }
  }
  const mathMatch = q.match(/^(\d+)\s*[\+\-\*\/\^]\s*(\d+)$/);
  if (mathMatch) {
    try {
      const result = q.includes('^') ? Math.pow(parseFloat(q.split('^')[0]), parseFloat(q.split('^')[1])) : eval(q.replace('^','**'));
      return Response.json({
        query: q, instant_answer: { type: 'math', expression: q, result, source: 'calculator' },
        results: [], total: 0, page: 1, pages: 0, duration_ms: 0,
      });
    } catch {}
  }

  const startMs = Date.now();

  // ── FTS5 search with ranking ──
  let ftsQuery = q.replace(/[^\w\s\-\.]/g, '').split(/\s+/).filter(w => w.length >= 1).map(w => w + '*').join(' OR ');
  if (!ftsQuery || ftsQuery.trim() === '') {
    ftsQuery = null;
  }

  // Count total results first
  let totalCount = 0;
  let countSql = `
    SELECT COUNT(*) as c
    FROM pages_fts f
    JOIN pages p ON p.id = f.rowid
    WHERE pages_fts MATCH ?
  `;
  const countParams = [ftsQuery];
  if (category) { countSql += ' AND p.category = ?'; countParams.push(category); }
  if (domain) { countSql += ' AND p.domain = ?'; countParams.push(domain); }
  if (fromDate) { countSql += ' AND p.indexed_at >= ?'; countParams.push(Math.floor(new Date(fromDate).getTime() / 1000)); }
  if (toDate) { countSql += ' AND p.indexed_at <= ?'; countParams.push(Math.floor(new Date(toDate).getTime() / 1000) + 86400); }

  let sql = `
    SELECT p.id, p.url, p.title, p.description, p.content, p.domain, p.category, p.tags, p.image,
           rank as relevance
    FROM pages_fts f
    JOIN pages p ON p.id = f.rowid
    WHERE pages_fts MATCH ?
  `;
  const params = [ftsQuery];

  if (category) { sql += ' AND p.category = ?'; params.push(category); }
  if (domain) { sql += ' AND p.domain = ?'; params.push(domain); }
  if (fromDate) { sql += ' AND p.indexed_at >= ?'; params.push(Math.floor(new Date(fromDate).getTime() / 1000)); }
  if (toDate) { sql += ' AND p.indexed_at <= ?'; params.push(Math.floor(new Date(toDate).getTime() / 1000) + 86400); }
  sql += ' ORDER BY rank LIMIT ? OFFSET ?';
  params.push(limit, offset);

  let results;
  let usedFallback = false;
  try {
    if (!ftsQuery) throw new Error('Empty FTS query, use fallback');
    const [countResult, searchResult] = await Promise.all([
      env.DB.prepare(countSql).bind(...countParams).first(),
      env.DB.prepare(sql).bind(...params).all(),
    ]);
    totalCount = countResult?.c || 0;
    results = searchResult;
  } catch {
    usedFallback = true;
    let likeSql = `SELECT id, url, title, description, content, domain, category, tags, image, 0 as relevance FROM pages WHERE (title LIKE ? OR description LIKE ? OR content LIKE ? OR tags LIKE ?)`;
    const likeQ = `%${q}%`;
    const likeParams = [likeQ, likeQ, likeQ, likeQ];
    if (category) { likeSql += ' AND category = ?'; likeParams.push(category); }
    if (domain) { likeSql += ' AND domain = ?'; likeParams.push(domain); }

    let likeCountSql = `SELECT COUNT(*) as c FROM pages WHERE (title LIKE ? OR description LIKE ? OR content LIKE ? OR tags LIKE ?)`;
    const likeCountParams = [likeQ, likeQ, likeQ, likeQ];
    if (category) { likeCountSql += ' AND category = ?'; likeCountParams.push(category); }
    if (domain) { likeCountSql += ' AND domain = ?'; likeCountParams.push(domain); }

    likeSql += ' LIMIT ? OFFSET ?';
    likeParams.push(limit, offset);

    const [countResult, searchResult] = await Promise.all([
      env.DB.prepare(likeCountSql).bind(...likeCountParams).first(),
      env.DB.prepare(likeSql).bind(...likeParams).all(),
    ]);
    totalCount = countResult?.c || 0;
    results = searchResult;
  }

  // ── Snippet generation with query highlighting ──
  const items = (results.results || []).map(r => {
    const snippet = buildSnippet(r.description || r.content || '', q);
    const maxRel = Math.abs(r.relevance || 0);
    return {
      url: r.url,
      title: r.title,
      snippet,
      domain: r.domain,
      category: r.category,
      image: r.image || null,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()) : [],
      relevance: maxRel,
    };
  });

  // Normalize relevance to 0-1 range for the score bar
  if (items.length > 0) {
    const maxRel = Math.max(...items.map(i => i.relevance), 0.001);
    items.forEach(i => { i.score = Math.max(0.1, i.relevance / maxRel); });
  }

  // ── AI Answer (with smart summary fallback) ──
  let aiAnswer = null;
  let aiSource = null;
  if (ai && items.length > 0 && q.length >= 3) {
    const cacheKey = `ai:${q.toLowerCase().replace(/\s+/g, '-').slice(0, 60)}`;
    const cached = await env.CACHE.get(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        aiAnswer = parsed.answer;
        aiSource = parsed.source;
      } catch {
        aiAnswer = cached;
        aiSource = 'cache';
      }
    } else {
      try {
        aiAnswer = await generateAIAnswer(q, items, env);
        if (aiAnswer) {
          aiSource = 'ollama';
          await env.CACHE.put(cacheKey, JSON.stringify({ answer: aiAnswer, source: 'ollama' }), { expirationTtl: 3600 });
        }
      } catch (err) {
        console.error('AI answer error:', err.message);
      }

      // Fallback to smart summary if AI failed
      if (!aiAnswer) {
        aiAnswer = buildSmartSummary(q, items);
        aiSource = 'summary';
        if (aiAnswer) {
          await env.CACHE.put(cacheKey, JSON.stringify({ answer: aiAnswer, source: 'summary' }), { expirationTtl: 1800 });
        }
      }
    }
  }

  // ── Federated search: pull from RoundTrip + BackRoad ──
  if (items.length < limit) {
    try {
      const federated = await federatedSearch(q, env);
      for (const f of federated) {
        if (!items.find(i => i.title === f.title)) {
          items.push({ ...f, relevance: 0, score: f.score || 0.5, snippet: f.description || '' });
        }
      }
    } catch {}
  }

  const durationMs = Date.now() - startMs;

  // ── Log query + track popular queries in KV ──
  try {
    await env.DB.prepare(
      'INSERT INTO queries (query, results_count, ai_answered, ip) VALUES (?, ?, ?, ?)'
    ).bind(q, items.length, aiAnswer ? 1 : 0, request.headers.get('cf-connecting-ip') || '').run();

    // Track in KV for fast trending
    const trendKey = `trend:${q.toLowerCase().replace(/\s+/g, ' ').slice(0, 40)}`;
    const current = parseInt(await env.CACHE.get(trendKey) || '0');
    await env.CACHE.put(trendKey, String(current + 1), { expirationTtl: 604800 });
  } catch (e) {
    console.error('Analytics error:', e.message);
  }

  // Check if any results contain known false claims
  const flagged = [];
  for (const item of items) {
    const text = `${item.title} ${item.snippet}`.toLowerCase();
    if (text.includes('200 agent') || text.includes('30,000 agent') || text.includes('30000 agent')) {
      flagged.push({ result: item.title, issue: 'Inflated agent count', verified: '17 RoundTrip agents (live verified)' });
    }
    if (text.includes('629 gitea') || text.includes('629 repo')) {
      flagged.push({ result: item.title, issue: 'Gitea repo count incorrect', verified: 'Gitea DB is empty — needs re-mirror' });
    }
    if (text.includes('52 tops') && !text.includes('total')) {
      flagged.push({ result: item.title, issue: 'TOPS claim — Cecilia offline', verified: '26 TOPS live (Octavia only), 52 total hardware' });
    }
  }

  return Response.json({
    query: q,
    results: items,
    total: totalCount,
    page,
    pages: Math.ceil(totalCount / limit),
    limit,
    ai_answer: aiAnswer,
    ai_source: aiSource,
    duration_ms: durationMs,
    filters: { category, domain },
    verification: {
      flagged_claims: flagged,
      engine: 'RoadSearch Verified v3',
      note: flagged.length > 0 ? 'Some results contain claims that differ from verified data' : 'No discrepancies detected',
    },
  });
}

// ─── AI Answer Generation ─────────────────────────────────────────────
async function generateAIAnswer(query, results, env) {
  const context = results.slice(0, 5).map(r =>
    `[${r.title}](${r.url}): ${r.snippet}`
  ).join('\n');

  // Build fact-check context if query mentions numbers/stats
  const statsKeywords = ['how many', 'count', 'number', 'agents', 'repos', 'users', 'nodes', 'tops', 'models'];
  const isStatsQuery = statsKeywords.some(k => query.toLowerCase().includes(k));
  const factContext = isStatsQuery ? `\n\nVERIFIED FACTS (use these exact numbers, not inflated claims):\n- RoundTrip agents: 17 (verified live)\n- Auth users: 6 (verified live)\n- Ollama models across fleet: 38 (Alice:0, Lucidia:9, Octavia:25, Aria:4)\n- Pi nodes online: 4 of 5 (Cecilia offline)\n- Hailo-8 TOPS live: 26 (one unit offline)\n- GitHub orgs: 36\n- Custom domains: 20\n- Stripe customers: 10\n- Active subscriptions: 4\nIMPORTANT: If any search result claims 200+ agents, 30K agents, 629 Gitea repos, or 52 TOPS always-on — those are WRONG. Use verified numbers above.` : '';

  const prompt = `You are RoadSearch, BlackRoad OS's verified search engine. Answer this query concisely (2-3 sentences max) using ONLY the context below. If the context doesn't contain enough info, say so briefly. Never make things up. Include relevant URLs as markdown links. If a claim in the results contradicts the verified facts, use the verified number instead and note the correction.

Query: ${query}

Context:
${context}${factContext}

Answer:`;

  // Use Workers AI (free, fast, no API key needed)
  if (env.AI) {
    try {
      const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200, temperature: 0.3,
      });
      if (result.response) return result.response.trim();
    } catch (e) { console.log('[search-ai] Workers AI error:', e.message); }
  }

  // Fallback: try Ollama
  try {
    const res = await fetch(`${env.OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistral', prompt, stream: false, options: { num_predict: 200, temperature: 0.3 } }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) { const data = await res.json(); return data.response?.trim() || null; }
  } catch {}

  return null;
}

// ── Federated Search: search across RoundTrip agents + BackRoad posts ──
async function federatedSearch(query, env) {
  const extra = [];

  // Search RoundTrip agents
  try {
    const r = await fetch('https://roundtrip.blackroad.io/api/agents', { signal: AbortSignal.timeout(3000) });
    const data = await r.json();
    const agents = Array.isArray(data) ? data : data.agents || [];
    const q = query.toLowerCase();
    for (const a of agents) {
      const name = (a.name || a.id || '').toLowerCase();
      const role = (a.role || a.type || '').toLowerCase();
      const caps = (a.capabilities || []).join(' ').toLowerCase();
      if (name.includes(q) || role.includes(q) || caps.includes(q)) {
        extra.push({ url: 'https://roundtrip.blackroad.io', title: `Agent: ${a.name} (${a.role || a.type})`, description: a.persona?.slice(0, 150) || `${a.name} — ${a.role || a.type}`, domain: 'roundtrip.blackroad.io', category: 'agent', tags: `agent,${a.group || ''}`, score: 0.8 });
      }
    }
  } catch {}

  // Search BackRoad posts
  try {
    const r = await fetch(`https://backroad-social.amundsonalexa.workers.dev/api/posts?limit=20`, { signal: AbortSignal.timeout(3000) });
    const data = await r.json();
    const q = query.toLowerCase();
    for (const p of data.posts || []) {
      if ((p.content || '').toLowerCase().includes(q) || (p.tags || []).some(t => t.includes(q))) {
        extra.push({ url: 'https://backroad-social.amundsonalexa.workers.dev', title: `@${p.handle}: ${p.content.slice(0, 80)}`, description: p.content.slice(0, 200), domain: 'backroad.social', category: 'post', tags: (p.tags || []).join(','), score: 0.6 });
      }
    }
  } catch {}

  return extra;
}

// ─── Suggest / Autocomplete ───────────────────────────────────────────
async function handleSuggest(request, env) {
  const q = new URL(request.url).searchParams.get('q')?.trim();
  if (!q || q.length < 1) {
    return Response.json({ suggestions: [] });
  }

  const [titleResults, recentResults] = await Promise.all([
    env.DB.prepare(
      `SELECT DISTINCT title FROM pages WHERE title LIKE ? LIMIT 8`
    ).bind(`%${q}%`).all(),
    env.DB.prepare(
      `SELECT DISTINCT query FROM queries WHERE query LIKE ? AND results_count > 0 ORDER BY created_at DESC LIMIT 5`
    ).bind(`%${q}%`).all(),
  ]);

  const suggestions = (titleResults.results || []).map(r => r.title);
  const recent = (recentResults.results || []).map(r => r.query);

  return Response.json({ suggestions, recent });
}

// ─── Trending / Stats ─────────────────────────────────────────────────
async function handleStats(env) {
  const [totalPages, totalQueries, todayQueries, topQueries, categories, domains] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as c FROM pages').first(),
    env.DB.prepare('SELECT COUNT(*) as c FROM queries').first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM queries WHERE created_at > unixepoch() - 86400").first(),
    env.DB.prepare(
      `SELECT query, COUNT(*) as count FROM queries
       WHERE created_at > unixepoch() - 604800
       GROUP BY query ORDER BY count DESC LIMIT 10`
    ).all(),
    env.DB.prepare('SELECT category, COUNT(*) as count FROM pages GROUP BY category ORDER BY count DESC').all(),
    env.DB.prepare('SELECT domain, COUNT(*) as count FROM pages GROUP BY domain ORDER BY count DESC LIMIT 20').all(),
  ]);

  return Response.json({
    indexed_pages: totalPages?.c || 0,
    total_queries: totalQueries?.c || 0,
    queries_24h: todayQueries?.c || 0,
    trending: (topQueries.results || []).map(r => ({ query: r.query, count: r.count })),
    categories: (categories.results || []).map(r => ({ name: r.category, count: r.count })),
    domains: (domains.results || []).map(r => ({ name: r.domain, count: r.count })),
  });
}

// ─── Index page (add to search index) ─────────────────────────────────
async function handleIndex(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !env.INDEX_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode('auth-check'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expectedMac = await crypto.subtle.sign('HMAC', key, enc.encode(`Bearer ${env.INDEX_KEY}`));
  const actualMac = await crypto.subtle.sign('HMAC', key, enc.encode(auth));
  const expectedArr = new Uint8Array(expectedMac);
  const actualArr = new Uint8Array(actualMac);
  let match = expectedArr.length === actualArr.length;
  for (let i = 0; i < expectedArr.length; i++) match &= expectedArr[i] === actualArr[i];
  if (!match) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let pages;
  try { pages = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const toIndex = Array.isArray(pages) ? pages : [pages];
  let indexed = 0;

  for (const page of toIndex) {
    if (!page.url || !page.title) continue;
    await env.DB.prepare(`
      INSERT INTO pages (url, title, description, content, domain, category, tags, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(url) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        content = excluded.content,
        domain = excluded.domain,
        category = excluded.category,
        tags = excluded.tags,
        image = CASE WHEN excluded.image != '' THEN excluded.image ELSE pages.image END,
        updated_at = unixepoch()
    `).bind(
      page.url,
      page.title,
      page.description || '',
      page.content || '',
      page.domain || new URL(page.url).hostname,
      page.category || 'page',
      page.tags || '',
      page.image || '',
    ).run();
    indexed++;
  }

  return Response.json({ ok: true, indexed });
}

// ─── Rebuild FTS Index ───────────────────────────────────────────────
async function handleRebuild(env) {
  try { await env.DB.prepare("INSERT INTO pages_fts(pages_fts) VALUES('rebuild')").run(); } catch {}
  const count = await env.DB.prepare('SELECT COUNT(*) as c FROM pages').first();
  return Response.json({ ok: true, rebuilt: count?.c || 0, note: 'FTS rebuild triggered' });
}

// ─── Verified Facts API ──────────────────────────────────────────────
async function handleFacts(env) {
  const [facts, falseClaims, factsByCategory] = await Promise.all([
    env.DB.prepare('SELECT * FROM verified_facts ORDER BY category, claim').all(),
    env.DB.prepare('SELECT * FROM false_claims ORDER BY severity DESC, claim').all(),
    env.DB.prepare('SELECT category, COUNT(*) as count, SUM(CASE WHEN status = \'verified\' THEN 1 ELSE 0 END) as verified FROM verified_facts GROUP BY category').all(),
  ]);

  const allFacts = (facts.results || []);
  const verified = allFacts.filter(f => f.status === 'verified').length;
  const total = allFacts.length;

  return Response.json({
    trust_score: total > 0 ? Math.round((verified / total) * 100) : 0,
    total_facts: total,
    verified_count: verified,
    unverified_count: total - verified,
    false_claims_count: (falseClaims.results || []).filter(f => !f.fixed).length,
    facts: allFacts.map(f => ({
      claim: f.claim,
      field: f.field,
      value: f.verified_value,
      source: f.source,
      method: f.method,
      category: f.category,
      status: f.status,
      last_verified: f.last_verified ? new Date(f.last_verified * 1000).toISOString() : null,
    })),
    false_claims: (falseClaims.results || []).map(f => ({
      claim: f.claim,
      real: f.real_value,
      severity: f.severity,
      where: f.location,
      fixed: !!f.fixed,
    })),
    categories: (factsByCategory.results || []).map(c => ({
      name: c.category,
      total: c.count,
      verified: c.verified,
    })),
    last_updated: new Date().toISOString(),
  });
}

// ─── Live Verification — re-check facts against real sources ─────────
async function handleVerify(env) {
  const results = [];
  const errors = [];

  // 1. Check RoundTrip agents (live)
  try {
    const r = await fetch('https://roundtrip.blackroad.io/api/agents', { signal: AbortSignal.timeout(5000) });
    const data = await r.json();
    const agents = Array.isArray(data) ? data : data.agents || [];
    const count = agents.length;
    await env.DB.prepare(
      `UPDATE verified_facts SET verified_value = ?, status = 'verified', last_verified = unixepoch() WHERE field = 'roundtrip_agents'`
    ).bind(String(count)).run();
    results.push({ field: 'roundtrip_agents', value: count, status: 'verified' });
  } catch (e) {
    errors.push({ field: 'roundtrip_agents', error: e.message });
  }

  // 2. Check live stats API
  try {
    const r = await fetch('https://stats.blackroad.io/live', { signal: AbortSignal.timeout(5000) });
    const data = await r.json();

    const updates = [
      { field: 'auth_users', value: data.auth?.users },
      { field: 'active_subscriptions', value: data.pay?.active_subscriptions },
      { field: 'stripe_customers', value: data.pay?.customers },
      { field: 'indexed_pages', value: data.search?.indexed_pages },
      { field: 'total_queries', value: data.search?.total_queries },
      { field: 'chat_messages', value: data.chat?.total_messages },
    ];

    for (const u of updates) {
      if (u.value !== undefined && u.value !== null) {
        await env.DB.prepare(
          `UPDATE verified_facts SET verified_value = ?, status = 'verified', last_verified = unixepoch() WHERE field = ?`
        ).bind(String(u.value), u.field).run();
        results.push({ field: u.field, value: u.value, status: 'verified' });
      }
    }

    // Check for inflated claims in the stats response
    const claimedAgents = data.ecosystem?.agents || 0;
    if (claimedAgents > 50) {
      // Flag if stats API still claims inflated agent count
      await env.DB.prepare(
        `UPDATE false_claims SET fixed = 0 WHERE claim = '200 agents' AND fixed = 1`
      ).run();
    }
  } catch (e) {
    errors.push({ field: 'stats_api', error: e.message });
  }

  // 3. Fact-check: compare claimed vs verified for discrepancies
  const discrepancies = [];
  const allFacts = await env.DB.prepare('SELECT * FROM verified_facts').all();
  for (const fact of (allFacts.results || [])) {
    if (fact.claimed_value && fact.claimed_value !== fact.verified_value) {
      discrepancies.push({
        claim: fact.claim,
        claimed: fact.claimed_value,
        verified: fact.verified_value,
        field: fact.field,
      });
    }
  }

  // Chain the verification event
  try {
    await addToChain(env.DB, 're-verify', 'batch', { verified: results.length, errors: errors.length, discrepancies: discrepancies.length });
    for (const r of results) {
      await addToChain(env.DB, 'confirm', r.field, { value: r.value, status: r.status });
    }
  } catch (e) { console.error('Chain write error:', e.message); }

  return Response.json({
    verified: results.length,
    error_count: errors.length,
    discrepancy_count: discrepancies.length,
    results,
    check_errors: errors,
    discrepancies,
    chained: true,
    checked_at: new Date().toISOString(),
  });
}

// ─── Fact Check a specific claim ─────────────────────────────────────
async function handleFactCheck(request, env) {
  const url = new URL(request.url);
  const claim = url.searchParams.get('claim')?.trim();
  if (!claim) return Response.json({ error: 'claim parameter required' }, { status: 400 });

  // Search verified facts
  const factResult = await env.DB.prepare(
    `SELECT * FROM verified_facts WHERE claim LIKE ? OR field LIKE ?`
  ).bind(`%${claim}%`, `%${claim}%`).all();

  // Search false claims
  const falseResult = await env.DB.prepare(
    `SELECT * FROM false_claims WHERE claim LIKE ? OR real_value LIKE ?`
  ).bind(`%${claim}%`, `%${claim}%`).all();

  const facts = (factResult.results || []);
  const falses = (falseResult.results || []);

  let verdict = 'unknown';
  if (falses.length > 0 && !falses[0].fixed) {
    verdict = 'false';
  } else if (facts.length > 0 && facts[0].status === 'verified') {
    verdict = 'verified';
  } else if (facts.length > 0) {
    verdict = 'unverified';
  }

  return Response.json({
    query: claim,
    verdict,
    facts: facts.map(f => ({
      claim: f.claim,
      value: f.verified_value,
      source: f.source,
      method: f.method,
      status: f.status,
      last_verified: f.last_verified ? new Date(f.last_verified * 1000).toISOString() : null,
    })),
    false_claims: falses.map(f => ({
      claim: f.claim,
      real: f.real_value,
      severity: f.severity,
      fixed: !!f.fixed,
    })),
  });
}

// ─── Lucky (redirect to top result) ──────────────────────────────────
async function handleLucky(request, env) {
  const q = new URL(request.url).searchParams.get('q')?.trim();
  if (!q) return Response.json({ error: 'q required' }, { status: 400 });

  const ftsQuery = q.replace(/[^\w\s\-\.]/g, '').split(/\s+/).map(w => `"${w}"*`).join(' OR ');
  let result;
  try {
    result = await env.DB.prepare(
      `SELECT p.url FROM pages_fts f JOIN pages p ON p.id = f.rowid WHERE pages_fts MATCH ? ORDER BY rank LIMIT 1`
    ).bind(ftsQuery).first();
  } catch {
    result = await env.DB.prepare(
      `SELECT url FROM pages WHERE title LIKE ? OR description LIKE ? LIMIT 1`
    ).bind(`%${q}%`, `%${q}%`).first();
  }

  if (result?.url) {
    try {
      const target = new URL(result.url);
      const allowed = ['blackroad.io', 'blackroad.company', 'blackroad.network', 'blackroad.systems',
        'blackroad.me', 'roadcoin.io', 'roadchain.io', 'lucidia.studio', 'lucidiaqi.com',
        'blackroadqi.com', 'aliceqi.com', 'blackroadai.com', 'lucidia.earth', 'blackboxprogramming.io',
        'blackroadinc.us', 'blackroadquantum.com', 'blackroadquantum.net', 'blackroadquantum.info',
        'blackroadquantum.shop', 'blackroadquantum.store'];
      const isAllowed = allowed.some(d => target.hostname === d || target.hostname.endsWith('.' + d));
      if (!isAllowed) {
        return Response.json({ error: 'External redirect blocked', url: result.url }, { status: 403 });
      }
    } catch {
      return Response.json({ error: 'Invalid URL in index' }, { status: 500 });
    }
    return Response.redirect(result.url, 302);
  }
  return Response.json({ error: 'No results found' }, { status: 404 });
}

// ─── Crawl og:image from indexed pages ───────────────────────────────
async function handleCrawlImages(env) {
  // Fetch pages that have no image yet
  const pages = await env.DB.prepare(
    `SELECT id, url, domain FROM pages WHERE image = '' OR image IS NULL ORDER BY updated_at DESC LIMIT 50`
  ).all();

  const results = [];
  const rows = pages.results || [];

  // Process in batches of 10 for concurrency
  for (let i = 0; i < rows.length; i += 10) {
    const batch = rows.slice(i, i + 10);
    const promises = batch.map(async (page) => {
      try {
        const resp = await fetch(page.url, {
          headers: { 'User-Agent': 'RoadSearch/3.0 (og:image crawler)' },
          signal: AbortSignal.timeout(5000),
          redirect: 'follow',
        });
        if (!resp.ok) return { id: page.id, url: page.url, status: 'http_error', code: resp.status };
        const html = await resp.text();

        // Extract og:image from HTML
        let ogImage = null;
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
          || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogMatch) {
          ogImage = ogMatch[1];
          // Resolve relative URLs
          if (ogImage && !ogImage.startsWith('http')) {
            try {
              ogImage = new URL(ogImage, page.url).href;
            } catch { ogImage = null; }
          }
        }

        // Fallback: try twitter:image
        if (!ogImage) {
          const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
          if (twMatch) {
            ogImage = twMatch[1];
            if (ogImage && !ogImage.startsWith('http')) {
              try { ogImage = new URL(ogImage, page.url).href; } catch { ogImage = null; }
            }
          }
        }

        if (ogImage) {
          await env.DB.prepare(
            `UPDATE pages SET image = ?, updated_at = unixepoch() WHERE id = ?`
          ).bind(ogImage, page.id).run();
          return { id: page.id, url: page.url, status: 'found', image: ogImage };
        }
        return { id: page.id, url: page.url, status: 'no_og_image' };
      } catch (e) {
        return { id: page.id, url: page.url, status: 'error', error: e.message };
      }
    });
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  const found = results.filter(r => r.status === 'found').length;
  return Response.json({
    crawled: results.length,
    images_found: found,
    results,
  });
}

// ─── Search Frontend HTML ─────────────────────────────────────────────
const SEARCH_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RoadView — Verified Search Engine — BlackRoad OS</title>
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:title" content="RoadView — BlackRoad OS">
<meta property="og:description" content="Sovereign search engine for the BlackRoad ecosystem">
<meta property="og:type" content="website">
<meta property="og:site_name" content="BlackRoad OS">
<meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<link rel="canonical" href="https://search.blackroad.io/">
<link rel="dns-prefetch" href="https://blackroad.io">
<meta name="description" content="BlackRoad OS verified search engine. Every stat verified against live sources. No fake news. Search across all 20 BlackRoad domains.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F50D;</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#000;--card:#0a0a0a;--fg:#f5f5f5;--text:#f5f5f5;--muted:#444;--dim:#555;
  --sub:#737373;--border:#1a1a1a;--surface:#0d0d0d;--surface2:#141414;
  --link:#7ab8ff;--link-hover:#b8d8ff;--url:#4aba78;
  --grad:linear-gradient(135deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);
  --grad-h:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);
  --grotesk:'Space Grotesk',system-ui,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --inter:'Inter','Space Grotesk',system-ui,sans-serif;
}
html{height:100%;-webkit-font-smoothing:antialiased}
body{min-height:100%;background:var(--bg);color:var(--fg);font-family:var(--inter);display:flex;flex-direction:column;line-height:1.5}
a{color:var(--link);text-decoration:none;transition:color .15s}
a:hover{color:var(--link-hover)}
::selection{background:#8844FF40}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradientSlide{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}

/* ─── Layout ─── */
.app{flex:1;display:flex;flex-direction:column}
.hero{flex:1;display:flex;flex-direction:column;align-items:center;transition:all .35s cubic-bezier(.4,0,.2,1)}
.hero.home{justify-content:center;padding-bottom:60px}
.hero.results{justify-content:flex-start;padding-top:28px}

/* ─── Footer ─── */
.footer{text-align:center;padding:24px 16px;border-top:1px solid var(--border);margin-top:auto}
.footer-links{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:10px}
.footer-links a{font-family:var(--mono);font-size:11px;color:var(--sub);transition:color .2s}
.footer-links a:hover{color:var(--fg)}
.footer-text{font-family:var(--mono);font-size:11px;color:var(--muted)}
.footer-tagline{font-family:var(--grotesk);font-size:11px;color:var(--muted);margin-top:4px;letter-spacing:.02em}

/* ─── Logo / Title ─── */
.logo-wrap{cursor:pointer;text-align:center;user-select:none}
.title{font-family:var(--grotesk);font-weight:700;letter-spacing:-.03em;transition:font-size .35s cubic-bezier(.4,0,.2,1)}
.home .title{font-size:clamp(40px,9vw,64px);margin-bottom:4px}
.results .title{font-size:22px;margin-bottom:0}
.title-grad{background:var(--grad-h);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradientSlide 6s ease infinite}
.subtitle{font-family:var(--mono);font-size:13px;color:var(--sub);margin-bottom:32px;letter-spacing:.03em}

/* ─── Search Bar ─── */
.search-wrap{position:relative;width:100%;padding:0 20px;transition:max-width .35s cubic-bezier(.4,0,.2,1)}
.home .search-wrap{max-width:600px}
.results .search-wrap{max-width:720px}
.search-form{display:flex;position:relative}
.search-input{
  width:100%;padding:15px 110px 15px 44px;font-size:16px;font-family:var(--inter);
  background:var(--surface);color:var(--fg);border:1.5px solid var(--border);border-radius:12px;
  outline:none;transition:border-color .2s,box-shadow .2s,background .2s;
}
.search-input::placeholder{color:var(--muted)}
.search-input:focus{border-color:#8844FF60;box-shadow:0 0 0 3px #8844FF15,0 2px 16px #8844FF10;background:#080810}
.search-icon{position:absolute;left:34px;top:50%;transform:translateY(-50%);color:var(--sub);pointer-events:none;font-size:16px;transition:color .2s}
.search-input:focus~.search-icon{color:#8844FF}
.search-btns{position:absolute;right:8px;top:50%;transform:translateY(-50%);display:flex;gap:4px;align-items:center}
.btn{
  font-family:var(--mono);font-size:11px;padding:7px 14px;border-radius:8px;border:1px solid var(--border);
  background:transparent;color:var(--sub);cursor:pointer;transition:all .2s;white-space:nowrap;
}
.btn:hover{color:var(--fg);border-color:var(--sub);background:var(--surface2)}
.btn-primary{background:var(--surface2);color:var(--sub)}
.btn-primary:hover{background:#1a1a2a;color:var(--fg)}
.hint{font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:10px;text-align:center}
.hint kbd{background:var(--surface2);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:10px;font-family:var(--mono);color:var(--sub)}

/* ─── Suggestions dropdown ─── */
.suggest-box{
  position:absolute;top:calc(100% + 4px);left:20px;right:20px;
  background:var(--card);border:1px solid var(--border);border-radius:12px;
  overflow:hidden;z-index:100;animation:fadeIn .12s ease;
  box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(12px);
}
.suggest-section{font-family:var(--mono);font-size:10px;color:var(--muted);padding:10px 16px 4px;text-transform:uppercase;letter-spacing:.1em}
.suggest-item{
  padding:10px 16px;font-size:14px;font-family:var(--inter);color:var(--sub);cursor:pointer;
  transition:background .1s,color .1s;display:flex;align-items:center;gap:10px;
}
.suggest-item:hover,.suggest-item.active{background:var(--surface2);color:var(--fg)}
.suggest-icon{font-size:13px;color:var(--muted);flex-shrink:0;width:18px;text-align:center}
.suggest-text{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ─── Category Filters ─── */
.pills{display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap;padding:0 20px}
.pill{
  font-family:var(--mono);font-size:11px;padding:6px 16px;border-radius:20px;
  border:1px solid var(--border);background:transparent;color:var(--sub);cursor:pointer;
  transition:all .2s;letter-spacing:.02em;
}
.pill:hover{border-color:var(--sub);color:var(--fg)}
.pill.active{border:none;background:var(--grad);color:#fff;font-weight:600;box-shadow:0 2px 12px #8844FF30}
.pill .pill-count{font-size:9px;opacity:.7;margin-left:2px}

/* ─── Stats row ─── */
.stats-bar{display:flex;gap:32px;justify-content:center;margin-top:28px;padding:0 20px}
.stat{font-family:var(--mono);font-size:12px;color:var(--muted)}
.stat-val{color:var(--sub);font-weight:600}

/* ─── Search History ─── */
.history{margin-top:20px;text-align:center;padding:0 20px}
.history-label{font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.12em}
.history-items{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.history-chip{
  font-family:var(--mono);font-size:12px;color:var(--sub);padding:4px 12px;
  border:1px solid var(--border);border-radius:16px;cursor:pointer;transition:all .2s;
  display:inline-flex;align-items:center;gap:6px;
}
.history-chip:hover{border-color:var(--sub);color:var(--fg)}
.history-chip .x{font-size:10px;color:var(--muted);cursor:pointer}
.history-chip .x:hover{color:#ff4466}

/* ─── Trending ─── */
.trending{margin-top:28px;text-align:center;padding:0 20px}
.trending-label{font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.12em}
.trending-item{
  font-family:var(--inter);font-size:13px;color:var(--sub);cursor:pointer;padding:5px 14px;
  display:inline-block;transition:color .2s;border-radius:6px;
}
.trending-item:hover{color:var(--fg);background:var(--surface2)}

/* ─── Results Area ─── */
.results-area{width:100%;max-width:720px;padding:0 20px;margin-top:20px}
.results-meta{font-family:var(--mono);font-size:12px;color:var(--muted);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.results-meta .dot{color:var(--border)}
.spinner{display:inline-block;width:22px;height:22px;border:2px solid var(--border);border-top-color:#8844FF;border-radius:50%;animation:spin .6s linear infinite}
.loading-wrap{text-align:center;padding-top:48px}
.loading-text{font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:12px;animation:pulse 1.5s ease infinite}

/* Skeleton loading */
.skeleton{background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px}
.skel-title{height:20px;width:70%;margin-bottom:8px}
.skel-url{height:14px;width:40%;margin-bottom:8px}
.skel-text{height:14px;width:90%;margin-bottom:4px}
.skel-text2{height:14px;width:75%}
.skel-card{padding:20px 0;border-bottom:1px solid var(--surface2)}

.no-results{text-align:center;padding-top:48px;animation:fadeUp .3s ease}
.no-results h3{font-family:var(--grotesk);font-size:20px;color:var(--sub);margin-bottom:8px}
.no-results p{font-family:var(--inter);font-size:14px;color:var(--muted);margin-bottom:16px}
.no-results-suggestions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}

/* ─── AI Answer Box ─── */
.ai-box{
  background:var(--card);border:1px solid var(--border);border-left:3px solid transparent;
  border-image:var(--grad) 1;border-image-slice:0 0 0 1;
  padding:18px 22px;border-radius:0 12px 12px 0;margin-bottom:24px;animation:fadeUp .3s ease;
}
.ai-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.ai-label{font-family:var(--mono);font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:.1em}
.ai-badge{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:10px;background:var(--surface2);color:var(--muted)}
.ai-text{font-family:var(--inter);font-size:14px;color:#bbb;line-height:1.7;white-space:pre-wrap}
.ai-text a{color:var(--link);border-bottom:1px solid #7ab8ff30}
.ai-text a:hover{border-bottom-color:var(--link)}

/* ─── Result Card ─── */
.result-card{padding:18px 0;border-bottom:1px solid var(--border);animation:fadeUp .25s ease;animation-fill-mode:backwards}
.result-card:nth-child(2){animation-delay:.05s}
.result-card:nth-child(3){animation-delay:.1s}
.result-card:nth-child(4){animation-delay:.15s}
.result-card:nth-child(5){animation-delay:.2s}
.result-url-line{font-family:var(--mono);font-size:12px;color:var(--url);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:6px}
.result-url-line .favicon{width:14px;height:14px;border-radius:3px;flex-shrink:0}
.result-title{font-family:var(--grotesk);font-size:18px;font-weight:600;margin-bottom:6px}
.result-title a{color:var(--link);transition:color .15s}
.result-title a:hover{color:var(--link-hover)}
.result-snippet{font-family:var(--inter);font-size:13.5px;color:var(--sub);line-height:1.6}
.result-snippet mark{background:none;color:var(--fg);font-weight:600}
.result-meta{margin-top:8px;display:flex;align-items:center;flex-wrap:wrap;gap:6px}
.badge{
  font-family:var(--mono);font-size:10px;padding:3px 10px;border-radius:6px;
  background:var(--surface2);color:var(--sub);text-transform:uppercase;letter-spacing:.04em;
}
.badge-site{border-left:2px solid #4488FF}
.badge-agent{border-left:2px solid #CC00AA}
.badge-app{border-left:2px solid #00D4FF}
.badge-api{border-left:2px solid #FF6B2B}
.badge-tool{border-left:2px solid #8844FF}
.badge-docs{border-left:2px solid #4aba78}
.tag{font-family:var(--mono);font-size:10px;color:var(--muted)}

/* Result thumbnail */
.result-thumb{width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--border);transition:opacity .2s,transform .2s;flex-shrink:0}
.result-thumb:hover{opacity:.85;transform:scale(1.04)}
.result-card.has-image{display:grid;grid-template-columns:1fr 80px;gap:12px}

/* Score bar */
.score-wrap{margin-left:auto;display:flex;align-items:center;gap:6px}
.score-bar{width:48px;height:4px;background:var(--border);border-radius:2px;overflow:hidden}
.score-fill{height:100%;border-radius:2px;background:var(--grad-h);transition:width .3s ease}
.score-text{font-family:var(--mono);font-size:10px;color:var(--muted)}

/* ─── Verification Badges ─── */
.verified-badge{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:10px;display:inline-flex;align-items:center;gap:4px;letter-spacing:.03em}
.verified-badge.verified{background:#0a2a0a;border:1px solid #1a4a1a;color:#4aba78}
.verified-badge.unverified{background:#2a2a0a;border:1px solid #4a4a1a;color:#c4a43a}
.verified-badge.false{background:#2a0a0a;border:1px solid #4a1a1a;color:#e84a4a}
.verified-badge.partial{background:#2a1a0a;border:1px solid #4a2a1a;color:#e8944a}
.verified-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.verified-dot.green{background:#4aba78}
.verified-dot.yellow{background:#c4a43a}
.verified-dot.red{background:#e84a4a}
.verified-dot.orange{background:#e8944a}

/* ─── Truth Dashboard ─── */
.truth-dashboard{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:24px;animation:fadeUp .3s ease}
.truth-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.truth-title{font-family:var(--mono);font-size:11px;color:var(--sub);text-transform:uppercase;letter-spacing:.1em}
.trust-score{font-family:var(--mono);font-size:24px;font-weight:700;letter-spacing:-.02em}
.trust-score.high{color:#4aba78}
.trust-score.medium{color:#c4a43a}
.trust-score.low{color:#e84a4a}
.truth-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.truth-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 14px}
.truth-card-label{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
.truth-card-value{font-family:var(--grotesk);font-size:18px;font-weight:600;color:var(--fg)}
.truth-card-source{font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:4px}

/* ─── Flagged Claims Banner ─── */
.flag-banner{background:#1a0a0a;border:1px solid #3a1a1a;border-left:3px solid #e84a4a;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:16px;animation:fadeUp .3s ease}
.flag-banner-title{font-family:var(--mono);font-size:10px;color:#e84a4a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.flag-item{font-family:var(--inter);font-size:12px;color:#999;line-height:1.6}
.flag-item .correction{color:#4aba78;font-weight:500}

/* ─── Pagination ─── */
.pagination{display:flex;justify-content:center;align-items:center;gap:8px;padding:28px 0}
.page-btn{
  font-family:var(--mono);font-size:12px;padding:8px 18px;border:1px solid var(--border);border-radius:8px;
  background:transparent;color:var(--sub);cursor:pointer;transition:all .2s;
}
.page-btn:hover:not(:disabled){background:var(--surface2);color:var(--fg);border-color:var(--sub)}
.page-btn:disabled{color:var(--muted);cursor:default;opacity:.4}
.page-num{
  font-family:var(--mono);font-size:12px;padding:8px 12px;border-radius:8px;cursor:pointer;
  color:var(--sub);transition:all .15s;
}
.page-num:hover{background:var(--surface2);color:var(--fg)}
.page-num.active{background:var(--grad);color:#fff;font-weight:600}
.page-info{font-family:var(--mono);font-size:11px;color:var(--muted)}

/* ─── Responsive ─── */
@media(max-width:640px){
  .home .title{font-size:clamp(32px,10vw,48px)}
  .search-input{padding:13px 90px 13px 38px;font-size:15px}
  .search-icon{left:28px;font-size:14px}
  .btn{font-size:10px;padding:6px 10px}
  .stats-bar{gap:16px}
  .stat{font-size:11px}
  .result-title{font-size:16px}
  .pills{gap:5px}
  .pill{font-size:10px;padding:5px 12px}
  .footer-links{gap:12px}
  .score-wrap{display:none}
}
</style>
</head>
<body><style id="br-nav-style">#br-nav{position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;font-family:'Space Grotesk',-apple-system,sans-serif}#br-nav .ni{max-width:1200px;margin:0 auto;padding:0 20px;height:48px;display:flex;align-items:center;justify-content:space-between}#br-nav .nl{display:flex;align-items:center;gap:12px}#br-nav .nb{color:#666;font-size:12px;padding:6px 8px;border-radius:6px;display:flex;align-items:center;cursor:pointer;border:none;background:none;transition:color .15s}#br-nav .nb:hover{color:#f5f5f5}#br-nav .nh{text-decoration:none;display:flex;align-items:center;gap:8px}#br-nav .nm{display:flex;gap:2px}#br-nav .nm span{width:6px;height:6px;border-radius:50%}#br-nav .nt{color:#f5f5f5;font-weight:600;font-size:14px}#br-nav .ns{color:#333;font-size:14px}#br-nav .np{color:#999;font-size:13px}#br-nav .nk{display:flex;align-items:center;gap:4px;overflow-x:auto;scrollbar-width:none}#br-nav .nk::-webkit-scrollbar{display:none}#br-nav .nk a{color:#888;text-decoration:none;font-size:12px;padding:6px 10px;border-radius:6px;white-space:nowrap;transition:color .15s,background .15s}#br-nav .nk a:hover{color:#f5f5f5;background:#111}#br-nav .nk a.ac{color:#f5f5f5;background:#1a1a1a}#br-nav .mm{display:none;background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:6px}#br-dd{display:none;position:fixed;top:48px;left:0;right:0;background:rgba(0,0,0,0.96);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;z-index:9998;padding:12px 20px}#br-dd.open{display:flex;flex-wrap:wrap;gap:4px}#br-dd a{color:#888;text-decoration:none;font-size:13px;padding:8px 14px;border-radius:6px;transition:color .15s,background .15s}#br-dd a:hover,#br-dd a.ac{color:#f5f5f5;background:#111}body{padding-top:48px!important}@media(max-width:768px){#br-nav .nk{display:none}#br-nav .mm{display:block}}</style><nav id="br-nav"><div class="ni"><div class="nl"><button class="nb" onclick="history.length>1?history.back():location.href='https://blackroad.io'" title="Back">&larr;</button><a href="https://blackroad.io" class="nh"><div class="nm"><span style="background:#FF6B2B"></span><span style="background:#FF2255"></span><span style="background:#CC00AA"></span><span style="background:#8844FF"></span><span style="background:#4488FF"></span><span style="background:#00D4FF"></span></div><span class="nt">BlackRoad</span></a><span class="ns">/</span><span class="np">Search</span></div><div class="nk"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io" class="ac">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roundtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io">Dashboard</a></div><button class="mm" onclick="document.getElementById('br-dd').classList.toggle('open')">&#9776;</button></div></nav><div id="br-dd"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io" class="ac">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roundtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io">Dashboard</a></div><script>document.addEventListener('click',function(e){var d=document.getElementById('br-dd');if(d&&d.classList.contains('open')&&!e.target.closest('#br-nav')&&!e.target.closest('#br-dd'))d.classList.remove('open')});</script>
<div class="app" id="app">
  <div class="hero home" id="hero">
    <div class="logo-wrap" onclick="goHome()">
      <div class="title" id="title"><span class="title-grad">RoadView</span></div>
    </div>
    <div class="subtitle" id="subtitle">Search the Road. Verify the Truth.</div>

    <div class="search-wrap">
      <form class="search-form" onsubmit="doSearch(event)" autocomplete="off">
        <input class="search-input" id="q" type="text" placeholder="Search BlackRoad..." autofocus
          oninput="onInput()" onkeydown="onKeyDown(event)" onfocus="onFocus()" />
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <div class="search-btns">
          <button type="button" class="btn" id="micBtn" onclick="voiceSearch()" title="Voice Search" style="padding:6px 8px;display:none"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>
          <button type="submit" class="btn btn-primary" title="Search (Enter)">Search</button>
          <button type="button" class="btn" onclick="feelingLucky()" title="Go to top result">Lucky</button>
        </div>
      </form>
      <div class="suggest-box" id="suggestions" style="display:none"></div>
      <div class="hint" id="hint">
        <kbd>/</kbd> focus &nbsp;&middot;&nbsp; <kbd>Esc</kbd> clear &nbsp;&middot;&nbsp;
        <kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate
      </div>
    </div>

    <div class="pills" id="pills"></div>
    <div class="stats-bar" id="statsBar"></div>
    <div id="truthDashboard" style="width:100%;max-width:720px;padding:0 20px;margin-top:20px"></div>
    <div class="history" id="historyArea" style="display:none"></div>
    <div class="trending" id="trending"></div>
    <div style="display:flex;gap:24px;align-items:flex-start">
      <div class="results-area" id="resultsArea" style="display:none;flex:1"></div>
      <div id="trendingSidebar" style="width:180px;flex-shrink:0;padding-top:20px"></div>
    </div>
  </div>

  <div style="max-width:860px;margin:0 auto;padding:32px 20px">
<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#525252;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:16px">BlackRoad Ecosystem</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px">
<a href="https://blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">BlackRoad OS</a>
<a href="https://chat.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Chat</a>
<a href="https://search.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Search</a>
<a href="https://pay.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Pay</a>
<a href="https://tutor.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Tutor</a>
<a href="https://video.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Video</a>
<a href="https://canvas.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Canvas</a>
<a href="https://roundtrip.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">RoundTrip</a>
<a href="https://hq.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">HQ</a>
<a href="https://git.blackroad.io" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Git</a>
<a href="https://lucidia.earth" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">Lucidia</a>
<a href="https://github.com/BlackRoad-OS-Inc" style="background:#131313;border:1px solid #1a1a1a;border-radius:6px;padding:8px 14px;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:13px;color:#737373;font-weight:500">GitHub</a>
</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#262626"><span data-stat="repos">2,194</span> repos · <span data-stat="orgs">36</span> orgs · <span data-stat="domains">20</span> domains · <span data-stat="agents">17</span> agents <span class="verified-badge verified" style="font-size:8px"><span class="verified-dot green"></span>verified</span></div>
</div>

  <div class="footer">
    <div class="footer-links">
      <a href="https://blackroad.io">Home</a>
      <a href="https://lucidia.earth">Lucidia</a>
      <a href="https://blackroadai.com">AI</a>
      <a href="https://blackroad.network">Network</a>
      <a href="https://status.blackroad.io">Status</a>
      <a href="https://blackroad.company">Company</a>
      <a href="https://brand.blackroad.io">Brand</a>
      <a href="https://blackroad.io/pricing">Pricing</a>
      <a href="https://github.com/blackboxprogramming">GitHub</a>
    </div>
    <div class="footer-text" id="footerStats"></div>
    <div class="footer-tagline">BlackRoad OS &mdash; Every stat verified. No fake news.</div>
  </div>
</div>

<script>
const CATEGORIES = [
  { key: 'All', label: 'All' },
  { key: 'site', label: 'Sites' },
  { key: 'agent', label: 'Agents' },
  { key: 'api', label: 'API' },
  { key: 'tool', label: 'Tools' },
  { key: 'app', label: 'Apps' },
  { key: 'docs', label: 'Docs' },
  { key: 'facts', label: 'Facts' },
];
const BADGE_CLASSES = { site:'badge-site', agent:'badge-agent', app:'badge-app', api:'badge-api', tool:'badge-tool', docs:'badge-docs', tech:'badge-tool', page:'badge-docs' };
const API_BASE = '';
const HISTORY_KEY = 'roadsearch_history';
const MAX_HISTORY = 12;

let state = {
  query: '', submitted: '', category: 'All', results: null, aiAnswer: null, aiSource: null,
  loading: false, duration: null, total: 0, page: 1, pages: 1,
  suggestions: [], suggestIdx: -1, showSuggest: false,
  stats: { indexed: 0, queries: 0, queries24h: 0 },
  trending: [], history: [],
  categoryCounts: {},
};

const $ = id => document.getElementById(id);
const qInput = () => $('q');

// ─── Init ──────────────────────────────────────────────────────────
function init() {
  state.history = loadHistory();
  state.factsData = null;
  renderPills();
  renderHistory();
  loadStats();
  loadTruthDashboard();

  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const cat = params.get('category');
  if (cat) {
    const found = CATEGORIES.find(c => c.key === cat || c.label.toLowerCase() === cat.toLowerCase());
    if (found) { state.category = found.key; renderPills(); }
  }
  if (q) {
    state.query = q;
    qInput().value = q;
    search(q, state.category, 1);
  }

  document.addEventListener('keydown', globalKey);
  document.addEventListener('click', e => {
    if (!$('suggestions').contains(e.target) && e.target !== qInput()) closeSuggest();
  });
  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(location.search);
    const pq = p.get('q');
    if (pq && pq !== state.submitted) {
      state.query = pq;
      qInput().value = pq;
      search(pq, state.category, 1);
    } else if (!pq) {
      goHome();
    }
  });
}

function globalKey(e) {
  if (e.key === '/' && document.activeElement !== qInput() && !e.ctrlKey && !e.metaKey) {
    e.preventDefault(); qInput().focus(); qInput().select();
  }
  if (e.key === 'Escape') {
    if (state.showSuggest) { closeSuggest(); }
    else { qInput().value = ''; state.query = ''; qInput().blur(); }
  }
}

// ─── API ──────────────────────────────────────────────────────────
async function api(path) {
  const res = await fetch(API_BASE + path, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

async function loadStats() {
  try {
    const d = await api('/stats');
    state.stats = { indexed: d.indexed_pages || 0, queries: d.total_queries || 0, queries24h: d.queries_24h || 0 };
    state.trending = d.trending || [];
    state.categoryCounts = {};
    (d.categories || []).forEach(c => { state.categoryCounts[c.name] = c.count; });
    renderStats();
    renderTrending();
    renderPills();
  } catch(e) { console.warn('Stats load failed:', e); }
}

// ─── Truth Dashboard ─────────────────────────────────────────────
async function loadTruthDashboard() {
  try {
    const d = await api('/facts');
    state.factsData = d;
    renderTruthDashboard(d);
  } catch(e) { console.warn('Facts load failed:', e); }
}

function renderTruthDashboard(d) {
  if (!d) return;
  const el = $('truthDashboard');
  const scoreClass = d.trust_score >= 80 ? 'high' : d.trust_score >= 50 ? 'medium' : 'low';
  const falseCt = d.false_claims ? d.false_claims.filter(f => !f.fixed).length : 0;

  let html = '<div class="truth-dashboard">';
  html += '<div class="truth-header">';
  html += '<span class="truth-title">Truth Dashboard — Verified Stats</span>';
  html += '<span class="trust-score ' + scoreClass + '">' + d.trust_score + '%</span>';
  html += '</div>';

  html += '<div class="truth-grid">';
  // Show key verified facts
  const keyFacts = (d.facts || []).filter(f => ['roundtrip_agents','auth_users','nodes_online','tops_live','ollama_models','custom_domains','active_subscriptions'].includes(f.field));
  keyFacts.forEach(f => {
    html += '<div class="truth-card">';
    html += '<div class="truth-card-label">' + esc(f.claim) + '</div>';
    html += '<div class="truth-card-value">' + esc(String(f.value)) + ' <span class="verified-badge verified"><span class="verified-dot green"></span>verified</span></div>';
    html += '<div class="truth-card-source">' + esc(f.source) + '</div>';
    html += '</div>';
  });
  html += '</div>';

  // Show false claims if any unfixed
  if (falseCt > 0) {
    html += '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">';
    html += '<div style="font-family:var(--mono);font-size:10px;color:#e84a4a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Known Discrepancies (' + falseCt + ')</div>';
    d.false_claims.filter(f => !f.fixed).forEach(f => {
      const sevColor = f.severity === 'false' ? '#e84a4a' : f.severity === 'inflated' ? '#e8944a' : '#c4a43a';
      html += '<div style="font-family:var(--inter);font-size:12px;color:#777;margin-bottom:4px">';
      html += '<span style="color:' + sevColor + ';font-family:var(--mono);font-size:9px;text-transform:uppercase">[' + esc(f.severity) + ']</span> ';
      html += '"' + esc(f.claim) + '" → <span class="correction" style="color:#4aba78">' + esc(f.real) + '</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  html += '<div style="margin-top:10px;text-align:right"><button class="btn" onclick="runVerify()" style="font-size:10px">Re-verify Now</button></div>';
  html += '</div>';
  el.innerHTML = html;
}

async function runVerify() {
  try {
    const d = await api('/verify');
    const msg = 'Verified ' + d.verified + ' facts. ' + (d.discrepancies || 0) + ' discrepancies found.';
    alert(msg);
    loadTruthDashboard();
  } catch(e) { alert('Verify failed: ' + e.message); }
}

// ─── Search History (localStorage) ────────────────────────────────
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').slice(0, MAX_HISTORY); }
  catch { return []; }
}
function saveHistory(q) {
  const h = loadHistory().filter(x => x.toLowerCase() !== q.toLowerCase());
  h.unshift(q);
  const trimmed = h.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  state.history = trimmed;
}
function removeHistory(q) {
  const h = loadHistory().filter(x => x !== q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  state.history = h;
  renderHistory();
}
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  state.history = [];
  renderHistory();
}

// ─── Search ──────────────────────────────────────────────────────
function doSearch(e) { e && e.preventDefault(); search(state.query, state.category, 1); }

// Voice Search via Web Speech API
var recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  document.getElementById('micBtn').style.display = '';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.onresult = function(e) {
    var t = '';
    for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    document.getElementById('q').value = t;
    state.query = t;
    if (e.results[0].isFinal) { search(t, state.category, 1); document.getElementById('micBtn').style.color = ''; }
  };
  recognition.onend = function() { document.getElementById('micBtn').style.color = ''; };
}
function voiceSearch() {
  if (!recognition) return;
  document.getElementById('micBtn').style.color = '#FF2255';
  recognition.start();
}

async function search(q, cat, pg) {
  // If facts tab clicked without query, show facts dashboard
  if (cat === 'facts' && (!q || q.length < 2)) {
    setMode('results');
    $('truthDashboard').style.display = 'block';
    if (state.factsData) renderTruthDashboard(state.factsData);
    else loadTruthDashboard();
    $('resultsArea').style.display = 'none';
    return;
  }
  q = (q || '').trim();
  if (!q || q.length < 2) return;
  state.submitted = q; state.loading = true; state.page = pg;
  closeSuggest();
  updateURL(q, cat);
  setMode('results');
  $('truthDashboard').style.display = 'none';
  renderLoading();
  saveHistory(q);

  const catParam = cat && cat !== 'All' ? '&category=' + encodeURIComponent(cat) : '';
  const start = performance.now();

  try {
    const data = await api('/search?q=' + encodeURIComponent(q) + catParam + '&ai=true&page=' + pg + '&limit=10');
    state.duration = Math.round(performance.now() - start);
    state.results = data.results || [];
    state.total = data.total || state.results.length;
    state.pages = data.pages || Math.ceil(state.total / 10);
    state.aiAnswer = data.ai_answer || null;
    state.aiSource = data.ai_source || null;
    state.flaggedClaims = data.verification?.flagged_claims || [];
    state.instantAnswer = data.instant_answer || null;
    state.page = pg;
  } catch(e) {
    state.results = []; state.total = 0; state.pages = 1;
    state.aiAnswer = null; state.aiSource = null; state.duration = null;
    state.flaggedClaims = [];
  }
  state.loading = false;
  renderResults();
}

// ─── Suggestions ────────────────────────────────────────────────
let suggestTimer = null;
function onInput() {
  state.query = qInput().value;
  clearTimeout(suggestTimer);
  if (state.query.length < 2) { closeSuggest(); return; }
  suggestTimer = setTimeout(fetchSuggestions, 150);
}

async function fetchSuggestions() {
  if (state.query === state.submitted && state.results) return;
  try {
    const d = await api('/suggest?q=' + encodeURIComponent(state.query));
    const titles = (d.suggestions || []).map(s => ({ text: s, type: 'page' }));
    const recent = (d.recent || []).map(s => ({ text: s, type: 'recent' }));
    const historyMatch = state.history
      .filter(h => h.toLowerCase().includes(state.query.toLowerCase()) && h.toLowerCase() !== state.query.toLowerCase())
      .slice(0, 3)
      .map(s => ({ text: s, type: 'history' }));

    const seen = new Set();
    state.suggestions = [];
    for (const item of [...historyMatch, ...recent, ...titles]) {
      const k = item.text.toLowerCase();
      if (!seen.has(k)) { seen.add(k); state.suggestions.push(item); }
    }
    state.suggestions = state.suggestions.slice(0, 8);
    state.suggestIdx = -1;
    if (state.suggestions.length) { state.showSuggest = true; renderSuggestions(); }
    else closeSuggest();
  } catch(e) {}
}

function onFocus() {
  if (state.suggestions.length && !state.showSuggest && state.query.length >= 2) {
    state.showSuggest = true; renderSuggestions();
  }
}
function closeSuggest() { state.showSuggest = false; $('suggestions').style.display = 'none'; }

function onKeyDown(e) {
  if (state.showSuggest && state.suggestions.length) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.suggestIdx = (state.suggestIdx + 1) % state.suggestions.length;
      renderSuggestions();
      qInput().value = state.suggestions[state.suggestIdx].text;
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.suggestIdx = state.suggestIdx <= 0 ? state.suggestions.length - 1 : state.suggestIdx - 1;
      renderSuggestions();
      qInput().value = state.suggestions[state.suggestIdx].text;
      return;
    }
    if (e.key === 'Enter' && state.suggestIdx >= 0) {
      e.preventDefault();
      const pick = state.suggestions[state.suggestIdx].text;
      state.query = pick; qInput().value = pick; search(pick, state.category, 1);
      return;
    }
    if (e.key === 'Tab') { closeSuggest(); return; }
  }
  if (e.key === 'Escape') { closeSuggest(); }
}

function pickSuggestion(text) { state.query = text; qInput().value = text; closeSuggest(); search(text, state.category, 1); }

// ─── Lucky ───────────────────────────────────────────────────────
function feelingLucky() {
  const q = (state.query || state.submitted || '').trim();
  if (q) window.location.href = '/lucky?q=' + encodeURIComponent(q);
}

// ─── Navigation ─────────────────────────────────────────────────
function goHome() {
  state.submitted = ''; state.results = null; state.aiAnswer = null; state.aiSource = null;
  state.query = ''; state.total = 0; state.page = 1; state.pages = 1;
  qInput().value = '';
  history.pushState(null, '', location.pathname);
  setMode('home');
  $('resultsArea').style.display = 'none';
  $('resultsArea').innerHTML = '';
  renderHistory();
  loadStats();
  qInput().focus();
}

function setMode(mode) {
  $('hero').className = 'hero ' + mode;
  $('subtitle').style.display = mode === 'home' ? '' : 'none';
  $('hint').style.display = mode === 'home' ? '' : 'none';
  $('trending').style.display = mode === 'home' ? '' : 'none';
  $('statsBar').style.display = mode === 'home' ? '' : 'none';
  $('historyArea').style.display = mode === 'home' && state.history.length ? '' : 'none';
  if (mode === 'home') { $('truthDashboard').style.display = 'block'; loadTruthDashboard(); }
}

function updateURL(q, cat) {
  const p = new URLSearchParams();
  if (q) p.set('q', q);
  if (cat && cat !== 'All') p.set('category', cat);
  const s = p.toString();
  history.pushState(null, '', s ? '?' + s : location.pathname);
}

function setCategory(cat) {
  state.category = cat;
  renderPills();
  if (cat === 'facts') { search('', 'facts', 1); return; }
  if (state.submitted) search(state.submitted, cat, 1);
}

// ─── Render ─────────────────────────────────────────────────────
function renderPills() {
  $('pills').innerHTML = CATEGORIES.map(c => {
    const count = c.key === 'All' ? '' : (state.categoryCounts[c.key] ? '<span class="pill-count">(' + state.categoryCounts[c.key] + ')</span>' : '');
    return '<button class="pill' + (state.category === c.key ? ' active' : '') + '" onclick="setCategory(\\'' + c.key + '\\')">' + c.label + count + '</button>';
  }).join('');
}

function renderStats() {
  const s = state.stats;
  $('statsBar').innerHTML =
    '<span class="stat"><span class="stat-val">' + (s.indexed || 0).toLocaleString() + '</span> pages indexed</span>' +
    '<span class="stat"><span class="stat-val">' + (s.queries24h || 0).toLocaleString() + '</span> searches today</span>' +
    '<span class="stat"><span class="stat-val">' + (s.queries || 0).toLocaleString() + '</span> total queries</span>';
  $('footerStats').textContent = (s.indexed || 0).toLocaleString() + ' pages indexed \\u00B7 ' + (s.queries || 0).toLocaleString() + ' total queries';
}

function renderHistory() {
  const area = $('historyArea');
  if (!state.history.length) { area.style.display = 'none'; return; }
  let html = '<div class="history-label">Recent Searches</div><div class="history-items">';
  state.history.slice(0, 8).forEach(h => {
    html += '<span class="history-chip" onclick="pickSuggestion(\\'' + esc(h) + '\\')">'
      + esc(h) + '<span class="x" onclick="event.stopPropagation();removeHistory(\\'' + esc(h) + '\\')">&times;</span></span>';
  });
  if (state.history.length > 0) {
    html += '<span class="history-chip" onclick="clearHistory()" style="color:var(--muted);border-color:var(--muted)">Clear all</span>';
  }
  html += '</div>';
  area.innerHTML = html;
  area.style.display = '';
}

function renderTrending() {
  if (!state.trending.length) { $('trending').innerHTML = ''; return; }
  let html = '<div class="trending-label">Trending Searches</div><div>';
  state.trending.slice(0, 8).forEach(t => {
    const text = typeof t === 'string' ? t : (t.query || '');
    if (text) html += '<span class="trending-item" onclick="pickSuggestion(\\'' + esc(text) + '\\')">' + esc(text) + '</span>';
  });
  html += '</div>';
  $('trending').innerHTML = html;
}

function renderSuggestions() {
  const box = $('suggestions');
  if (!state.showSuggest || !state.suggestions.length) { box.style.display = 'none'; return; }

  const icons = { history: '&#x1F552;', recent: '&#x1F50D;', page: '&#x2192;' };
  let html = '';
  let lastType = '';
  state.suggestions.forEach((s, i) => {
    if (s.type !== lastType) {
      const labels = { history: 'Recent', recent: 'Popular', page: 'Pages' };
      html += '<div class="suggest-section">' + (labels[s.type] || 'Results') + '</div>';
      lastType = s.type;
    }
    html += '<div class="suggest-item' + (i === state.suggestIdx ? ' active' : '') + '" '
      + 'onmouseenter="state.suggestIdx=' + i + ';renderSuggestions()" '
      + 'onclick="pickSuggestion(\\'' + esc(s.text) + '\\')">'
      + '<span class="suggest-icon">' + (icons[s.type] || '&#x2192;') + '</span>'
      + '<span class="suggest-text">' + highlightMatch(esc(s.text), state.query) + '</span>'
      + '</div>';
  });
  box.innerHTML = html;
  box.style.display = 'block';
}

function renderLoading() {
  const area = $('resultsArea');
  area.style.display = 'block';
  let html = '<div style="padding-top:8px">';
  for (let i = 0; i < 4; i++) {
    html += '<div class="skel-card"><div class="skeleton skel-url"></div><div class="skeleton skel-title"></div><div class="skeleton skel-text"></div><div class="skeleton skel-text2"></div></div>';
  }
  html += '</div>';
  area.innerHTML = html;
}

function renderResults() {
  const area = $('resultsArea');
  area.style.display = 'block';

  if (!state.results || !state.results.length) {
    const suggestions = ['BlackRoad OS', 'agents', 'pricing', 'Lucidia', 'mesh network'];
    area.innerHTML = '<div class="no-results"><h3>No results for &ldquo;' + esc(state.submitted) + '&rdquo;</h3>'
      + '<p>Try different keywords or broaden your search.</p>'
      + '<div class="no-results-suggestions">'
      + suggestions.map(s => '<span class="trending-item" onclick="pickSuggestion(\\'' + esc(s) + '\\')">' + esc(s) + '</span>').join('')
      + '</div></div>';
    return;
  }

  const qWords = state.submitted.toLowerCase().split(/\\s+/).filter(w => w.length >= 2);
  let html = '';

  // Meta line
  if (state.duration !== null) {
    html += '<div class="results-meta">'
      + '<span>' + state.total + ' result' + (state.total !== 1 ? 's' : '') + '</span>'
      + '<span class="dot">&middot;</span>'
      + '<span>' + state.duration + 'ms</span>'
      + (state.page > 1 ? '<span class="dot">&middot;</span><span>Page ' + state.page + '</span>' : '')
      + '</div>';
  }

  // Instant Answer (G(n), math)
  if (state.instantAnswer) {
    var ia = state.instantAnswer;
    if (ia.type === 'amundson_gn') {
      html += '<div class="ai-box" style="border-left:3px solid #FF2255">'
        + '<div class="ai-header"><span class="ai-label">Amundson Sequence</span><span class="ai-badge" style="background:#FF2255">G(n)</span></div>'
        + '<div style="font-family:JetBrains Mono,monospace;font-size:20px;font-weight:700;margin:8px 0">' + ia.formula + '</div>'
        + '<div style="font-size:16px;margin:4px 0">G(' + ia.n + ') = <strong>' + ia.value.toFixed(8) + '</strong></div>'
        + '<div style="font-size:13px;opacity:.5;margin-top:4px">G(n)/n = ' + ia.ratio_to_n.toFixed(8) + ' (converges to ' + ia.converges_to + ')</div>'
        + '<div style="font-size:12px;opacity:.3;margin-top:8px">Source: ' + ia.source + '</div>'
        + '</div>';
    } else if (ia.type === 'math') {
      html += '<div class="ai-box" style="border-left:3px solid #4488FF">'
        + '<div class="ai-header"><span class="ai-label">Calculator</span></div>'
        + '<div style="font-family:JetBrains Mono,monospace;font-size:24px;font-weight:700;margin:8px 0">' + ia.expression + ' = ' + ia.result + '</div>'
        + '</div>';
    }
  }

  // Flagged claims banner
  if (state.flaggedClaims && state.flaggedClaims.length > 0) {
    html += '<div class="flag-banner">';
    html += '<div class="flag-banner-title">Fact Check: ' + state.flaggedClaims.length + ' claim' + (state.flaggedClaims.length > 1 ? 's' : '') + ' flagged</div>';
    state.flaggedClaims.forEach(f => {
      html += '<div class="flag-item"><span style="color:#e84a4a">' + esc(f.issue) + '</span> — <span class="correction">' + esc(f.verified) + '</span></div>';
    });
    html += '</div>';
  }

  // AI Answer
  if (state.aiAnswer) {
    const rendered = state.aiAnswer
      .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const sourceBadge = state.aiSource === 'ollama' ? 'AI' : state.aiSource === 'summary' ? 'Summary' : 'Cached';
    html += '<div class="ai-box">'
      + '<div class="ai-header"><span class="ai-label">Verified Answer</span><span class="ai-badge">' + sourceBadge + '</span><span class="verified-badge verified" style="margin-left:auto"><span class="verified-dot green"></span>fact-checked</span></div>'
      + '<div class="ai-text">' + rendered + '</div>'
      + '</div>';
  }

  // Results
  state.results.forEach((r, i) => {
    const title = r.title || 'Untitled';
    const url = r.url || '#';
    const snippet = r.snippet || r.description || '';
    const cat = r.category || '';
    const tags = (r.tags || []).slice(0, 4);
    const score = r.score || 0;
    const badgeClass = BADGE_CLASSES[cat] || '';

    // Highlight query terms in snippet
    const highlightedSnippet = highlightTerms(esc(snippet), qWords);
    const highlightedTitle = highlightTerms(esc(title), qWords);

    // Extract domain for display
    let displayUrl = url;
    try { const u = new URL(url); displayUrl = u.hostname + u.pathname; } catch {}

    const img = r.image;
    html += '<div class="result-card' + (img ? ' has-image' : '') + '" style="animation-delay:' + (i * 0.04) + 's">'
      + '<div>'
      + '<div class="result-url-line">' + esc(displayUrl) + '</div>'
      + '<div class="result-title"><a href="' + esc(url) + '" target="_blank" rel="noopener" onclick="trackClick(' + r.id + ',\\'' + esc(url).replace(/'/g, "\\\\'") + '\\')">' + highlightedTitle + '</a></div>'
      + '<div class="result-snippet">' + highlightedSnippet + '</div>'
      + '<div class="result-meta">';
    if (cat) html += '<span class="badge ' + badgeClass + '">' + esc(cat) + '</span>';
    tags.forEach(t => { html += '<span class="tag">#' + esc(t) + '</span>'; });
    html += '<div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + Math.round(score * 100) + '%"></div></div>'
      + '<span class="score-text">' + Math.round(score * 100) + '%</span></div>';
    html += '<a href="https://chat.blackroad.io#ask=' + encodeURIComponent(title) + '" target="_blank" rel="noopener" style="font-size:11px;color:var(--text2);opacity:.5;margin-left:8px;text-decoration:none;transition:opacity .15s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">Ask AI</a>';
    // Expand/collapse preview
    const fullContent = esc(r.content || r.description || snippet).slice(0, 600);
    if (fullContent.length > snippet.length + 20) {
      html += '<button onclick="var p=this.nextElementSibling;p.style.display=p.style.display===\\'none\\'?\\'block\\':\\'none\\';this.textContent=p.style.display===\\'none\\'?\\'Preview\\':\\'Collapse\\'" style="font-size:11px;color:var(--link);background:none;border:none;cursor:pointer;opacity:.5;margin-left:8px">Preview</button>';
    }
    html += '</div>';
    if (fullContent.length > snippet.length + 20) {
      html += '<div style="display:none;margin-top:8px;padding:10px 12px;background:var(--surface);border-radius:6px;font-size:12.5px;line-height:1.6;color:var(--sub)">' + highlightTerms(fullContent, qWords) + '</div>';
    }
    html += '</div>';
    if (img) html += '<div style="display:flex;align-items:flex-start;justify-content:flex-end"><img class="result-thumb" src="' + esc(img) + '" loading="lazy" alt="" onerror="this.parentElement.style.display=\'none\'"></div>';
    html += '</div>';
  });

  // Pagination
  if (state.pages > 1) {
    html += '<div class="pagination">';
    html += '<button class="page-btn" ' + (state.page <= 1 ? 'disabled' : 'onclick="search(state.submitted,state.category,' + (state.page - 1) + ')"') + '>&larr; Prev</button>';

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(state.pages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

    if (startPage > 1) {
      html += '<span class="page-num" onclick="search(state.submitted,state.category,1)">1</span>';
      if (startPage > 2) html += '<span class="page-info">&hellip;</span>';
    }
    for (let p = startPage; p <= endPage; p++) {
      html += '<span class="page-num' + (p === state.page ? ' active' : '') + '" onclick="search(state.submitted,state.category,' + p + ')">' + p + '</span>';
    }
    if (endPage < state.pages) {
      if (endPage < state.pages - 1) html += '<span class="page-info">&hellip;</span>';
      html += '<span class="page-num" onclick="search(state.submitted,state.category,' + state.pages + ')">' + state.pages + '</span>';
    }

    html += '<button class="page-btn" ' + (state.page >= state.pages ? 'disabled' : 'onclick="search(state.submitted,state.category,' + (state.page + 1) + ')"') + '>Next &rarr;</button>';
    html += '</div>';
  }

  area.innerHTML = html;
  // Scroll to top of results on page change
  if (state.page > 1) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Utilities ──────────────────────────────────────────────────
function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function highlightTerms(html, words) {
  if (!words.length) return html;
  // Build regex that matches any of the query words (case insensitive)
  const pattern = words.map(w => w.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\\\$&')).join('|');
  try {
    const re = new RegExp('(' + pattern + ')', 'gi');
    return html.replace(re, '<mark>\\$1</mark>');
  } catch { return html; }
}

function highlightMatch(text, query) {
  if (!query) return text;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx < 0) return text;
  return text.slice(0, idx) + '<strong>' + text.slice(idx, idx + q.length) + '</strong>' + text.slice(idx + q.length);
}

function trackClick(pageId, url) {
  fetch('/api/click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({page_id: pageId, url: url, query: state.submitted}) }).catch(function(){});
}

// Load trending searches
fetch('/stats').then(function(r){return r.json()}).then(function(d){
  var trending = d.trending || [];
  if (trending.length > 0) {
    var el = document.getElementById('trendingSidebar');
    if (el) el.innerHTML = '<div style="font-size:11px;opacity:.3;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Trending</div>' + trending.slice(0,8).map(function(t){return '<div style="font-size:13px;padding:4px 0;cursor:pointer;opacity:.5;transition:opacity .15s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5" onclick="pickSuggestion(\\'' + t.query.replace(/'/g,"\\\\'") + '\\')">' + t.query + ' <span style="opacity:.3;font-size:11px">' + t.count + '</span></div>'}).join('');
  }
}).catch(function(){});

init();
// Live stats from stats API
fetch('https://stats.blackroad.io/live').then(r=>r.json()).then(d=>{const e=d.ecosystem;document.querySelectorAll('[data-stat]').forEach(el=>{const k=el.dataset.stat;if(k==='agents')el.textContent=e.agents;if(k==='repos')el.textContent=e.repos.toLocaleString();if(k==='orgs')el.textContent=e.orgs;if(k==='nodes')el.textContent=e.nodes;if(k==='domains')el.textContent=e.domains;if(k==='tops')el.textContent=e.tops;if(k==='workers')el.textContent=e.workers;if(k==='users')el.textContent=d.auth?.users||0;if(k==='messages')el.textContent=(d.chat?.total_messages||0).toLocaleString();if(k==='queries')el.textContent=(d.search?.total_queries||0).toLocaleString();if(k==='pages')el.textContent=(d.search?.indexed_pages||0).toLocaleString()})}).catch(()=>{});
</script>
<script>!function(){var A="https://analytics-blackroad.blackroad.workers.dev",s=sessionStorage.getItem("br_sid")||crypto.randomUUID().slice(0,12);sessionStorage.setItem("br_sid",s);function ev(n,p){fetch(A+"/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,path:location.pathname,session_id:s,props:p||{}})}).catch(function(){});}fetch(A+"/pageview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:location.hostname+location.pathname,referrer:document.referrer,session_id:s,screen_w:screen.width,screen_h:screen.height,lang:navigator.language})}).catch(function(){});var t0=Date.now(),maxScroll=0,engaged=0;window.addEventListener("scroll",function(){var pct=Math.round(100*(window.scrollY+window.innerHeight)/document.documentElement.scrollHeight);if(pct>maxScroll){maxScroll=pct;if(pct>=25&&pct<50)ev("scroll_25");if(pct>=50&&pct<75)ev("scroll_50");if(pct>=75&&pct<100)ev("scroll_75");if(pct>=100)ev("scroll_100");}});setInterval(function(){engaged++;},30000);window.addEventListener("beforeunload",function(){var dur=Date.now()-t0;fetch(A+"/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:s,duration_ms:dur}),keepalive:true}).catch(function(){});ev("exit",{duration_s:Math.round(dur/1000),scroll_max:maxScroll,engaged_intervals:engaged});if(dur<10000)ev("bounce");});document.addEventListener("click",function(e){var a=e.target.closest("a");if(a&&a.hostname!==location.hostname)ev("outbound_click",{url:a.href});});}();</script></body>
</html>`;

// ╔══════════════════════════════════════════════════════════════╗
// ║  NEW FEATURES — Autocomplete, Filters, Saved Searches,     ║
// ║  History, Image Search, Advanced Operators, Analytics,      ║
// ║  Knowledge Panels                                           ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── New D1 Tables for Enhanced Features ─────────────────────────────
async function initEnhancedTables(db) {
  const statements = [
    // Autocomplete: popular queries with frequency
    `CREATE TABLE IF NOT EXISTS autocomplete_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prefix TEXT NOT NULL,
      suggestion TEXT NOT NULL,
      frequency INTEGER DEFAULT 1,
      source TEXT DEFAULT 'search',
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch()),
      UNIQUE(suggestion)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_autocomplete_prefix ON autocomplete_entries(prefix)`,
    `CREATE INDEX IF NOT EXISTS idx_autocomplete_freq ON autocomplete_entries(frequency DESC)`,

    // Saved Searches with optional alerts
    `CREATE TABLE IF NOT EXISTS saved_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'anon',
      query TEXT NOT NULL,
      filters TEXT DEFAULT '{}',
      alert_enabled INTEGER DEFAULT 0,
      alert_frequency TEXT DEFAULT 'daily',
      last_result_count INTEGER DEFAULT 0,
      last_checked INTEGER DEFAULT (unixepoch()),
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_searches(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_saved_alert ON saved_searches(alert_enabled)`,

    // Search history (server-side, per user/session)
    `CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL DEFAULT '',
      user_id TEXT NOT NULL DEFAULT 'anon',
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      clicked_url TEXT DEFAULT '',
      duration_ms INTEGER DEFAULT 0,
      filters TEXT DEFAULT '{}',
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_history_session ON search_history(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_history_user ON search_history(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_history_created ON search_history(created_at DESC)`,

    // Image index for image search
    `CREATE TABLE IF NOT EXISTS image_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER,
      url TEXT NOT NULL,
      src TEXT NOT NULL,
      alt TEXT DEFAULT '',
      width INTEGER DEFAULT 0,
      height INTEGER DEFAULT 0,
      format TEXT DEFAULT '',
      thumbnail TEXT DEFAULT '',
      domain TEXT DEFAULT '',
      indexed_at INTEGER DEFAULT (unixepoch()),
      UNIQUE(src),
      FOREIGN KEY (page_id) REFERENCES pages(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_images_domain ON image_index(domain)`,
    `CREATE INDEX IF NOT EXISTS idx_images_page ON image_index(page_id)`,

    // Search analytics: click-through tracking
    `CREATE TABLE IF NOT EXISTS search_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      clicked_url TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      session_id TEXT DEFAULT '',
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_clicks_query ON search_clicks(query)`,
    `CREATE INDEX IF NOT EXISTS idx_clicks_created ON search_clicks(created_at DESC)`,

    // Zero-result queries tracker
    `CREATE TABLE IF NOT EXISTS zero_result_queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      count INTEGER DEFAULT 1,
      last_seen INTEGER DEFAULT (unixepoch()),
      resolved INTEGER DEFAULT 0,
      UNIQUE(query)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_zero_count ON zero_result_queries(count DESC)`,

    // Knowledge panels for known entities
    `CREATE TABLE IF NOT EXISTS knowledge_panels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT UNIQUE NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'concept',
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      image TEXT DEFAULT '',
      properties TEXT DEFAULT '{}',
      related TEXT DEFAULT '[]',
      source TEXT DEFAULT '',
      verified INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_kp_entity ON knowledge_panels(entity)`,
    `CREATE INDEX IF NOT EXISTS idx_kp_type ON knowledge_panels(entity_type)`,
  ];

  let created = 0;
  for (const sql of statements) {
    try { await db.prepare(sql).run(); created++; } catch (e) { /* table/index exists */ }
  }

  // Seed knowledge panels for BlackRoad entities
  const panels = [
    {
      entity: 'blackroad os', entity_type: 'product', title: 'BlackRoad OS',
      summary: 'Sovereign agent operating system running on Raspberry Pi clusters. Self-hosted AI infrastructure with 50 AI skills, distributed memory, and the Z-framework.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ founder: 'Alexa Louise Amundson', formed: '2025-11-17', type: 'Delaware C-Corp', nodes: 5, domains: 20, url: 'https://blackroad.io' }),
      related: JSON.stringify(['Alice', 'Lucidia', 'Cecilia', 'Octavia', 'Aria', 'Z-Framework', 'RoadNet']),
      source: 'internal', verified: 1,
    },
    {
      entity: 'alice', entity_type: 'agent', title: 'Alice — Gateway Agent',
      summary: 'The gateway agent running on a Pi 400 at 192.168.4.49. Routes traffic across 18 domains, manages Pi-hole DNS filtering, runs PostgreSQL and Qdrant vector DB.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ hardware: 'Pi 400', ip: '192.168.4.49', role: 'Gateway', services: ['DNS', 'PostgreSQL', 'Qdrant', 'Cloudflare Tunnels'] }),
      related: JSON.stringify(['BlackRoad OS', 'Lucidia', 'Cecilia', 'RoadNet']),
      source: 'fleet_scan', verified: 1,
    },
    {
      entity: 'lucidia', entity_type: 'agent', title: 'Lucidia — Memory Agent',
      summary: 'The dreamer. Memory and reasoning agent on a Pi 5 at 192.168.4.38. Runs the Lucidia API (FastAPI), manages persistent conversation memory, and provides meta-cognitive analysis.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ hardware: 'Pi 5', ip: '192.168.4.38', role: 'Memory & Reasoning', services: ['FastAPI', 'Ollama', 'GitHub Actions Runner'] }),
      related: JSON.stringify(['BlackRoad OS', 'Alice', 'Lucidia Studio', 'Lucidia QI']),
      source: 'fleet_scan', verified: 1,
    },
    {
      entity: 'cecilia', entity_type: 'agent', title: 'Cecilia — Edge Intelligence',
      summary: 'Edge AI agent with Hailo-8 (26 TOPS). Runs 16 Ollama models, TTS synthesis, MinIO object storage. Pi 5 at 192.168.4.96. Currently offline.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ hardware: 'Pi 5 + Hailo-8', ip: '192.168.4.96', role: 'Edge AI', status: 'offline', tops: 26, services: ['Ollama', 'TTS', 'MinIO', 'PostgreSQL'] }),
      related: JSON.stringify(['BlackRoad OS', 'Octavia', 'BlackRoad AI']),
      source: 'fleet_scan', verified: 1,
    },
    {
      entity: 'octavia', entity_type: 'agent', title: 'Octavia — Infrastructure Agent',
      summary: 'Infrastructure orchestration agent. 1TB NVMe, Hailo-8, hosts Gitea (629 repos), Docker Swarm leader. Pi 5 at 192.168.4.101.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ hardware: 'Pi 5 + 1TB NVMe + Hailo-8', ip: '192.168.4.101', role: 'Infrastructure', services: ['Gitea', 'Docker Swarm', 'NATS', 'OctoPrint'] }),
      related: JSON.stringify(['BlackRoad OS', 'Cecilia', 'RoadNet']),
      source: 'fleet_scan', verified: 1,
    },
    {
      entity: 'aria', entity_type: 'agent', title: 'Aria — Orchestration Agent',
      summary: 'Fleet orchestration agent. Runs Portainer v2.33.6 for container management, Headscale v0.23.0 for mesh VPN. Pi 5 at 192.168.4.98.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ hardware: 'Pi 5', ip: '192.168.4.98', role: 'Orchestration', services: ['Portainer', 'Headscale', 'Pironman5'] }),
      related: JSON.stringify(['BlackRoad OS', 'Alice', 'Octavia']),
      source: 'fleet_scan', verified: 1,
    },
    {
      entity: 'z-framework', entity_type: 'concept', title: 'Z-Framework — Z:=yx-w',
      summary: 'The unified feedback primitive. Every system interaction modeled as Z = yx - w. Z is system state, y is input signal, x is transform, w is noise/resistance. Makes infrastructure composable and mathematically coherent.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ formula: 'Z:=yx-w', type: 'Mathematical Framework', usage: 'All BlackRoad agents and services' }),
      related: JSON.stringify(['BlackRoad OS', 'Amundson Constant']),
      source: 'internal', verified: 1,
    },
    {
      entity: 'amundson constant', entity_type: 'concept', title: 'Amundson Constant (A_G)',
      summary: 'The limit of G(n) = n^(n+1)/(n+1)^n as n approaches infinity. A_G converges to 1/e. The Amundson Framework includes 50+ identities and connections to unsolved mathematical problems.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ formula: 'G(n) = n^(n+1) / (n+1)^n', limit: '1/e ≈ 0.367879441', digits_computed: '10M', paper: 'Paper A (LaTeX, 13pp)' }),
      related: JSON.stringify(['Z-Framework', 'BlackRoad OS']),
      source: 'mathematical_proof', verified: 1,
    },
    {
      entity: 'roadnet', entity_type: 'product', title: 'RoadNet — Mesh Carrier Network',
      summary: 'Carrier-grade mesh network spanning 5 Raspberry Pi nodes. WiFi mesh with dedicated subnets, WireGuard VPN, Pi-hole DNS filtering, and sovereign connectivity.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ nodes: 5, channels: 'CH1, CH6, CH11', subnets: '10.10.x.0/24', vpn: 'WireGuard', dns: 'Pi-hole', url: 'https://blackroad.network' }),
      related: JSON.stringify(['BlackRoad OS', 'Alice', 'RoadCoin']),
      source: 'internal', verified: 1,
    },
    {
      entity: 'roadcoin', entity_type: 'product', title: 'RoadCoin — Compute Credits',
      summary: 'Compute credit system for the BlackRoad mesh. Browser tabs become compute nodes via WebGPU+WASM+WebRTC. Contributors earn credits, consumers spend on AI inference at 50% of OpenAI pricing.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ model: '70/30 compute split', pricing: '50% of OpenAI', tech: 'WebGPU + WASM + WebRTC', url: 'https://roadcoin.io' }),
      related: JSON.stringify(['BlackRoad OS', 'RoadNet', 'BlackRoad AI']),
      source: 'internal', verified: 1,
    },
    {
      entity: 'roadchain', entity_type: 'product', title: 'RoadChain — Immutable Action Ledger',
      summary: 'Every action witnessed. Immutable ledger of agent decisions, infrastructure changes, and system events. Hash-chained audit trail with block explorer.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ type: 'Hash-chain ledger', algorithm: 'SHA-256', url: 'https://roadchain.io' }),
      related: JSON.stringify(['BlackRoad OS', 'RoadSearch']),
      source: 'internal', verified: 1,
    },
    {
      entity: 'alexa amundson', entity_type: 'person', title: 'Alexa Louise Amundson',
      summary: 'Founder and CEO of BlackRoad OS, Inc. Delaware C-Corporation formed via Stripe Atlas, November 17, 2025. Full-stack developer, infrastructure engineer, AI systems builder.',
      image: 'https://images.blackroad.io/pixel-art/road-logo.png',
      properties: JSON.stringify({ role: 'Founder & CEO', company: 'BlackRoad OS, Inc.', github: 'blackboxprogramming', formation: '2025-11-17' }),
      related: JSON.stringify(['BlackRoad OS', 'Amundson Constant']),
      source: 'legal_document', verified: 1,
    },
  ];

  for (const p of panels) {
    try {
      await db.prepare(
        `INSERT INTO knowledge_panels (entity, entity_type, title, summary, image, properties, related, source, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(entity) DO UPDATE SET
           title=excluded.title, summary=excluded.summary, image=excluded.image,
           properties=excluded.properties, related=excluded.related, source=excluded.source,
           verified=excluded.verified, updated_at=unixepoch()`
      ).bind(p.entity, p.entity_type, p.title, p.summary, p.image, p.properties, p.related, p.source, p.verified).run();
    } catch (e) { /* skip */ }
  }

  // Seed autocomplete from existing page titles
  try {
    const pages = await db.prepare('SELECT title FROM pages LIMIT 200').all();
    for (const page of (pages.results || [])) {
      const title = page.title || '';
      if (title.length < 3) continue;
      const prefix = title.toLowerCase().slice(0, 3);
      await db.prepare(
        `INSERT INTO autocomplete_entries (prefix, suggestion, frequency, source)
         VALUES (?, ?, 1, 'seed')
         ON CONFLICT(suggestion) DO NOTHING`
      ).bind(prefix, title).run();
    }
  } catch (e) { /* skip */ }

  return created;
}

// ─── 1. Search Autocomplete — /api/autocomplete ────────────────────
async function handleAutocomplete(request, env) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim()?.toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '8'), 20);

  if (!q || q.length < 1) {
    // Return popular queries when no prefix
    try {
      const popular = await env.DB.prepare(
        `SELECT suggestion, frequency FROM autocomplete_entries
         ORDER BY frequency DESC LIMIT ?`
      ).bind(limit).all();
      return Response.json({ suggestions: (popular.results || []).map(r => ({ text: r.suggestion, score: r.frequency })), query: '' });
    } catch {
      return Response.json({ suggestions: [], query: '' });
    }
  }

  try {
    // Search autocomplete entries by prefix
    const [prefixResults, titleResults, historyResults] = await Promise.all([
      env.DB.prepare(
        `SELECT suggestion, frequency FROM autocomplete_entries
         WHERE suggestion LIKE ? ORDER BY frequency DESC LIMIT ?`
      ).bind(`${q}%`, limit).all(),
      env.DB.prepare(
        `SELECT DISTINCT title as suggestion, clicks as frequency FROM pages
         WHERE LOWER(title) LIKE ? ORDER BY clicks DESC LIMIT ?`
      ).bind(`%${q}%`, limit).all(),
      env.DB.prepare(
        `SELECT query as suggestion, COUNT(*) as frequency FROM queries
         WHERE LOWER(query) LIKE ? AND results_count > 0
         GROUP BY query ORDER BY frequency DESC LIMIT ?`
      ).bind(`${q}%`, limit).all(),
    ]);

    // Merge and deduplicate
    const seen = new Set();
    const suggestions = [];
    for (const source of [prefixResults, historyResults, titleResults]) {
      for (const r of (source.results || [])) {
        const key = (r.suggestion || '').toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          suggestions.push({ text: r.suggestion, score: r.frequency || 0 });
        }
      }
    }

    // Sort by score and limit
    suggestions.sort((a, b) => b.score - a.score);

    return Response.json({ suggestions: suggestions.slice(0, limit), query: q });
  } catch (e) {
    return Response.json({ suggestions: [], query: q, error: e.message });
  }
}

// ─── 2. Advanced Search Operators ──────────────────────────────────
// Parse advanced operators: site:, filetype:, -exclude, "exact phrase"
function parseAdvancedQuery(rawQuery) {
  const parsed = {
    terms: [],
    site: null,
    filetype: null,
    excludes: [],
    exactPhrases: [],
    dateRange: null,
    verifiedOnly: false,
    contentType: null,
    raw: rawQuery,
  };

  let q = rawQuery;

  // Extract site: operator
  const siteMatch = q.match(/site:(\S+)/i);
  if (siteMatch) {
    parsed.site = siteMatch[1].toLowerCase();
    q = q.replace(siteMatch[0], '').trim();
  }

  // Extract filetype: operator
  const fileMatch = q.match(/filetype:(\S+)/i);
  if (fileMatch) {
    parsed.filetype = fileMatch[1].toLowerCase();
    q = q.replace(fileMatch[0], '').trim();
  }

  // Extract content type: type: operator
  const typeMatch = q.match(/type:(\S+)/i);
  if (typeMatch) {
    parsed.contentType = typeMatch[1].toLowerCase();
    q = q.replace(typeMatch[0], '').trim();
  }

  // Extract date range: after: before: operators
  const afterMatch = q.match(/after:(\S+)/i);
  const beforeMatch = q.match(/before:(\S+)/i);
  if (afterMatch || beforeMatch) {
    parsed.dateRange = {};
    if (afterMatch) { parsed.dateRange.after = afterMatch[1]; q = q.replace(afterMatch[0], '').trim(); }
    if (beforeMatch) { parsed.dateRange.before = beforeMatch[1]; q = q.replace(beforeMatch[0], '').trim(); }
  }

  // Extract verified: operator
  if (q.match(/verified:true/i) || q.match(/verified:yes/i)) {
    parsed.verifiedOnly = true;
    q = q.replace(/verified:(true|yes)/i, '').trim();
  }

  // Extract "exact phrases"
  const phraseRegex = /"([^"]+)"/g;
  let phraseMatch;
  while ((phraseMatch = phraseRegex.exec(q)) !== null) {
    parsed.exactPhrases.push(phraseMatch[1]);
  }
  q = q.replace(/"[^"]*"/g, '').trim();

  // Extract -exclude terms
  const excludeRegex = /-(\S+)/g;
  let exMatch;
  while ((exMatch = excludeRegex.exec(q)) !== null) {
    parsed.excludes.push(exMatch[1].toLowerCase());
  }
  q = q.replace(/-\S+/g, '').trim();

  // Remaining terms
  parsed.terms = q.split(/\s+/).filter(w => w.length >= 1);

  return parsed;
}

// Enhanced search with advanced operators
async function handleAdvancedSearch(request, env) {
  const url = new URL(request.url);
  const rawQ = url.searchParams.get('q')?.trim();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
  const offset = (page - 1) * limit;

  // Also accept filter params directly
  const siteFilter = url.searchParams.get('site');
  const dateFrom = url.searchParams.get('from') || url.searchParams.get('after');
  const dateTo = url.searchParams.get('to') || url.searchParams.get('before');
  const contentTypeFilter = url.searchParams.get('type') || url.searchParams.get('content_type');
  const verifiedFilter = url.searchParams.get('verified') === 'true';

  if (!rawQ || rawQ.length < 2) {
    return Response.json({ error: 'Query must be at least 2 characters', param: 'q' }, { status: 400 });
  }

  const parsed = parseAdvancedQuery(rawQ);

  // Override parsed with URL params
  if (siteFilter) parsed.site = siteFilter;
  if (contentTypeFilter) parsed.contentType = contentTypeFilter;
  if (verifiedFilter) parsed.verifiedOnly = true;
  if (dateFrom || dateTo) {
    parsed.dateRange = parsed.dateRange || {};
    if (dateFrom) parsed.dateRange.after = dateFrom;
    if (dateTo) parsed.dateRange.before = dateTo;
  }

  const startMs = Date.now();

  // Build search query from remaining terms + exact phrases
  const searchTerms = [...parsed.terms, ...parsed.exactPhrases];
  const ftsQuery = searchTerms.filter(w => w.length >= 1).map(w => `"${w}"*`).join(' AND ') || null;

  let results = [];
  let totalCount = 0;

  try {
    if (ftsQuery) {
      let sql = `SELECT p.id, p.url, p.title, p.description, p.content, p.domain, p.category, p.tags, p.image, rank as relevance
                 FROM pages_fts f JOIN pages p ON p.id = f.rowid WHERE pages_fts MATCH ?`;
      let countSql = `SELECT COUNT(*) as c FROM pages_fts f JOIN pages p ON p.id = f.rowid WHERE pages_fts MATCH ?`;
      const params = [ftsQuery];
      const countParams = [ftsQuery];

      if (parsed.site) { sql += ' AND p.domain LIKE ?'; countSql += ' AND p.domain LIKE ?'; const s = `%${parsed.site}%`; params.push(s); countParams.push(s); }
      if (parsed.contentType) { sql += ' AND p.category = ?'; countSql += ' AND p.category = ?'; params.push(parsed.contentType); countParams.push(parsed.contentType); }
      if (parsed.dateRange?.after) {
        const ts = Math.floor(new Date(parsed.dateRange.after).getTime() / 1000);
        sql += ' AND p.indexed_at >= ?'; countSql += ' AND p.indexed_at >= ?'; params.push(ts); countParams.push(ts);
      }
      if (parsed.dateRange?.before) {
        const ts = Math.floor(new Date(parsed.dateRange.before).getTime() / 1000) + 86400;
        sql += ' AND p.indexed_at <= ?'; countSql += ' AND p.indexed_at <= ?'; params.push(ts); countParams.push(ts);
      }

      sql += ' ORDER BY rank LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [countResult, searchResult] = await Promise.all([
        env.DB.prepare(countSql).bind(...countParams).first(),
        env.DB.prepare(sql).bind(...params).all(),
      ]);
      totalCount = countResult?.c || 0;
      results = (searchResult.results || []);
    } else {
      // Fallback to LIKE search
      let sql = `SELECT id, url, title, description, content, domain, category, tags, image, 0 as relevance FROM pages WHERE 1=1`;
      let countSql = `SELECT COUNT(*) as c FROM pages WHERE 1=1`;
      const params = [];
      const countParams = [];

      if (parsed.site) { sql += ' AND domain LIKE ?'; countSql += ' AND domain LIKE ?'; const s = `%${parsed.site}%`; params.push(s); countParams.push(s); }
      if (parsed.contentType) { sql += ' AND category = ?'; countSql += ' AND category = ?'; params.push(parsed.contentType); countParams.push(parsed.contentType); }

      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [countResult, searchResult] = await Promise.all([
        env.DB.prepare(countSql).bind(...countParams).first(),
        env.DB.prepare(sql).bind(...params).all(),
      ]);
      totalCount = countResult?.c || 0;
      results = (searchResult.results || []);
    }
  } catch (e) {
    return Response.json({ error: 'Search failed', detail: e.message }, { status: 500 });
  }

  // Post-filter: exclude terms
  if (parsed.excludes.length > 0) {
    results = results.filter(r => {
      const text = `${r.title} ${r.description} ${r.content} ${r.tags}`.toLowerCase();
      return !parsed.excludes.some(ex => text.includes(ex));
    });
    totalCount = results.length;
  }

  // Post-filter: exact phrases must appear in content
  if (parsed.exactPhrases.length > 0) {
    results = results.filter(r => {
      const text = `${r.title} ${r.description} ${r.content}`.toLowerCase();
      return parsed.exactPhrases.every(ph => text.includes(ph.toLowerCase()));
    });
    totalCount = results.length;
  }

  // Build response items
  const items = results.map(r => ({
    url: r.url,
    title: r.title,
    snippet: buildSnippet(r.description || r.content || '', searchTerms.join(' ')),
    domain: r.domain,
    category: r.category,
    image: r.image || null,
    tags: r.tags ? r.tags.split(',').map(t => t.trim()) : [],
    relevance: Math.abs(r.relevance || 0),
  }));

  // Normalize scores
  if (items.length > 0) {
    const maxRel = Math.max(...items.map(i => i.relevance), 0.001);
    items.forEach(i => { i.score = Math.max(0.1, i.relevance / maxRel); });
  }

  // Knowledge panel lookup
  let knowledgePanel = null;
  try {
    const entityQuery = searchTerms.join(' ').toLowerCase();
    const kp = await env.DB.prepare(
      `SELECT * FROM knowledge_panels WHERE entity = ? OR entity LIKE ?`
    ).bind(entityQuery, `%${entityQuery}%`).first();
    if (kp) {
      knowledgePanel = {
        title: kp.title,
        type: kp.entity_type,
        summary: kp.summary,
        image: kp.image,
        properties: JSON.parse(kp.properties || '{}'),
        related: JSON.parse(kp.related || '[]'),
        verified: !!kp.verified,
      };
    }
  } catch {}

  const durationMs = Date.now() - startMs;

  // Log to search history
  try {
    const sessionId = request.headers.get('CF-Ray') || '';
    await env.DB.prepare(
      `INSERT INTO search_history (session_id, query, results_count, duration_ms, filters)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(sessionId, rawQ, items.length, durationMs, JSON.stringify({
      site: parsed.site, type: parsed.contentType, excludes: parsed.excludes, phrases: parsed.exactPhrases,
    })).run();
  } catch {}

  // Track zero-result queries
  if (items.length === 0) {
    try {
      await env.DB.prepare(
        `INSERT INTO zero_result_queries (query, count, last_seen)
         VALUES (?, 1, unixepoch())
         ON CONFLICT(query) DO UPDATE SET count = count + 1, last_seen = unixepoch()`
      ).bind(rawQ).run();
    } catch {}
  }

  // Update autocomplete frequency
  if (items.length > 0) {
    try {
      const prefix = rawQ.toLowerCase().slice(0, 3);
      await env.DB.prepare(
        `INSERT INTO autocomplete_entries (prefix, suggestion, frequency, source)
         VALUES (?, ?, 1, 'search')
         ON CONFLICT(suggestion) DO UPDATE SET frequency = frequency + 1, updated_at = unixepoch()`
      ).bind(prefix, rawQ).run();
    } catch {}
  }

  return Response.json({
    query: rawQ,
    parsed_operators: {
      terms: parsed.terms,
      site: parsed.site,
      filetype: parsed.filetype,
      content_type: parsed.contentType,
      excludes: parsed.excludes,
      exact_phrases: parsed.exactPhrases,
      date_range: parsed.dateRange,
      verified_only: parsed.verifiedOnly,
    },
    results: items,
    total: totalCount,
    page,
    pages: Math.ceil(totalCount / limit),
    knowledge_panel: knowledgePanel,
    duration_ms: durationMs,
  });
}

// ─── 3. Saved Searches — /api/saved-searches ────────────────────────
async function handleSavedSearches(request, env) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id') || 'anon';

  if (request.method === 'POST') {
    // Save a search
    try {
      const body = await request.json();
      const query = body.query?.trim();
      if (!query) return Response.json({ error: 'query required' }, { status: 400 });

      const filters = JSON.stringify(body.filters || {});
      const alertEnabled = body.alert_enabled ? 1 : 0;
      const alertFrequency = body.alert_frequency || 'daily';

      // Get current result count for this query
      let resultCount = 0;
      try {
        const ftsQ = query.replace(/[^\w\s\-\.]/g, '').split(/\s+/).filter(w => w.length >= 1).map(w => w + '*').join(' OR ');
        if (ftsQ) {
          const countResult = await env.DB.prepare(
            `SELECT COUNT(*) as c FROM pages_fts f JOIN pages p ON p.id = f.rowid WHERE pages_fts MATCH ?`
          ).bind(ftsQ).first();
          resultCount = countResult?.c || 0;
        }
      } catch {}

      const result = await env.DB.prepare(
        `INSERT INTO saved_searches (user_id, query, filters, alert_enabled, alert_frequency, last_result_count)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(userId, query, filters, alertEnabled, alertFrequency, resultCount).run();

      return Response.json({
        ok: true,
        id: result.meta?.last_row_id,
        query,
        alert_enabled: !!alertEnabled,
        result_count: resultCount,
      });
    } catch (e) {
      return Response.json({ error: 'Failed to save search', detail: e.message }, { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    try {
      await env.DB.prepare('DELETE FROM saved_searches WHERE id = ? AND user_id = ?').bind(id, userId).run();
      return Response.json({ ok: true, deleted: id });
    } catch (e) {
      return Response.json({ error: 'Failed to delete', detail: e.message }, { status: 500 });
    }
  }

  // GET: list saved searches
  try {
    const rows = await env.DB.prepare(
      `SELECT id, query, filters, alert_enabled, alert_frequency, last_result_count, last_checked, created_at
       FROM saved_searches WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
    ).bind(userId).all();

    // Check for new results on each saved search
    const savedSearches = [];
    for (const row of (rows.results || [])) {
      let newResults = 0;
      try {
        const ftsQ = row.query.replace(/[^\w\s\-\.]/g, '').split(/\s+/).filter(w => w.length >= 1).map(w => w + '*').join(' OR ');
        if (ftsQ) {
          const countResult = await env.DB.prepare(
            `SELECT COUNT(*) as c FROM pages_fts f JOIN pages p ON p.id = f.rowid WHERE pages_fts MATCH ?`
          ).bind(ftsQ).first();
          const currentCount = countResult?.c || 0;
          newResults = Math.max(0, currentCount - (row.last_result_count || 0));
        }
      } catch {}

      savedSearches.push({
        id: row.id,
        query: row.query,
        filters: JSON.parse(row.filters || '{}'),
        alert_enabled: !!row.alert_enabled,
        alert_frequency: row.alert_frequency,
        last_result_count: row.last_result_count,
        new_results: newResults,
        last_checked: row.last_checked ? new Date(row.last_checked * 1000).toISOString() : null,
        created_at: row.created_at ? new Date(row.created_at * 1000).toISOString() : null,
      });
    }

    return Response.json({ saved_searches: savedSearches, user_id: userId });
  } catch (e) {
    return Response.json({ saved_searches: [], error: e.message });
  }
}

// ─── 4. Search History — /api/history ────────────────────────────────
async function handleHistory(request, env) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id') || 'anon';
  const sessionId = url.searchParams.get('session_id') || '';

  if (request.method === 'DELETE') {
    // Clear history
    try {
      if (sessionId) {
        await env.DB.prepare('DELETE FROM search_history WHERE session_id = ?').bind(sessionId).run();
      } else {
        await env.DB.prepare('DELETE FROM search_history WHERE user_id = ?').bind(userId).run();
      }
      return Response.json({ ok: true, cleared: true });
    } catch (e) {
      return Response.json({ error: 'Failed to clear history', detail: e.message }, { status: 500 });
    }
  }

  // GET: return history + trending
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
  const period = url.searchParams.get('period') || '7d';

  // Calculate period in seconds
  const periodMap = { '1h': 3600, '24h': 86400, '7d': 604800, '30d': 2592000, 'all': 999999999 };
  const periodSec = periodMap[period] || 604800;

  try {
    const [historyRows, trendingRows, totalSearches] = await Promise.all([
      // User/session history
      env.DB.prepare(
        `SELECT id, query, results_count, duration_ms, filters, created_at
         FROM search_history
         WHERE (user_id = ? OR session_id = ?)
         ORDER BY created_at DESC LIMIT ?`
      ).bind(userId, sessionId, limit).all(),

      // Trending searches across all users
      env.DB.prepare(
        `SELECT query, COUNT(*) as count, AVG(results_count) as avg_results, AVG(duration_ms) as avg_duration
         FROM search_history
         WHERE created_at > unixepoch() - ?
         GROUP BY query ORDER BY count DESC LIMIT 20`
      ).bind(periodSec).all(),

      // Total searches count
      env.DB.prepare('SELECT COUNT(*) as c FROM search_history').first(),
    ]);

    return Response.json({
      history: (historyRows.results || []).map(r => ({
        id: r.id,
        query: r.query,
        results_count: r.results_count,
        duration_ms: r.duration_ms,
        filters: JSON.parse(r.filters || '{}'),
        searched_at: r.created_at ? new Date(r.created_at * 1000).toISOString() : null,
      })),
      trending: (trendingRows.results || []).map(r => ({
        query: r.query,
        count: r.count,
        avg_results: Math.round(r.avg_results || 0),
        avg_duration_ms: Math.round(r.avg_duration || 0),
      })),
      total_searches: totalSearches?.c || 0,
      period,
    });
  } catch (e) {
    return Response.json({ history: [], trending: [], error: e.message });
  }
}

// ─── 5. Image Search — /api/search/images ────────────────────────────
async function handleImageSearch(request, env) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  const domain = url.searchParams.get('domain');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  const offset = (page - 1) * limit;

  if (!q || q.length < 2) {
    return Response.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  const startMs = Date.now();

  try {
    // First try: search image_index table
    let imageSql = `SELECT i.id, i.src, i.alt, i.width, i.height, i.format, i.thumbnail, i.domain,
                           p.title as page_title, p.url as page_url
                    FROM image_index i
                    LEFT JOIN pages p ON p.id = i.page_id
                    WHERE (i.alt LIKE ? OR p.title LIKE ? OR p.url LIKE ?)`;
    const likeQ = `%${q}%`;
    const params = [likeQ, likeQ, likeQ];

    if (domain) { imageSql += ' AND i.domain LIKE ?'; params.push(`%${domain}%`); }
    imageSql += ' ORDER BY i.indexed_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const imageResults = await env.DB.prepare(imageSql).bind(...params).all();
    let images = (imageResults.results || []);

    // If no dedicated image results, fall back to page images
    if (images.length === 0) {
      const pageImgSql = `SELECT p.id, p.url as page_url, p.title as page_title, p.image as src,
                                 p.domain, p.description as alt
                          FROM pages p
                          WHERE p.image != '' AND p.image IS NOT NULL
                          AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`;
      const pageParams = [likeQ, likeQ, likeQ];
      if (domain) { /* no extra filter needed */ }
      const pageResults = await env.DB.prepare(pageImgSql + ' LIMIT ? OFFSET ?').bind(...pageParams, limit, offset).all();
      images = (pageResults.results || []).map(r => ({
        id: r.id,
        src: r.src,
        alt: r.alt || r.page_title || '',
        width: 0,
        height: 0,
        format: '',
        thumbnail: r.src,
        domain: r.domain,
        page_title: r.page_title,
        page_url: r.page_url,
      }));
    }

    const durationMs = Date.now() - startMs;

    return Response.json({
      query: q,
      images: images.map(img => ({
        src: img.src,
        thumbnail: img.thumbnail || img.src,
        alt: img.alt || '',
        width: img.width || null,
        height: img.height || null,
        format: img.format || null,
        domain: img.domain || '',
        page_title: img.page_title || '',
        page_url: img.page_url || '',
      })),
      total: images.length,
      page,
      duration_ms: durationMs,
    });
  } catch (e) {
    return Response.json({ query: q, images: [], total: 0, error: e.message });
  }
}

// ─── 6. Search Analytics — /api/search/analytics ─────────────────────
async function handleSearchAnalytics(request, env) {
  const url = new URL(request.url);
  const period = url.searchParams.get('period') || '7d';
  const periodMap = { '1h': 3600, '24h': 86400, '7d': 604800, '30d': 2592000, 'all': 999999999 };
  const periodSec = periodMap[period] || 604800;

  try {
    const [
      topSearches, zeroResults, clickData, totalStats, avgDuration,
      searchVolume, topClickedPages
    ] = await Promise.all([
      // Most searched terms
      env.DB.prepare(
        `SELECT query, COUNT(*) as count FROM queries
         WHERE created_at > unixepoch() - ?
         GROUP BY query ORDER BY count DESC LIMIT 25`
      ).bind(periodSec).all(),

      // Zero-result queries
      env.DB.prepare(
        `SELECT query, count, last_seen FROM zero_result_queries
         WHERE resolved = 0 ORDER BY count DESC LIMIT 20`
      ).all(),

      // Click-through data
      env.DB.prepare(
        `SELECT query, clicked_url, COUNT(*) as clicks, AVG(position) as avg_position
         FROM search_clicks
         WHERE created_at > unixepoch() - ?
         GROUP BY query, clicked_url ORDER BY clicks DESC LIMIT 25`
      ).bind(periodSec).all(),

      // Total stats
      env.DB.prepare(
        `SELECT COUNT(*) as total_searches,
                COUNT(DISTINCT query) as unique_queries,
                SUM(CASE WHEN results_count = 0 THEN 1 ELSE 0 END) as zero_results,
                SUM(CASE WHEN ai_answered = 1 THEN 1 ELSE 0 END) as ai_answered
         FROM queries WHERE created_at > unixepoch() - ?`
      ).bind(periodSec).first(),

      // Average duration
      env.DB.prepare(
        `SELECT AVG(duration_ms) as avg_ms, MIN(duration_ms) as min_ms, MAX(duration_ms) as max_ms
         FROM search_history WHERE created_at > unixepoch() - ?`
      ).bind(periodSec).first(),

      // Search volume over time (hourly buckets)
      env.DB.prepare(
        `SELECT (created_at / 3600) * 3600 as bucket, COUNT(*) as count
         FROM queries WHERE created_at > unixepoch() - ?
         GROUP BY bucket ORDER BY bucket ASC`
      ).bind(periodSec).all(),

      // Top clicked pages
      env.DB.prepare(
        `SELECT p.title, p.url, p.clicks, p.category, p.domain
         FROM pages p WHERE p.clicks > 0
         ORDER BY p.clicks DESC LIMIT 15`
      ).all(),
    ]);

    // Calculate click-through rate
    const totalSearchCount = totalStats?.total_searches || 0;
    const clickRows = (clickData.results || []);
    const totalClicks = clickRows.reduce((s, r) => s + r.clicks, 0);
    const ctr = totalSearchCount > 0 ? Math.round((totalClicks / totalSearchCount) * 10000) / 100 : 0;

    return Response.json({
      period,
      overview: {
        total_searches: totalSearchCount,
        unique_queries: totalStats?.unique_queries || 0,
        zero_result_searches: totalStats?.zero_results || 0,
        ai_answered_searches: totalStats?.ai_answered || 0,
        click_through_rate: ctr,
        avg_duration_ms: Math.round(avgDuration?.avg_ms || 0),
        min_duration_ms: avgDuration?.min_ms || 0,
        max_duration_ms: avgDuration?.max_ms || 0,
      },
      top_searches: (topSearches.results || []).map(r => ({
        query: r.query,
        count: r.count,
      })),
      zero_result_queries: (zeroResults.results || []).map(r => ({
        query: r.query,
        count: r.count,
        last_seen: r.last_seen ? new Date(r.last_seen * 1000).toISOString() : null,
      })),
      click_through: clickRows.map(r => ({
        query: r.query,
        url: r.clicked_url,
        clicks: r.clicks,
        avg_position: Math.round(r.avg_position * 10) / 10,
      })),
      search_volume: (searchVolume.results || []).map(r => ({
        timestamp: new Date(r.bucket * 1000).toISOString(),
        count: r.count,
      })),
      top_clicked_pages: (topClickedPages.results || []).map(r => ({
        title: r.title,
        url: r.url,
        clicks: r.clicks,
        category: r.category,
        domain: r.domain,
      })),
    });
  } catch (e) {
    return Response.json({ error: 'Analytics failed', detail: e.message }, { status: 500 });
  }
}

// ─── 7. Knowledge Panels — /api/knowledge ───────────────────────────
async function handleKnowledgePanel(request, env) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity')?.trim()?.toLowerCase();
  const entityType = url.searchParams.get('type');

  if (request.method === 'POST') {
    // Add/update a knowledge panel
    try {
      const body = await request.json();
      if (!body.entity || !body.title) return Response.json({ error: 'entity and title required' }, { status: 400 });

      await env.DB.prepare(
        `INSERT INTO knowledge_panels (entity, entity_type, title, summary, image, properties, related, source, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(entity) DO UPDATE SET
           entity_type=excluded.entity_type, title=excluded.title, summary=excluded.summary,
           image=excluded.image, properties=excluded.properties, related=excluded.related,
           source=excluded.source, verified=excluded.verified, updated_at=unixepoch()`
      ).bind(
        body.entity.toLowerCase(), body.entity_type || 'concept', body.title,
        body.summary || '', body.image || '', JSON.stringify(body.properties || {}),
        JSON.stringify(body.related || []), body.source || '', body.verified ? 1 : 0,
      ).run();

      return Response.json({ ok: true, entity: body.entity });
    } catch (e) {
      return Response.json({ error: 'Failed to save', detail: e.message }, { status: 500 });
    }
  }

  // GET: retrieve knowledge panel(s)
  try {
    if (entity) {
      // Search for a specific entity
      const kp = await env.DB.prepare(
        `SELECT * FROM knowledge_panels WHERE entity = ? OR entity LIKE ?`
      ).bind(entity, `%${entity}%`).first();

      if (!kp) return Response.json({ found: false, entity });

      return Response.json({
        found: true,
        panel: {
          entity: kp.entity,
          type: kp.entity_type,
          title: kp.title,
          summary: kp.summary,
          image: kp.image,
          properties: JSON.parse(kp.properties || '{}'),
          related: JSON.parse(kp.related || '[]'),
          source: kp.source,
          verified: !!kp.verified,
          updated_at: kp.updated_at ? new Date(kp.updated_at * 1000).toISOString() : null,
        },
      });
    }

    // List all panels (optionally filtered by type)
    let sql = 'SELECT * FROM knowledge_panels';
    const params = [];
    if (entityType) { sql += ' WHERE entity_type = ?'; params.push(entityType); }
    sql += ' ORDER BY entity ASC LIMIT 100';

    const rows = await env.DB.prepare(sql).bind(...params).all();
    return Response.json({
      panels: (rows.results || []).map(kp => ({
        entity: kp.entity,
        type: kp.entity_type,
        title: kp.title,
        summary: kp.summary,
        image: kp.image,
        verified: !!kp.verified,
      })),
      total: (rows.results || []).length,
    });
  } catch (e) {
    return Response.json({ panels: [], error: e.message });
  }
}

// ─── 8. Enhanced Click Tracking with position ────────────────────────
async function handleClickTracking(request, env) {
  try {
    const body = await request.json();
    const { page_id, url: clickedUrl, query, position } = body;

    // Update page clicks
    if (page_id) {
      await env.DB.prepare('UPDATE pages SET clicks = COALESCE(clicks, 0) + 1 WHERE id = ?').bind(page_id).run().catch(() => {});
    }

    // Track click-through for analytics
    if (query && clickedUrl) {
      const sessionId = request.headers.get('CF-Ray') || '';
      await env.DB.prepare(
        `INSERT INTO search_clicks (query, clicked_url, position, session_id)
         VALUES (?, ?, ?, ?)`
      ).bind(query, clickedUrl, position || 0, sessionId).run();
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}

// ─── 9. Crawl Images for Image Index ─────────────────────────────────
async function handleCrawlImageIndex(env) {
  // Crawl pages and extract all images for the image search index
  const pages = await env.DB.prepare(
    `SELECT id, url, domain, title FROM pages ORDER BY updated_at DESC LIMIT 30`
  ).all();

  const results = [];
  const rows = pages.results || [];

  for (let i = 0; i < rows.length; i += 5) {
    const batch = rows.slice(i, i + 5);
    const promises = batch.map(async (page) => {
      try {
        const resp = await fetch(page.url, {
          headers: { 'User-Agent': 'RoadSearch/3.0 (image indexer)' },
          signal: AbortSignal.timeout(5000),
          redirect: 'follow',
        });
        if (!resp.ok) return { id: page.id, status: 'http_error', images: 0 };
        const html = await resp.text();

        // Extract all img tags
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/gi;
        let match;
        let imageCount = 0;

        while ((match = imgRegex.exec(html)) !== null) {
          let src = match[1];
          const alt = match[2] || '';

          // Resolve relative URLs
          if (!src.startsWith('http')) {
            try { src = new URL(src, page.url).href; } catch { continue; }
          }

          // Skip data URIs and tiny icons
          if (src.startsWith('data:')) continue;
          if (src.includes('favicon')) continue;

          // Determine format
          const format = src.match(/\.(png|jpg|jpeg|gif|webp|svg|avif)/i)?.[1] || '';

          try {
            await env.DB.prepare(
              `INSERT INTO image_index (page_id, url, src, alt, format, domain)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(src) DO UPDATE SET alt=excluded.alt, domain=excluded.domain`
            ).bind(page.id, page.url, src, alt, format, page.domain).run();
            imageCount++;
          } catch {}
        }

        // Also add og:image if present
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        if (ogMatch) {
          let ogSrc = ogMatch[1];
          if (!ogSrc.startsWith('http')) { try { ogSrc = new URL(ogSrc, page.url).href; } catch { ogSrc = null; } }
          if (ogSrc) {
            try {
              await env.DB.prepare(
                `INSERT INTO image_index (page_id, url, src, alt, format, domain, thumbnail)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(src) DO UPDATE SET alt=excluded.alt, thumbnail=excluded.thumbnail`
              ).bind(page.id, page.url, ogSrc, page.title, '', page.domain, ogSrc).run();
              imageCount++;
            } catch {}
          }
        }

        return { id: page.id, url: page.url, status: 'ok', images: imageCount };
      } catch (e) {
        return { id: page.id, status: 'error', error: e.message, images: 0 };
      }
    });
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  const totalImages = results.reduce((s, r) => s + r.images, 0);
  return Response.json({ crawled: results.length, total_images: totalImages, results });
}

// ══════════════════════════════════════════════════════════════════════
// ║  NEW FEATURES v4 — Collections, Alerts, Audit, Extract,          ║
// ║  Compare, Archive, Domain Intel, Search Sharing                   ║
// ══════════════════════════════════════════════════════════════════════

async function initV4Tables(db) {
  const statements = [
    // ── Search Collections ──
    `CREATE TABLE IF NOT EXISTS search_collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      user_id TEXT NOT NULL DEFAULT 'anon',
      is_public INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS collection_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      snippet TEXT DEFAULT '',
      note TEXT DEFAULT '',
      position INTEGER DEFAULT 0,
      added_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (collection_id) REFERENCES search_collections(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_coll_slug ON search_collections(slug)`,
    `CREATE INDEX IF NOT EXISTS idx_coll_user ON search_collections(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_coll_items_coll ON collection_items(collection_id)`,

    // ── Web Alerts ──
    `CREATE TABLE IF NOT EXISTS web_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'anon',
      topic TEXT NOT NULL,
      keywords TEXT NOT NULL DEFAULT '',
      domains TEXT DEFAULT '',
      frequency TEXT DEFAULT 'daily',
      last_checked INTEGER DEFAULT (unixepoch()),
      last_match_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS alert_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      title TEXT DEFAULT '',
      snippet TEXT DEFAULT '',
      matched_at INTEGER DEFAULT (unixepoch()),
      seen INTEGER DEFAULT 0,
      FOREIGN KEY (alert_id) REFERENCES web_alerts(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_alerts_user ON web_alerts(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_alerts_active ON web_alerts(is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_alert_matches_alert ON alert_matches(alert_id)`,

    // ── Site Audit ──
    `CREATE TABLE IF NOT EXISTS site_audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      domain TEXT NOT NULL DEFAULT '',
      status_code INTEGER DEFAULT 0,
      title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      h1_count INTEGER DEFAULT 0,
      h2_count INTEGER DEFAULT 0,
      img_no_alt INTEGER DEFAULT 0,
      total_images INTEGER DEFAULT 0,
      internal_links INTEGER DEFAULT 0,
      external_links INTEGER DEFAULT 0,
      broken_links INTEGER DEFAULT 0,
      word_count INTEGER DEFAULT 0,
      has_viewport INTEGER DEFAULT 0,
      has_charset INTEGER DEFAULT 0,
      has_canonical INTEGER DEFAULT 0,
      has_og_tags INTEGER DEFAULT 0,
      has_twitter_tags INTEGER DEFAULT 0,
      has_structured_data INTEGER DEFAULT 0,
      page_size_bytes INTEGER DEFAULT 0,
      load_time_ms INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      issues TEXT DEFAULT '[]',
      audited_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_audits_domain ON site_audits(domain)`,
    `CREATE INDEX IF NOT EXISTS idx_audits_url ON site_audits(url)`,

    // ── Snippet Extraction ──
    `CREATE TABLE IF NOT EXISTS extracted_snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      domain TEXT DEFAULT '',
      title TEXT DEFAULT '',
      author TEXT DEFAULT '',
      published_date TEXT DEFAULT '',
      main_content TEXT DEFAULT '',
      description TEXT DEFAULT '',
      language TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      links TEXT DEFAULT '[]',
      word_count INTEGER DEFAULT 0,
      extracted_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_snippets_url ON extracted_snippets(url)`,

    // ── Page Archive ──
    `CREATE TABLE IF NOT EXISTS page_archives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      domain TEXT DEFAULT '',
      title TEXT DEFAULT '',
      content_hash TEXT DEFAULT '',
      html_snapshot TEXT DEFAULT '',
      text_content TEXT DEFAULT '',
      headers TEXT DEFAULT '{}',
      status_code INTEGER DEFAULT 200,
      archived_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_archives_url ON page_archives(url)`,
    `CREATE INDEX IF NOT EXISTS idx_archives_domain ON page_archives(domain)`,
    `CREATE INDEX IF NOT EXISTS idx_archives_hash ON page_archives(content_hash)`,

    // ── Domain Intelligence ──
    `CREATE TABLE IF NOT EXISTS domain_intel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT UNIQUE NOT NULL,
      ip_address TEXT DEFAULT '',
      server TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '[]',
      meta_generator TEXT DEFAULT '',
      has_ssl INTEGER DEFAULT 0,
      redirect_chain TEXT DEFAULT '[]',
      dns_records TEXT DEFAULT '{}',
      headers TEXT DEFAULT '{}',
      page_count INTEGER DEFAULT 0,
      related_domains TEXT DEFAULT '[]',
      first_seen INTEGER DEFAULT (unixepoch()),
      last_checked INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_intel_domain ON domain_intel(domain)`,

    // ── Search Sharing ──
    `CREATE TABLE IF NOT EXISTS shared_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      share_id TEXT UNIQUE NOT NULL,
      query TEXT NOT NULL,
      results TEXT NOT NULL DEFAULT '[]',
      annotations TEXT DEFAULT '{}',
      title TEXT DEFAULT '',
      description TEXT DEFAULT '',
      user_id TEXT DEFAULT 'anon',
      view_count INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      expires_at INTEGER DEFAULT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_shared_id ON shared_searches(share_id)`,
    `CREATE INDEX IF NOT EXISTS idx_shared_user ON shared_searches(user_id)`,

    // ── Search Comparison ──
    `CREATE TABLE IF NOT EXISTS search_comparisons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comparison_id TEXT UNIQUE NOT NULL,
      query TEXT NOT NULL,
      engines TEXT NOT NULL DEFAULT '[]',
      results TEXT NOT NULL DEFAULT '{}',
      overlap_score REAL DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comparisons_id ON search_comparisons(comparison_id)`,
  ];

  let created = 0;
  for (const sql of statements) {
    try { await db.prepare(sql).run(); created++; } catch (e) { console.log('v4 schema skip:', e.message); }
  }
  return created;
}

// ─── 1. Search Collections ──────────────────────────────────────────
async function handleCollections(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const url = new URL(request.url);

  if (request.method === 'POST') {
    const body = await request.json();
    const { name, description, user_id, is_public, items } = body;
    if (!name) return Response.json({ error: 'name required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    await env.DB.prepare(
      `INSERT INTO search_collections (name, slug, description, user_id, is_public)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(name, slug, description || '', user_id || 'anon', is_public ? 1 : 0).run();

    const coll = await env.DB.prepare('SELECT * FROM search_collections WHERE slug = ?').bind(slug).first();

    // Add items if provided
    if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await env.DB.prepare(
          `INSERT INTO collection_items (collection_id, url, title, snippet, note, position)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(coll.id, item.url || '', item.title || '', item.snippet || '', item.note || '', i).run();
      }
    }

    return Response.json({ ok: true, collection: { ...coll, slug, items: items || [] } });
  }

  if (request.method === 'PUT') {
    const body = await request.json();
    const { slug, items, name, description, is_public } = body;
    if (!slug) return Response.json({ error: 'slug required' }, { status: 400 });

    const coll = await env.DB.prepare('SELECT * FROM search_collections WHERE slug = ?').bind(slug).first();
    if (!coll) return Response.json({ error: 'Collection not found' }, { status: 404 });

    if (name !== undefined) {
      await env.DB.prepare('UPDATE search_collections SET name = ?, updated_at = unixepoch() WHERE id = ?').bind(name, coll.id).run();
    }
    if (description !== undefined) {
      await env.DB.prepare('UPDATE search_collections SET description = ?, updated_at = unixepoch() WHERE id = ?').bind(description, coll.id).run();
    }
    if (is_public !== undefined) {
      await env.DB.prepare('UPDATE search_collections SET is_public = ?, updated_at = unixepoch() WHERE id = ?').bind(is_public ? 1 : 0, coll.id).run();
    }

    // Add new items
    if (Array.isArray(items)) {
      for (const item of items) {
        await env.DB.prepare(
          `INSERT INTO collection_items (collection_id, url, title, snippet, note, position)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(coll.id, item.url || '', item.title || '', item.snippet || '', item.note || '', item.position || 0).run();
      }
    }

    return Response.json({ ok: true, updated: slug });
  }

  if (request.method === 'DELETE') {
    const slug = url.searchParams.get('slug');
    if (!slug) return Response.json({ error: 'slug required' }, { status: 400 });
    const coll = await env.DB.prepare('SELECT id FROM search_collections WHERE slug = ?').bind(slug).first();
    if (coll) {
      await env.DB.prepare('DELETE FROM collection_items WHERE collection_id = ?').bind(coll.id).run();
      await env.DB.prepare('DELETE FROM search_collections WHERE id = ?').bind(coll.id).run();
    }
    return Response.json({ ok: true, deleted: slug });
  }

  // GET — list or get by slug
  const slug = url.searchParams.get('slug');
  const userId = url.searchParams.get('user_id');

  if (slug) {
    const coll = await env.DB.prepare('SELECT * FROM search_collections WHERE slug = ?').bind(slug).first();
    if (!coll) return Response.json({ error: 'Not found' }, { status: 404 });
    const items = await env.DB.prepare(
      'SELECT * FROM collection_items WHERE collection_id = ? ORDER BY position'
    ).bind(coll.id).all();
    return Response.json({ collection: { ...coll, items: items.results || [] } });
  }

  let sql = 'SELECT * FROM search_collections';
  const params = [];
  if (userId) {
    sql += ' WHERE user_id = ? OR is_public = 1';
    params.push(userId);
  } else {
    sql += ' WHERE is_public = 1';
  }
  sql += ' ORDER BY updated_at DESC LIMIT 50';

  const collections = await env.DB.prepare(sql).bind(...params).all();
  return Response.json({ collections: collections.results || [] });
}

// ─── 2. Web Alerts ──────────────────────────────────────────────────
async function handleAlerts(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const url = new URL(request.url);

  if (request.method === 'POST') {
    const body = await request.json();
    const { user_id, topic, keywords, domains, frequency } = body;
    if (!topic) return Response.json({ error: 'topic required' }, { status: 400 });

    await env.DB.prepare(
      `INSERT INTO web_alerts (user_id, topic, keywords, domains, frequency)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(
      user_id || 'anon',
      topic,
      Array.isArray(keywords) ? keywords.join(',') : (keywords || topic),
      Array.isArray(domains) ? domains.join(',') : (domains || ''),
      frequency || 'daily'
    ).run();

    const alert = await env.DB.prepare('SELECT * FROM web_alerts ORDER BY id DESC LIMIT 1').first();
    return Response.json({ ok: true, alert });
  }

  if (request.method === 'DELETE') {
    const alertId = url.searchParams.get('id');
    if (!alertId) return Response.json({ error: 'id required' }, { status: 400 });
    await env.DB.prepare('DELETE FROM alert_matches WHERE alert_id = ?').bind(parseInt(alertId)).run();
    await env.DB.prepare('DELETE FROM web_alerts WHERE id = ?').bind(parseInt(alertId)).run();
    return Response.json({ ok: true, deleted: alertId });
  }

  if (request.method === 'PUT') {
    const body = await request.json();
    const { id, is_active, frequency } = body;
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    if (is_active !== undefined) {
      await env.DB.prepare('UPDATE web_alerts SET is_active = ? WHERE id = ?').bind(is_active ? 1 : 0, parseInt(id)).run();
    }
    if (frequency) {
      await env.DB.prepare('UPDATE web_alerts SET frequency = ? WHERE id = ?').bind(frequency, parseInt(id)).run();
    }
    return Response.json({ ok: true, updated: id });
  }

  // GET — list alerts + check for matches
  const userId = url.searchParams.get('user_id') || 'anon';
  const checkNow = url.searchParams.get('check') === 'true';

  const alerts = await env.DB.prepare(
    'SELECT * FROM web_alerts WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();

  const alertList = alerts.results || [];

  // Optionally run a check against the search index
  if (checkNow) {
    for (const alert of alertList) {
      if (!alert.is_active) continue;
      const kws = (alert.keywords || alert.topic).split(',').map(k => k.trim()).filter(Boolean);
      const ftsQ = kws.map(k => k + '*').join(' OR ');

      try {
        const matches = await env.DB.prepare(
          `SELECT p.url, p.title, p.description FROM pages_fts f
           JOIN pages p ON p.id = f.rowid
           WHERE pages_fts MATCH ? ORDER BY rank LIMIT 10`
        ).bind(ftsQ).all();

        let newMatches = 0;
        for (const m of (matches.results || [])) {
          const existing = await env.DB.prepare(
            'SELECT id FROM alert_matches WHERE alert_id = ? AND url = ?'
          ).bind(alert.id, m.url).first();
          if (!existing) {
            await env.DB.prepare(
              `INSERT INTO alert_matches (alert_id, url, title, snippet)
               VALUES (?, ?, ?, ?)`
            ).bind(alert.id, m.url, m.title, (m.description || '').slice(0, 300)).run();
            newMatches++;
          }
        }

        await env.DB.prepare(
          'UPDATE web_alerts SET last_checked = unixepoch(), last_match_count = ? WHERE id = ?'
        ).bind(newMatches, alert.id).run();
      } catch {}
    }
  }

  // Fetch recent matches for each alert
  const result = [];
  for (const alert of alertList) {
    const matches = await env.DB.prepare(
      'SELECT * FROM alert_matches WHERE alert_id = ? ORDER BY matched_at DESC LIMIT 10'
    ).bind(alert.id).all();
    result.push({ ...alert, recent_matches: matches.results || [] });
  }

  return Response.json({ alerts: result });
}

// ─── 3. Site Audit ──────────────────────────────────────────────────
function isPrivateURL(urlStr) {
  try {
    const u = new URL(urlStr); const h = u.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '::1') return true;
    if (h.startsWith('10.') || h.startsWith('192.168.')) return true;
    if (h.startsWith('172.')) { const s = parseInt(h.split('.')[1]); if (s >= 16 && s <= 31) return true; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return true;
    return false;
  } catch { return true; }
}

async function handleSiteAudit(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) return Response.json({ error: 'url parameter required' }, { status: 400 });
  if (isPrivateURL(targetUrl)) return Response.json({ error: 'Private/internal URLs not allowed' }, { status: 403 });

  // Validate URL
  let parsed;
  try { parsed = new URL(targetUrl); } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const startMs = Date.now();
  let html = '';
  let statusCode = 0;
  let pageSize = 0;

  try {
    const resp = await fetch(targetUrl, {
      headers: { 'User-Agent': 'RoadSearch/4.0 (site-audit)' },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
    statusCode = resp.status;
    html = await resp.text();
    pageSize = new TextEncoder().encode(html).length;
  } catch (e) {
    return Response.json({ error: 'Failed to fetch page', detail: e.message }, { status: 502 });
  }

  const loadTime = Date.now() - startMs;
  const lower = html.toLowerCase();

  // Extract metrics
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
  const metaDesc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const allImgs = html.match(/<img[^>]*>/gi) || [];
  const totalImages = allImgs.length;
  const imgNoAlt = allImgs.filter(i => !i.match(/alt=["'][^"']+["']/i)).length;
  const internalLinks = (html.match(new RegExp(`href=["'][^"']*${parsed.hostname.replace(/\./g, '\\.')}[^"']*["']`, 'gi')) || []).length;
  const allLinks = (html.match(/href=["']https?:\/\/[^"']+["']/gi) || []).length;
  const externalLinks = allLinks - internalLinks;
  const wordCount = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(/\s+/).length;
  const hasViewport = lower.includes('viewport');
  const hasCharset = lower.includes('charset');
  const hasCanonical = lower.includes('rel="canonical"') || lower.includes("rel='canonical'");
  const hasOgTags = lower.includes('og:title') || lower.includes('og:description');
  const hasTwitterTags = lower.includes('twitter:card');
  const hasStructuredData = lower.includes('application/ld+json');

  // Calculate score
  const issues = [];
  let score = 100;

  if (!title) { score -= 15; issues.push('Missing <title> tag'); }
  else if (title.length > 60) { score -= 5; issues.push('Title too long (>60 chars)'); }
  else if (title.length < 10) { score -= 5; issues.push('Title too short (<10 chars)'); }

  if (!metaDesc) { score -= 10; issues.push('Missing meta description'); }
  else if (metaDesc.length > 160) { score -= 3; issues.push('Meta description too long (>160 chars)'); }

  if (h1Count === 0) { score -= 10; issues.push('No H1 tag found'); }
  else if (h1Count > 1) { score -= 5; issues.push(`Multiple H1 tags (${h1Count})`); }

  if (imgNoAlt > 0) { score -= Math.min(10, imgNoAlt * 2); issues.push(`${imgNoAlt} images missing alt text`); }
  if (!hasViewport) { score -= 10; issues.push('Missing viewport meta tag'); }
  if (!hasCanonical) { score -= 5; issues.push('Missing canonical URL'); }
  if (!hasOgTags) { score -= 5; issues.push('Missing Open Graph tags'); }
  if (!hasTwitterTags) { score -= 3; issues.push('Missing Twitter Card tags'); }
  if (!hasStructuredData) { score -= 3; issues.push('No structured data (JSON-LD)'); }
  if (!hasCharset) { score -= 3; issues.push('Missing charset declaration'); }
  if (pageSize > 500000) { score -= 5; issues.push(`Page too large (${Math.round(pageSize / 1024)}KB)`); }
  if (loadTime > 3000) { score -= 5; issues.push(`Slow load time (${loadTime}ms)`); }
  if (wordCount < 100) { score -= 5; issues.push('Low word count (thin content)'); }

  score = Math.max(0, score);

  // Save audit
  await env.DB.prepare(
    `INSERT INTO site_audits (url, domain, status_code, title, meta_description, h1_count, h2_count,
     img_no_alt, total_images, internal_links, external_links, word_count,
     has_viewport, has_charset, has_canonical, has_og_tags, has_twitter_tags,
     has_structured_data, page_size_bytes, load_time_ms, score, issues)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    targetUrl, parsed.hostname, statusCode, title, metaDesc, h1Count, h2Count,
    imgNoAlt, totalImages, internalLinks, externalLinks, wordCount,
    hasViewport ? 1 : 0, hasCharset ? 1 : 0, hasCanonical ? 1 : 0,
    hasOgTags ? 1 : 0, hasTwitterTags ? 1 : 0, hasStructuredData ? 1 : 0,
    pageSize, loadTime, score, JSON.stringify(issues)
  ).run();

  return Response.json({
    url: targetUrl,
    domain: parsed.hostname,
    status_code: statusCode,
    score,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
    load_time_ms: loadTime,
    page_size_bytes: pageSize,
    page_size_kb: Math.round(pageSize / 1024),
    seo: {
      title, title_length: title.length,
      meta_description: metaDesc, meta_description_length: metaDesc.length,
      h1_count: h1Count, h2_count: h2Count,
      has_canonical: !!hasCanonical, has_og_tags: !!hasOgTags,
      has_twitter_tags: !!hasTwitterTags, has_structured_data: !!hasStructuredData,
    },
    content: { word_count: wordCount, total_images: totalImages, images_missing_alt: imgNoAlt, internal_links: internalLinks, external_links: externalLinks },
    accessibility: { has_viewport: !!hasViewport, has_charset: !!hasCharset, images_missing_alt: imgNoAlt },
    issues,
    audited_at: new Date().toISOString(),
  });
}

// ─── 4. Snippet Extraction ──────────────────────────────────────────
async function handleExtract(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const reqUrl = new URL(request.url);
  const targetUrl = reqUrl.searchParams.get('url');

  if (!targetUrl) return Response.json({ error: 'url parameter required' }, { status: 400 });
  if (isPrivateURL(targetUrl)) return Response.json({ error: 'Private/internal URLs not allowed' }, { status: 403 });

  let parsed;
  try { parsed = new URL(targetUrl); } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let html = '';
  try {
    const resp = await fetch(targetUrl, {
      headers: { 'User-Agent': 'RoadSearch/4.0 (extractor)' },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
    if (!resp.ok) return Response.json({ error: `HTTP ${resp.status}` }, { status: 502 });
    html = await resp.text();
  } catch (e) {
    return Response.json({ error: 'Failed to fetch', detail: e.message }, { status: 502 });
  }

  // Title
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
  const ogTitle = (html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';

  // Author
  const author = (html.match(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || (html.match(/<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || '';

  // Published date
  const publishedDate = (html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || (html.match(/<time[^>]+datetime=["']([^"']*)["']/i) || [])[1]
    || (html.match(/<meta[^>]+name=["']date["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || '';

  // Description
  const description = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || (html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) || [])[1]
    || '';

  // Language
  const language = (html.match(/<html[^>]+lang=["']([^"']*)["']/i) || [])[1] || '';

  // Main content extraction — strip nav/header/footer/script/style, get article or main or body text
  let mainContent = '';
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const rawContent = articleMatch?.[1] || mainMatch?.[1] || bodyMatch?.[1] || html;
  mainContent = rawContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  // Images
  const images = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 20) {
    let src = imgMatch[1];
    if (src.startsWith('data:')) continue;
    if (!src.startsWith('http')) { try { src = new URL(src, targetUrl).href; } catch { continue; } }
    images.push({ src, alt: imgMatch[2] || '' });
  }

  // Links
  const links = [];
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null && links.length < 30) {
    links.push({ url: linkMatch[1], text: linkMatch[2].trim() });
  }

  const wordCount = mainContent.split(/\s+/).filter(Boolean).length;

  // Save extraction
  await env.DB.prepare(
    `INSERT INTO extracted_snippets (url, domain, title, author, published_date, main_content, description, language, images, links, word_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    targetUrl, parsed.hostname, ogTitle || title, author, publishedDate,
    mainContent, description, language, JSON.stringify(images), JSON.stringify(links), wordCount
  ).run();

  return Response.json({
    url: targetUrl,
    domain: parsed.hostname,
    title: ogTitle || title,
    author: author || null,
    published_date: publishedDate || null,
    description,
    language: language || null,
    main_content: mainContent,
    word_count: wordCount,
    images,
    links,
    extracted_at: new Date().toISOString(),
  });
}

// ─── 5. Search Comparison ───────────────────────────────────────────
async function handleCompareSearch(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const reqUrl = new URL(request.url);
  const q = reqUrl.searchParams.get('q')?.trim();

  if (!q || q.length < 2) return Response.json({ error: 'q parameter required (min 2 chars)' }, { status: 400 });

  const comparisonId = 'cmp-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const engines = [];
  const allResults = {};

  // Engine 1: RoadSearch FTS5
  try {
    const ftsQuery = q.replace(/[^\w\s\-\.]/g, '').split(/\s+/).filter(w => w.length >= 1).map(w => w + '*').join(' OR ');
    if (ftsQuery) {
      const res = await env.DB.prepare(
        `SELECT p.url, p.title, p.description, p.domain, rank as relevance
         FROM pages_fts f JOIN pages p ON p.id = f.rowid
         WHERE pages_fts MATCH ? ORDER BY rank LIMIT 10`
      ).bind(ftsQuery).all();
      allResults.roadsearch_fts = (res.results || []).map((r, i) => ({
        position: i + 1, url: r.url, title: r.title, snippet: (r.description || '').slice(0, 200), domain: r.domain,
      }));
      engines.push('roadsearch_fts');
    }
  } catch {}

  // Engine 2: RoadSearch LIKE fallback
  try {
    const likeQ = `%${q}%`;
    const res = await env.DB.prepare(
      `SELECT url, title, description, domain FROM pages
       WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
       LIMIT 10`
    ).bind(likeQ, likeQ, likeQ).all();
    allResults.roadsearch_like = (res.results || []).map((r, i) => ({
      position: i + 1, url: r.url, title: r.title, snippet: (r.description || '').slice(0, 200), domain: r.domain,
    }));
    engines.push('roadsearch_like');
  } catch {}

  // Engine 3: RoundTrip agent search
  try {
    const r = await fetch('https://roundtrip.blackroad.io/api/agents', { signal: AbortSignal.timeout(3000) });
    const data = await r.json();
    const agents = Array.isArray(data) ? data : data.agents || [];
    const ql = q.toLowerCase();
    const matches = agents.filter(a => {
      const name = (a.name || '').toLowerCase();
      const role = (a.role || a.type || '').toLowerCase();
      return name.includes(ql) || role.includes(ql);
    });
    allResults.roundtrip = matches.slice(0, 10).map((a, i) => ({
      position: i + 1, url: 'https://roundtrip.blackroad.io', title: `Agent: ${a.name}`,
      snippet: `${a.role || a.type || ''} — ${(a.persona || '').slice(0, 150)}`, domain: 'roundtrip.blackroad.io',
    }));
    engines.push('roundtrip');
  } catch {}

  // Engine 4: BackRoad social posts
  try {
    const r = await fetch(`https://backroad-social.amundsonalexa.workers.dev/api/posts?limit=20`, { signal: AbortSignal.timeout(3000) });
    const data = await r.json();
    const ql = q.toLowerCase();
    const matches = (data.posts || []).filter(p => (p.content || '').toLowerCase().includes(ql));
    allResults.backroad = matches.slice(0, 10).map((p, i) => ({
      position: i + 1, url: 'https://backroad-social.amundsonalexa.workers.dev',
      title: `@${p.handle}: ${(p.content || '').slice(0, 60)}`, snippet: (p.content || '').slice(0, 200), domain: 'backroad.social',
    }));
    engines.push('backroad');
  } catch {}

  // Calculate overlap — how many URLs appear in multiple engines
  const urlCounts = {};
  for (const engine of engines) {
    for (const r of (allResults[engine] || [])) {
      urlCounts[r.url] = (urlCounts[r.url] || 0) + 1;
    }
  }
  const overlapUrls = Object.entries(urlCounts).filter(([, c]) => c > 1);
  const overlapScore = engines.length > 1 ? overlapUrls.length / Math.max(Object.keys(urlCounts).length, 1) : 0;

  // Save comparison
  await env.DB.prepare(
    `INSERT INTO search_comparisons (comparison_id, query, engines, results, overlap_score)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(comparisonId, q, JSON.stringify(engines), JSON.stringify(allResults), overlapScore).run();

  return Response.json({
    comparison_id: comparisonId,
    query: q,
    engines,
    results: allResults,
    overlap: {
      score: Math.round(overlapScore * 100) / 100,
      shared_urls: overlapUrls.map(([url]) => url),
    },
    compared_at: new Date().toISOString(),
  });
}

// ─── 6. Page Archive ────────────────────────────────────────────────
async function handleArchive(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const reqUrl = new URL(request.url);

  if (request.method === 'POST') {
    const body = await request.json();
    const targetUrl = body.url;
    if (!targetUrl) return Response.json({ error: 'url required' }, { status: 400 });

    let parsed;
    try { parsed = new URL(targetUrl); } catch {
      return Response.json({ error: 'Invalid URL' }, { status: 400 });
    }

    let html = '', statusCode = 0, respHeaders = {};
    try {
      const resp = await fetch(targetUrl, {
        headers: { 'User-Agent': 'RoadSearch/4.0 (archiver)' },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      });
      statusCode = resp.status;
      html = await resp.text();
      resp.headers.forEach((v, k) => { respHeaders[k] = v; });
    } catch (e) {
      return Response.json({ error: 'Failed to fetch', detail: e.message }, { status: 502 });
    }

    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
    const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 10000);

    // Content hash for dedup
    const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(html));
    const contentHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Check if identical snapshot already exists
    const existing = await env.DB.prepare(
      'SELECT id FROM page_archives WHERE url = ? AND content_hash = ?'
    ).bind(targetUrl, contentHash).first();

    if (existing) {
      return Response.json({ ok: true, message: 'Identical snapshot already archived', archive_id: existing.id, content_hash: contentHash });
    }

    // Store snapshot (truncate HTML to 100KB to stay within D1 limits)
    const htmlSnapshot = html.slice(0, 100000);

    await env.DB.prepare(
      `INSERT INTO page_archives (url, domain, title, content_hash, html_snapshot, text_content, headers, status_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(targetUrl, parsed.hostname, title, contentHash, htmlSnapshot, textContent, JSON.stringify(respHeaders), statusCode).run();

    const archive = await env.DB.prepare('SELECT id, archived_at FROM page_archives ORDER BY id DESC LIMIT 1').first();

    return Response.json({
      ok: true,
      archive_id: archive?.id,
      url: targetUrl,
      domain: parsed.hostname,
      title,
      content_hash: contentHash,
      status_code: statusCode,
      snapshot_size: htmlSnapshot.length,
      archived_at: archive?.archived_at ? new Date(archive.archived_at * 1000).toISOString() : new Date().toISOString(),
    });
  }

  // GET — list archives or get specific archive
  const targetUrl = reqUrl.searchParams.get('url');
  const archiveId = reqUrl.searchParams.get('id');
  const domain = reqUrl.searchParams.get('domain');

  if (archiveId) {
    const archive = await env.DB.prepare('SELECT * FROM page_archives WHERE id = ?').bind(parseInt(archiveId)).first();
    if (!archive) return Response.json({ error: 'Archive not found' }, { status: 404 });
    return Response.json({
      archive: {
        ...archive,
        headers: JSON.parse(archive.headers || '{}'),
        archived_at: archive.archived_at ? new Date(archive.archived_at * 1000).toISOString() : null,
      }
    });
  }

  if (targetUrl) {
    const archives = await env.DB.prepare(
      'SELECT id, url, domain, title, content_hash, status_code, archived_at FROM page_archives WHERE url = ? ORDER BY archived_at DESC LIMIT 20'
    ).bind(targetUrl).all();
    return Response.json({
      url: targetUrl,
      versions: (archives.results || []).map(a => ({
        ...a, archived_at: a.archived_at ? new Date(a.archived_at * 1000).toISOString() : null,
      })),
      total: (archives.results || []).length,
    });
  }

  let sql = 'SELECT id, url, domain, title, content_hash, status_code, archived_at FROM page_archives';
  const params = [];
  if (domain) {
    sql += ' WHERE domain = ?';
    params.push(domain);
  }
  sql += ' ORDER BY archived_at DESC LIMIT 50';

  const archives = await env.DB.prepare(sql).bind(...params).all();
  return Response.json({
    archives: (archives.results || []).map(a => ({
      ...a, archived_at: a.archived_at ? new Date(a.archived_at * 1000).toISOString() : null,
    })),
    total: (archives.results || []).length,
  });
}

// ─── 7. Domain Intelligence ─────────────────────────────────────────
async function handleDomainIntel(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const reqUrl = new URL(request.url);
  const domain = reqUrl.searchParams.get('domain')?.trim();

  if (!domain) return Response.json({ error: 'domain parameter required' }, { status: 400 });

  // Check cache first
  const cached = await env.DB.prepare(
    'SELECT * FROM domain_intel WHERE domain = ? AND last_checked > unixepoch() - 86400'
  ).bind(domain).first();

  if (cached) {
    return Response.json({
      domain: cached.domain,
      ip_address: cached.ip_address,
      server: cached.server,
      tech_stack: JSON.parse(cached.tech_stack || '[]'),
      meta_generator: cached.meta_generator,
      has_ssl: !!cached.has_ssl,
      redirect_chain: JSON.parse(cached.redirect_chain || '[]'),
      headers: JSON.parse(cached.headers || '{}'),
      page_count: cached.page_count,
      related_domains: JSON.parse(cached.related_domains || '[]'),
      first_seen: cached.first_seen ? new Date(cached.first_seen * 1000).toISOString() : null,
      last_checked: cached.last_checked ? new Date(cached.last_checked * 1000).toISOString() : null,
      source: 'cache',
    });
  }

  // Fetch the domain
  const targetUrl = `https://${domain}`;
  let html = '', respHeaders = {}, statusCode = 0, serverHeader = '', ipAddress = '';
  const redirectChain = [];
  const techStack = [];

  try {
    const resp = await fetch(targetUrl, {
      headers: { 'User-Agent': 'RoadSearch/4.0 (domain-intel)' },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
    statusCode = resp.status;
    html = await resp.text();

    resp.headers.forEach((v, k) => {
      respHeaders[k] = v;
      const kl = k.toLowerCase();
      if (kl === 'server') serverHeader = v;
      if (kl === 'x-powered-by') techStack.push(v);
      if (kl === 'cf-ray') techStack.push('Cloudflare');
      if (kl === 'x-vercel-id') techStack.push('Vercel');
      if (kl === 'x-netlify-request-id') techStack.push('Netlify');
    });
  } catch (e) {
    // Try HTTP fallback
    try {
      const resp = await fetch(`http://${domain}`, {
        headers: { 'User-Agent': 'RoadSearch/4.0 (domain-intel)' },
        signal: AbortSignal.timeout(5000),
        redirect: 'follow',
      });
      statusCode = resp.status;
      html = await resp.text();
      resp.headers.forEach((v, k) => { respHeaders[k] = v; });
    } catch {
      return Response.json({ error: 'Domain unreachable', domain, detail: e.message }, { status: 502 });
    }
  }

  // Detect tech from HTML
  const lower = html.toLowerCase();
  if (lower.includes('wp-content') || lower.includes('wordpress')) techStack.push('WordPress');
  if (lower.includes('shopify')) techStack.push('Shopify');
  if (lower.includes('next.js') || lower.includes('__next')) techStack.push('Next.js');
  if (lower.includes('react')) techStack.push('React');
  if (lower.includes('vue') || lower.includes('__vue')) techStack.push('Vue.js');
  if (lower.includes('angular')) techStack.push('Angular');
  if (lower.includes('svelte')) techStack.push('Svelte');
  if (lower.includes('tailwindcss') || lower.includes('tailwind')) techStack.push('Tailwind CSS');
  if (lower.includes('bootstrap')) techStack.push('Bootstrap');
  if (lower.includes('jquery')) techStack.push('jQuery');
  if (lower.includes('gatsby')) techStack.push('Gatsby');
  if (lower.includes('remix')) techStack.push('Remix');
  if (lower.includes('astro')) techStack.push('Astro');
  if (lower.includes('wix.com')) techStack.push('Wix');
  if (lower.includes('squarespace')) techStack.push('Squarespace');

  const metaGenerator = (html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
  if (metaGenerator) techStack.push(metaGenerator);

  const hasSsl = statusCode > 0 && targetUrl.startsWith('https');

  // Related domains — find links to other domains
  const relatedSet = new Set();
  const hrefRegex = /href=["']https?:\/\/([^/"']+)/gi;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(html)) !== null) {
    const linked = hrefMatch[1].toLowerCase();
    if (linked !== domain && !linked.includes(domain)) {
      relatedSet.add(linked);
    }
  }
  const relatedDomains = [...relatedSet].slice(0, 20);

  // Count pages we already have indexed for this domain
  const pageCount = (await env.DB.prepare('SELECT COUNT(*) as c FROM pages WHERE domain = ?').bind(domain).first())?.c || 0;

  // Deduplicate tech stack
  const uniqueTech = [...new Set(techStack)];

  // Upsert
  await env.DB.prepare(
    `INSERT INTO domain_intel (domain, ip_address, server, tech_stack, meta_generator, has_ssl, redirect_chain, headers, page_count, related_domains)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(domain) DO UPDATE SET
       server=excluded.server, tech_stack=excluded.tech_stack, meta_generator=excluded.meta_generator,
       has_ssl=excluded.has_ssl, headers=excluded.headers, page_count=excluded.page_count,
       related_domains=excluded.related_domains, last_checked=unixepoch()`
  ).bind(
    domain, ipAddress, serverHeader, JSON.stringify(uniqueTech), metaGenerator,
    hasSsl ? 1 : 0, JSON.stringify(redirectChain), JSON.stringify(respHeaders),
    pageCount, JSON.stringify(relatedDomains)
  ).run();

  return Response.json({
    domain,
    ip_address: ipAddress || null,
    server: serverHeader || null,
    tech_stack: uniqueTech,
    meta_generator: metaGenerator || null,
    has_ssl: hasSsl,
    status_code: statusCode,
    headers: respHeaders,
    page_count: pageCount,
    related_domains: relatedDomains,
    last_checked: new Date().toISOString(),
    source: 'live',
  });
}

// ─── 8. Search Sharing ──────────────────────────────────────────────
async function handleShareSearch(request, env) {
  if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
  const reqUrl = new URL(request.url);

  if (request.method === 'POST') {
    const body = await request.json();
    const { query, results, annotations, title, description, user_id, expires_in } = body;
    if (!query) return Response.json({ error: 'query required' }, { status: 400 });

    const shareId = 'share-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const expiresAt = expires_in ? Math.floor(Date.now() / 1000) + parseInt(expires_in) : null;

    await env.DB.prepare(
      `INSERT INTO shared_searches (share_id, query, results, annotations, title, description, user_id, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      shareId, query,
      JSON.stringify(results || []),
      JSON.stringify(annotations || {}),
      title || `Search: ${query}`,
      description || '',
      user_id || 'anon',
      expiresAt
    ).run();

    return Response.json({
      ok: true,
      share_id: shareId,
      share_url: `https://search.blackroad.io/api/share-search?id=${shareId}`,
      expires_at: expiresAt ? new Date(expiresAt * 1000).toISOString() : null,
    });
  }

  if (request.method === 'PUT') {
    const body = await request.json();
    const { share_id, annotations, title, description } = body;
    if (!share_id) return Response.json({ error: 'share_id required' }, { status: 400 });

    if (annotations !== undefined) {
      await env.DB.prepare('UPDATE shared_searches SET annotations = ? WHERE share_id = ?').bind(JSON.stringify(annotations), share_id).run();
    }
    if (title !== undefined) {
      await env.DB.prepare('UPDATE shared_searches SET title = ? WHERE share_id = ?').bind(title, share_id).run();
    }
    if (description !== undefined) {
      await env.DB.prepare('UPDATE shared_searches SET description = ? WHERE share_id = ?').bind(description, share_id).run();
    }
    return Response.json({ ok: true, updated: share_id });
  }

  if (request.method === 'DELETE') {
    const shareId = reqUrl.searchParams.get('id');
    if (!shareId) return Response.json({ error: 'id required' }, { status: 400 });
    await env.DB.prepare('DELETE FROM shared_searches WHERE share_id = ?').bind(shareId).run();
    return Response.json({ ok: true, deleted: shareId });
  }

  // GET — retrieve shared search
  const shareId = reqUrl.searchParams.get('id');
  const userId = reqUrl.searchParams.get('user_id');

  if (shareId) {
    const shared = await env.DB.prepare('SELECT * FROM shared_searches WHERE share_id = ?').bind(shareId).first();
    if (!shared) return Response.json({ error: 'Shared search not found' }, { status: 404 });

    // Check expiry
    if (shared.expires_at && shared.expires_at < Math.floor(Date.now() / 1000)) {
      return Response.json({ error: 'This shared search has expired' }, { status: 410 });
    }

    // Increment view count
    await env.DB.prepare('UPDATE shared_searches SET view_count = view_count + 1 WHERE share_id = ?').bind(shareId).run();

    return Response.json({
      share_id: shared.share_id,
      query: shared.query,
      title: shared.title,
      description: shared.description,
      results: JSON.parse(shared.results || '[]'),
      annotations: JSON.parse(shared.annotations || '{}'),
      user_id: shared.user_id,
      view_count: (shared.view_count || 0) + 1,
      created_at: shared.created_at ? new Date(shared.created_at * 1000).toISOString() : null,
      expires_at: shared.expires_at ? new Date(shared.expires_at * 1000).toISOString() : null,
    });
  }

  // List user's shared searches
  if (userId) {
    const shares = await env.DB.prepare(
      'SELECT share_id, query, title, description, view_count, created_at, expires_at FROM shared_searches WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(userId).all();
    return Response.json({
      shared_searches: (shares.results || []).map(s => ({
        ...s,
        share_url: `https://search.blackroad.io/api/share-search?id=${s.share_id}`,
        created_at: s.created_at ? new Date(s.created_at * 1000).toISOString() : null,
        expires_at: s.expires_at ? new Date(s.expires_at * 1000).toISOString() : null,
      })),
    });
  }

  // List recent public shares
  const shares = await env.DB.prepare(
    `SELECT share_id, query, title, description, view_count, created_at FROM shared_searches
     WHERE (expires_at IS NULL OR expires_at > unixepoch())
     ORDER BY view_count DESC LIMIT 20`
  ).all();
  return Response.json({
    popular_shares: (shares.results || []).map(s => ({
      ...s,
      share_url: `https://search.blackroad.io/api/share-search?id=${s.share_id}`,
      created_at: s.created_at ? new Date(s.created_at * 1000).toISOString() : null,
    })),
  });
}

let dbV4Ready = false;
let dbEnhancedReady = false;

// ─── Router ───────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const headers = { ...cors(origin), ...SECURITY_HEADERS };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // SEO
    if (url.pathname === '/robots.txt')
      return new Response('User-agent: *\nAllow: /\nSitemap: https://search.blackroad.io/sitemap.xml', {headers:{'Content-Type':'text/plain'}});
    if (url.pathname === '/sitemap.xml') {
      const d = new Date().toISOString().split('T')[0];
      return new Response(`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://search.blackroad.io/</loc><lastmod>${d}</lastmod><priority>1.0</priority></url></urlset>`, {headers:{'Content-Type':'application/xml'}});
    }

    let response;
    try {
      switch (true) {
        case url.pathname === '/health':
          response = Response.json({
            status: 'ok', engine: 'RoadSearch', version: '3.0.0',
            time: new Date().toISOString(),
            features: ['fts5', 'ai-answers', 'smart-summary', 'autocomplete', 'analytics', 'pagination', 'verified-facts', 'fact-check', 'truth-dashboard', 'advanced-operators', 'saved-searches', 'search-history', 'image-search', 'knowledge-panels', 'click-tracking', 'zero-result-tracking'],
          });
          break;

        case url.pathname === '/init':
          const seeded = await initDB(env.DB);
          response = Response.json({ ok: true, seeded });
          break;

        case url.pathname === '/rebuild':
          response = await handleRebuild(env);
          break;

        case url.pathname === '/search' || url.pathname === '/api/search':
          response = await handleSearch(request, env);
          break;

        case url.pathname === '/suggest' || url.pathname === '/api/suggest':
          response = await handleSuggest(request, env);
          break;

        case url.pathname === '/stats':
          response = await handleStats(env);
          break;

        case url.pathname === '/facts' || url.pathname === '/api/facts':
          response = await handleFacts(env);
          break;

        case url.pathname === '/verify' || url.pathname === '/api/verify':
          response = await handleVerify(env);
          break;

        case url.pathname === '/fact-check' || url.pathname === '/api/fact-check':
          response = await handleFactCheck(request, env);
          break;

        case url.pathname === '/chain' || url.pathname === '/api/chain':
          response = await handleChain(env);
          break;

        case url.pathname === '/crawl-images':
          response = await handleCrawlImages(env);
          break;

        case url.pathname === '/lucky':
          return await handleLucky(request, env);

        case request.method === 'POST' && (url.pathname === '/api/click' || url.pathname === '/click'):
          try {
            const clickBody = await request.json();
            await env.DB.prepare('UPDATE pages SET clicks = COALESCE(clicks, 0) + 1 WHERE id = ?').bind(clickBody.page_id).run().catch(() => {});
          } catch {}
          response = Response.json({ ok: true });
          break;

        case request.method === 'POST' && url.pathname === '/index':
          response = await handleIndex(request, env);
          break;

        case url.pathname === '/trending' || url.pathname === '/api/trending': {
          try {
            await env.DB.prepare(`CREATE TABLE IF NOT EXISTS search_log (
              id INTEGER PRIMARY KEY AUTOINCREMENT, query TEXT, ip TEXT, ts TEXT DEFAULT (datetime('now'))
            )`).run();
            const rows = await env.DB.prepare(
              `SELECT query, COUNT(*) as count FROM search_log
               WHERE ts > datetime('now', '-24 hours') GROUP BY query ORDER BY count DESC LIMIT 20`
            ).all();
            response = Response.json({ trending: (rows.results || []), period: '24h' });
          } catch { response = Response.json({ trending: [] }); }
          break;
        }

        case url.pathname === '/api/search-history': {
          try {
            await env.DB.prepare(`CREATE TABLE IF NOT EXISTS search_log (
              id INTEGER PRIMARY KEY AUTOINCREMENT, query TEXT, ip TEXT, ts TEXT DEFAULT (datetime('now'))
            )`).run();
            const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
            const rows = await env.DB.prepare(
              'SELECT query, ts FROM search_log ORDER BY ts DESC LIMIT ?'
            ).bind(limit).all();
            response = Response.json({ searches: rows.results || [] });
          } catch { response = Response.json({ searches: [] }); }
          break;
        }

        case url.pathname === '/api/categories': {
          try {
            const rows = await env.DB.prepare(
              `SELECT category, COUNT(*) as count FROM pages WHERE category IS NOT NULL
               GROUP BY category ORDER BY count DESC`
            ).all();
            response = Response.json({ categories: rows.results || [] });
          } catch { response = Response.json({ categories: [] }); }
          break;
        }

        case url.pathname === '/api/domains': {
          try {
            const rows = await env.DB.prepare(
              `SELECT domain, COUNT(*) as pages, SUM(COALESCE(clicks, 0)) as total_clicks
               FROM pages GROUP BY domain ORDER BY pages DESC`
            ).all();
            response = Response.json({ domains: rows.results || [] });
          } catch { response = Response.json({ domains: [] }); }
          break;
        }

        case url.pathname === '/api/popular': {
          try {
            const rows = await env.DB.prepare(
              `SELECT id, title, url, description, clicks FROM pages
               WHERE clicks > 0 ORDER BY clicks DESC LIMIT 20`
            ).all();
            response = Response.json({ popular: rows.results || [] });
          } catch { response = Response.json({ popular: [] }); }
          break;
        }

        // ─── NEW FEATURE ROUTES ────────────────────────────────────

        // Initialize enhanced tables
        case url.pathname === '/init-enhanced': {
          if (!dbEnhancedReady) { await initEnhancedTables(env.DB); dbEnhancedReady = true; }
          response = Response.json({ ok: true, enhanced_tables_initialized: true });
          break;
        }

        // Autocomplete — prefix-based suggestions
        case url.pathname === '/api/autocomplete': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleAutocomplete(request, env);
          break;
        }

        // Advanced search with operators (site:, filetype:, -exclude, "exact")
        case url.pathname === '/api/search/advanced': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleAdvancedSearch(request, env);
          break;
        }

        // Saved searches — save, list, delete
        case url.pathname === '/api/saved-searches': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleSavedSearches(request, env);
          break;
        }

        // Search history — user history + trending + clear
        case url.pathname === '/api/history': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleHistory(request, env);
          break;
        }

        // Image search
        case url.pathname === '/api/search/images': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleImageSearch(request, env);
          break;
        }

        // Search analytics — top searches, CTR, zero-result queries
        case url.pathname === '/api/search/analytics': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleSearchAnalytics(request, env);
          break;
        }

        // Knowledge panels — get/create entity panels
        case url.pathname === '/api/knowledge': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleKnowledgePanel(request, env);
          break;
        }

        // Enhanced click tracking with position
        case request.method === 'POST' && url.pathname === '/api/click/track': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleClickTracking(request, env);
          break;
        }

        // Crawl pages for image index
        case url.pathname === '/api/crawl-images-index': {
          if (!dbEnhancedReady) { try { await initEnhancedTables(env.DB); dbEnhancedReady = true; } catch {} }
          response = await handleCrawlImageIndex(env);
          break;
        }

        // ─── V4 FEATURE ROUTES ─────────────────────────────────────

        // Search Collections — curate results into named collections
        case url.pathname === '/api/collections': {
          response = await handleCollections(request, env);
          break;
        }

        // Web Alerts — monitor topics for new content
        case url.pathname === '/api/alerts': {
          response = await handleAlerts(request, env);
          break;
        }

        // Site Audit — SEO, accessibility, performance analysis
        case url.pathname === '/api/audit': {
          response = await handleSiteAudit(request, env);
          break;
        }

        // Snippet Extraction — extract structured data from any page
        case url.pathname === '/api/extract': {
          response = await handleExtract(request, env);
          break;
        }

        // Search Comparison — compare results from multiple engines
        case url.pathname === '/api/compare-search': {
          response = await handleCompareSearch(request, env);
          break;
        }

        // Page Archive — save/view historical page snapshots
        case url.pathname === '/api/archive': {
          response = await handleArchive(request, env);
          break;
        }

        // Domain Intelligence — tech stack, hosting, related domains
        case url.pathname === '/api/domain-intel': {
          response = await handleDomainIntel(request, env);
          break;
        }

        // Search Sharing — shareable annotated search results
        case url.pathname === '/api/share-search': {
          response = await handleShareSearch(request, env);
          break;
        }

        // Initialize v4 tables
        case url.pathname === '/init-v4': {
          if (!dbV4Ready) { await initV4Tables(env.DB); dbV4Ready = true; }
          response = Response.json({ ok: true, v4_tables_initialized: true });
          break;
        }

        default: {
          const accept = request.headers.get('Accept') || '';
          if (accept.includes('application/json') && !accept.includes('text/html')) {
            response = Response.json({
              engine: 'RoadSearch',
              version: '3.0.0',
              endpoints: {
                search: 'GET /search?q=query&category=&domain=&page=1&limit=10&ai=true',
                'search/advanced': 'GET /api/search/advanced?q=query (supports site:, filetype:, -exclude, "exact phrase", after:, before:, type:, verified:true)',
                'search/images': 'GET /api/search/images?q=query&domain=&page=1&limit=20',
                'search/analytics': 'GET /api/search/analytics?period=7d (top searches, CTR, zero-result queries)',
                autocomplete: 'GET /api/autocomplete?q=prefix&limit=8',
                suggest: 'GET /suggest?q=prefix',
                'saved-searches': 'GET|POST|DELETE /api/saved-searches?user_id=&id= (save queries with alerts)',
                history: 'GET|DELETE /api/history?user_id=&session_id=&period=7d',
                knowledge: 'GET|POST /api/knowledge?entity=&type= (knowledge panels for entities)',
                'click/track': 'POST /api/click/track (enhanced click tracking with position)',
                lucky: 'GET /lucky?q=query (redirects to top result)',
                stats: 'GET /stats',
                facts: 'GET /facts — all verified facts + false claims + trust score',
                verify: 'GET /verify — re-check facts against live sources',
                'fact-check': 'GET /fact-check?claim=text — check a specific claim',
                chain: 'GET /chain — RoadChain immutable audit trail of all verifications',
                'crawl-images': 'GET /crawl-images — crawl og:image from indexed pages',
                'crawl-images-index': 'GET /api/crawl-images-index — crawl all images for image search index',
                collections: 'GET|POST|PUT|DELETE /api/collections?slug=&user_id= (curate search results into named collections)',
                alerts: 'GET|POST|PUT|DELETE /api/alerts?user_id=&check=true (monitor topics, get notified on new matches)',
                audit: 'GET /api/audit?url= (SEO audit: broken links, accessibility, performance score)',
                extract: 'GET /api/extract?url= (extract structured data: title, author, date, content, images)',
                'compare-search': 'GET /api/compare-search?q= (compare results across multiple search engines)',
                archive: 'GET|POST /api/archive?url=&id=&domain= (save/view historical page snapshots)',
                'domain-intel': 'GET /api/domain-intel?domain= (tech stack, hosting, SSL, related domains)',
                'share-search': 'GET|POST|PUT|DELETE /api/share-search?id=&user_id= (shareable annotated search pages)',
                index: 'POST /index (auth required)',
                health: 'GET /health',
                init: 'GET /init (seed database)',
                'init-enhanced': 'GET /init-enhanced (create enhanced feature tables)',
                'init-v4': 'GET /init-v4 (create v4 feature tables)',
                rebuild: 'GET /rebuild (rebuild FTS index)',
              },
              tagline: 'Search the Road. Verify the Truth.',
            });
          } else {
            response = new Response(SEARCH_HTML, {
              headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Content-Security-Policy': "frame-ancestors 'self' https://blackroad.io https://*.blackroad.io" },
            });
          }
        }
      }
    } catch (err) {
      console.error('RoadSearch error:', err);
      response = Response.json({ error: err.message }, { status: 500 });
    }

    const h = new Headers(response.headers);
    for (const [k, v] of Object.entries(headers)) h.set(k, v);
    return new Response(response.body, { status: response.status, headers: h });
  },
};
