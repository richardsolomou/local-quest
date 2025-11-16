# local-quest.ras.sh

🗺️ Local-first AI text adventures using your browser's built-in AI. Infinite worlds generated and played entirely on your device.

## Overview

A privacy-first text adventure game powered by Chrome's built-in Prompt API (Gemini Nano). Generate unique worlds, explore infinite possibilities, and make choices that shape your adventure - all running locally in your browser.

**Supported browsers:**
- Chrome 128+ (with Prompt API enabled)
- Edge 128+ (with Prompt API enabled)

## Features

- **100% Local** - All AI inference runs directly in your browser using Chrome's built-in Prompt API
- **Complete Privacy** - Zero external API calls, no data collection
- **Infinite Worlds** - Generate unique text adventure worlds from seed prompts or custom descriptions
- **Text Adventure Design** - Immersive monospace terminal-style interface
- **Streaming Responses** - Real-time AI responses as they generate
- **World Generation** - AI creates rich worlds with settings, characters, items, and goals
- **Dynamic Storytelling** - Every choice matters in procedurally generated adventures

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework with Vite
- [AI SDK](https://ai-sdk.dev/) - Streaming, message handling, and structured outputs
- [@built-in-ai/core](https://github.com/jakobhoeg/built-in-ai) - Chrome Prompt API integration for AI SDK
- [React 19](https://react.dev/) - Latest React with modern features
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first styling
- [Zustand](https://zustand.docs.pmnd.rs/) - Lightweight state management
- [Streamdown](https://github.com/jakobhoeg/streamdown) - Streaming markdown rendering

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open http://localhost:3000 in Chrome 128+ with Prompt API enabled.

## How It Works

This app uses Chrome's built-in Prompt API to run the Gemini Nano language model entirely in your browser. On first use, the model will be downloaded and cached locally.

1. **World Selection** - Choose from preset adventure seeds or create your own custom world description
2. **World Generation** - AI generates a complete world with setting, characters, items, and goals using structured outputs
3. **Adventure Begins** - Start your adventure with an AI-generated opening scene
4. **Interactive Storytelling** - Make choices and explore the world through text-based commands

All processing happens on your device using Chrome's optimized inference engine. No data is sent to external servers.

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx              # Root layout with providers
│   ├── index.tsx               # Home page
│   ├── world-selection.tsx     # World selection interface
│   └── chat.tsx                # Adventure gameplay interface
├── components/
│   ├── ai-elements/            # AI-specific components
│   │   ├── conversation.tsx    # Conversation container with auto-scroll
│   │   ├── prompt-input.tsx    # Text input component
│   │   └── response.tsx        # AI response with markdown rendering
│   ├── ui/                     # UI components
│   │   ├── button.tsx          # Button variants
│   │   ├── dialog.tsx          # Dialog/modal
│   │   ├── textarea.tsx        # Textarea input
│   │   └── ...                 # Other UI primitives
│   ├── chat-input.tsx          # Adventure command input
│   ├── chat-messages.tsx       # Message list display
│   ├── footer.tsx              # App footer
│   ├── model-download-banner.tsx  # Download progress banner
│   └── browser-unsupported-dialog.tsx  # Browser check dialog
├── lib/
│   ├── client-side-chat-transport.ts  # Prompt API transport for AI SDK
│   ├── generate-world.ts       # World generation with structured outputs
│   ├── generate-initial-message.ts  # Opening scene generation
│   ├── utils.ts                # Utility functions (cn, etc)
│   └── seo.ts                  # SEO metadata
├── stores/
│   └── world-store.ts          # Zustand store for world data and state
└── hooks/
    └── use-browser-ai-support.ts  # Check Prompt API availability
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check-types` | TypeScript type checking |
| `pnpm check` | Lint code with Ultracite (Biome wrapper) |
| `pnpm fix` | Auto-fix linting issues (with --unsafe flag) |

## Browser Requirements

This app requires Chrome's built-in Prompt API:

- **Chrome 128+** - With Prompt API enabled (chrome://flags/#prompt-api-for-gemini-nano-multimodal-input)
- **Edge 128+** - With Prompt API enabled (edge://flags/#prompt-api-for-gemini-nano-multimodal-input)

If your browser doesn't support the Prompt API, you'll see a warning dialog. The app checks for support using the `doesBrowserSupportBuiltInAI()` function from `@built-in-ai/core`.

To enable the Prompt API:
1. Open chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
2. Set to "Enabled"
3. Restart Chrome

## Privacy & Data

- **No external servers** - All processing happens in your browser
- **No data collection** - Your adventures are never logged or sent anywhere
- **No persistence** - World data and conversations are kept in memory only (refresh to clear)
- **Local model caching** - Downloaded models are cached by the browser

## Key Implementation Details

### World Generation
The app uses structured outputs (`streamObject()`) to generate complete world data including:
- Title and description
- Setting and starting location
- Initial situation
- Tone and genre
- Characters, items, and goals

### Adventure Gameplay
- Text-based command interface with `>` prompt prefix
- Streaming AI responses for immersive storytelling
- Auto-scrolling conversation view
- Monospace terminal-style design

### State Management
- **Zustand store** (`src/stores/world-store.ts`) - Manages world data, seed prompts, and initial messages
- **AI SDK useChat** - Handles message state, streaming, and lifecycle

### UI Design
- **Text adventure aesthetic** - Monospace fonts, `>` prefixes, zinc color scheme
- **Consistent styling** - All pages follow the same text adventure design pattern
- **Responsive layout** - Works on desktop and mobile devices

## License

MIT License - see [LICENSE](LICENSE) for details.
