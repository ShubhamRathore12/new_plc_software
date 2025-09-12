This is a [Next.js](https://nextjs.org) project.

## AI Chat

We added a fast, streaming AI chat at `/chat`. Type in any language; the assistant auto-detects your language and responds in the same language.

### Setup

Set one of the following API keys in your environment (prefer OpenRouter if available):

```bash
# .env.local
OPENROUTER_API_KEY=your_openrouter_key   # uses `openai/gpt-4o-mini` by default
# or
OPENAI_API_KEY=your_openai_key           # uses `gpt-4o-mini` by default

# Optional (recommended for OpenRouter)
APP_URL=http://localhost:3000
```

### Run

```bash
npm run dev
# open http://localhost:3000/chat
```

### Notes

- Responses are streamed for low latency.
- Provider auto-selects based on which key is set.
- Keep responses concise by default; ask for detail when needed.

## Getting Started

Open [http://localhost:3000](http://localhost:3000) to see the app. Edit pages under `src/app`.
