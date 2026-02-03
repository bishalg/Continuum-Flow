# Context-Snoopiest

**AI-Driven Narrative to Video Architecture**

![Build Status](https://github.com/bishalg/Context-Snoopiest/actions/workflows/deploy.yml/badge.svg)
[![Documentation](https://img.shields.io/badge/docs-Context--Snoopiest-blue)](https://bishalg.github.io/Context-Snoopiest/)

Context-Snoopiest is an advanced architecture designed to maintain context and character consistency in AI-generated video narratives. By leveraging intelligent chunking strategies, context management engines, and agentic workflows, it solves the "amnesia" problem often found in long-form generative video content.

---

## 📚 Documentation

The full documentation is available at: **[https://bishalg.github.io/Context-Snoopiest/](https://bishalg.github.io/Context-Snoopiest/)**

---

## 🏗️ Architecture Overview

The system is broken down into several core components documented in detail:

### Core Engine

- **[Chunking Strategy](https://bishalg.github.io/Context-Snoopiest/chunking)**: How narratives are broken down into manageable, consistency-preserving segments.
- **[Context Engine](https://bishalg.github.io/Context-Snoopiest/context-management)**: The brain of the system that manages state, memory, and narrative flow across chunks.
- **[Character Consistency](https://bishalg.github.io/Context-Snoopiest/character-consistency)**: Techniques and pipelines ensuring visual and behavioral fidelity of characters throughout the video.

### Implementation

- **[Workflows](https://bishalg.github.io/Context-Snoopiest/workflows)**: Detailed workflows for the generation pipeline.
- **[Agentic Workflow](https://bishalg.github.io/Context-Snoopiest/agentic-workflow)**: How AI agents collaborate to execute the generation tasks.
- **[Roadmap](https://bishalg.github.io/Context-Snoopiest/roadmap)**: Future development plans and features.

### Technology

- **[Tech Stack](https://bishalg.github.io/Context-Snoopiest/tech-stack)**: Frameworks, libraries, and tools used.

---

## 📖 Core Documentation

Detailed breakdown of the primary documentation modules:

- **[Context Rot](https://bishalg.github.io/Context-Snoopiest/context-rot)**: Explores why massive context leads to reasoning failure and how we maintain "Haystack" density to prevent logical decay.
- **[System Architecture](https://bishalg.github.io/Context-Snoopiest/architecture)**: Multi-layered framework that separates static world-building from dynamic state tracking to minimize AI hallucinations.
- **[Chunking Strategy](https://bishalg.github.io/Context-Snoopiest/chunking)**: Proprietary algorithm that aligns textual pacing with 8-second cinematic constraints using weighted token analysis.
- **[Narrative Compression](https://bishalg.github.io/Context-Snoopiest/narrative-compression)**: Hierarchical recursive summarization techniques that transform raw text into a stateful, "living backbone."
- **[Context Engine](https://bishalg.github.io/Context-Snoopiest/context-management)**: The system's "brain" responsible for state maintenance, memory, and narrative flow across novel-length content.
- **[Character Consistency](https://bishalg.github.io/Context-Snoopiest/character-consistency)**: Visual identity locking and behavioral fidelity pipelines that prevent character drift during the video generation process.
- **[Differential State Specification](https://bishalg.github.io/Context-Snoopiest/differential-state-management)**: Advanced management of state changes between scenes to ensure physical and emotional continuity.
- **[Orchestrator Architecture](https://bishalg.github.io/Context-Snoopiest/orchestrator-architecture)**: Technical deep dive into the multi-agent hierarchy that coordinates the end-to-end cinematic generation pipeline.
- **[Agentic Workflow](https://bishalg.github.io/Context-Snoopiest/agentic-workflow)**: Detailed guide on how specialized AI agents collaborate autonomously to execute complex narrative adaptation tasks.
- **[Roadmap](https://bishalg.github.io/Context-Snoopiest/roadmap)**: Strategic vision for the project's evolution, focusing on real-time state tracking and expanded support for non-linear narratives.

---

## 🛠️ Tech Stack

This project is built with modern web technologies:

- **Runtime**: [Bun](https://bun.sh) v1.2.10 - Fast all-in-one JavaScript runtime
- **Framework**: [Astro](https://astro.build) v5.1.0 - Static site generator with partial hydration
- **UI Library**: [React](https://react.dev) v18.2.0 - Component-based UI
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v3.4.1 - Utility-first CSS framework
- **Content**: [MDX](https://mdxjs.com) - Markdown with JSX components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **Charts**: [Chart.js](https://www.chartjs.org/) - Data visualization
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful & consistent icons
- **PDF Generation**: [Puppeteer](https://pptr.dev) + [pdf-lib](https://pdf-lib.js.org/) - Automated PDF export

---

## 📁 Project Structure

```
Context-Snoopiest/
├── src/
│   ├── components/        # Reusable UI components (34 components)
│   ├── layouts/           # Page layout templates
│   ├── pages/             # Astro pages (routes)
│   ├── styles/            # Global styles and Tailwind config
│   ├── data/              # Static data and content
│   ├── config.ts          # Site configuration and sidebar navigation
│   └── design.config.ts   # Design system tokens and theme
├── scripts/
│   ├── generate-pdf.ts    # PDF generation script (Puppeteer-based)
│   └── print-styles.ts    # Print-specific CSS and HTML templates
├── public/                # Static assets (images, fonts, etc.)
├── docs/                  # Additional documentation
└── dist/                  # Build output (generated)
```

### Key Files

- **`src/config.ts`**: Defines site metadata and sidebar navigation structure
- **`src/design.config.ts`**: Design system configuration (colors, typography, spacing)
- **`scripts/generate-pdf.ts`**: Automated whitepaper PDF generation from documentation pages
- **`astro.config.mjs`**: Astro framework configuration
- **`tailwind.config.cjs`**: Tailwind CSS customization

---

## 🚀 Getting Started

### Prerequisites

- **Bun** v1.2.10 or higher ([Install Bun](https://bun.sh/docs/installation))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bishalg/Context-Snoopiest.git
   cd Context-Snoopiest
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

### Development

Start the development server with hot-reload:

```bash
bun run dev
```

The site will be available at `http://localhost:4321/Context-Snoopiest/`

### Build

Generate a production-ready static build:

```bash
bun run build
```

Output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
bun run preview
```

### PDF Generation

Generate a comprehensive whitepaper PDF from all documentation pages:

```bash
bun run pdf
```

This script:

- Automatically starts a preview server if not running
- Crawls all pages defined in `src/config.ts` sidebar
- Generates a professional PDF with:
  - Cover page with project title and description
  - Table of contents with page numbers
  - Section headers for each documentation category
  - All content pages with proper styling
  - Page numbering (excluding cover and TOC)
- Outputs to `public/whitepaper.pdf`
- Preserves individual chapter PDFs in `public/chapters/` for debugging

**Technical Details:**

- Uses Puppeteer for headless browser rendering
- Applies custom print styles from `scripts/print-styles.ts`
- Forces light mode for print-friendly output
- Merges PDFs using `pdf-lib` for professional formatting

---

## 🎨 Design System

The project uses a comprehensive design system defined in `src/design.config.ts`:

- **Color Palette**: Carefully curated colors for dark/light themes
- **Typography**: Responsive font scales and font families
- **Spacing**: Consistent spacing system
- **Components**: Reusable component styles

All design tokens are integrated with Tailwind CSS for seamless development.

---

## 📦 Deployment

The project is automatically deployed to GitHub Pages via GitHub Actions on every push to the main branch.

**Deployment Workflow:**

1. Build the Astro site (`bun run build`)
2. Deploy `dist/` to GitHub Pages
3. Available at: [https://bishalg.github.io/Context-Snoopiest/](https://bishalg.github.io/Context-Snoopiest/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

Open Source.
