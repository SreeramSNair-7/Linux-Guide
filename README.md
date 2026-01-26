# Linux Distro Catalog

A production-ready Next.js application for cataloging, comparing, and discovering Linux distributions with AI-powered recommendations.

## Features

- 🔍 **Advanced Search**: Filter by family, desktop environment, and requirements with MeiliSearch
- 🛡️ **Verified Checksums**: SHA256 verification for all ISO downloads with platform-specific commands
- 🤖 **AI Assistant**: Local Ollama-powered recommendations and installation help
- ⚖️ **Compare Tool**: Side-by-side comparison of up to 4 distributions
- 📱 **PWA Ready**: Installable progressive web app
- 🌙 **Dark Mode**: Full theme support
- ♿ **Accessible**: WCAG AA compliant
- 🚀 **Performance**: SSG/ISR with Next.js App Router
- 🔒 **Privacy-First**: No PII sent to AI, optional analytics with opt-out

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite (dev) / PostgreSQL (production via Supabase)
- **Search**: MeiliSearch
- **AI**: Ollama (local inference with mistral-small-3)
- **Testing**: Vitest (unit), Playwright (E2E)
- **CI/CD**: GitHub Actions + Vercel

## Prerequisites

- Node.js 18+ and npm 9+
- Ollama installed locally ([https://ollama.ai](https://ollama.ai))
- MeiliSearch (optional, for search functionality)

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd linux-distro-catalog
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string (or `file:./dev.db` for SQLite)
- `OLLAMA_BASE_URL`: Ollama API endpoint (default: `http://localhost:11434`)
- `OLLAMA_MODEL`: Model name (default: `mistral-small-3`)
- `MEILISEARCH_HOST`: MeiliSearch endpoint
- `MEILISEARCH_API_KEY`: MeiliSearch master key

### 3. Start Ollama

```bash
# Pull the model
ollama pull mistral-small-3

# Start Ollama (runs on http://localhost:11434 by default)
ollama serve
```

### 4. Start MeiliSearch (Optional)

```bash
# Using Docker
docker run -d -p 7700:7700 getmeili/meilisearch:latest

# Or download binary from https://www.meilisearch.com/
```

### 5. Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

## Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

### Data Management
```bash
npm run ingest               # Verify and ingest distro data
npm run ingest:verify        # Verify data integrity only
npm run search:index         # Index distros in MeiliSearch
```

### Testing
```bash
npm run test                 # Run unit tests
npm run test:e2e             # Run E2E tests
npm run test:e2e:ui          # Run E2E tests with UI
```

## Project Structure

```
linux-distro-catalog/
├── data/
│   ├── distros/              # Distro JSON files
│   │   └── ubuntu-lts.json
│   └── submissions/          # User submissions (moderation queue)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── distros/          # Distro pages
│   │   └── layout.tsx
│   ├── components/           # React components
│   │   ├── ui/               # Radix UI components
│   │   ├── distro-card.tsx
│   │   ├── distro-detail.tsx
│   │   ├── install-stepper.tsx
│   │   └── chat-widget.tsx
│   ├── lib/                  # Utilities
│   │   ├── distro-loader.ts  # Data loading
│   │   ├── rate-limit.ts     # API rate limiting
│   │   └── utils.ts          # Helpers
│   ├── types/                # TypeScript types
│   │   └── distro.schema.ts  # Zod schemas
│   └── tests/                # Tests
│       ├── distro.schema.test.ts
│       └── e2e/
├── scripts/                  # Build scripts
│   ├── ingest.ts             # Data ingestion
│   └── index-search.ts       # Search indexing
├── tools/
│   └── ai/
│       └── system_prompt.txt # AI system prompt
└── public/                   # Static assets
```

## Adding a New Distribution

### 1. Create JSON File

Create a new file in `data/distros/<distro-id>.json`:

```json
{
  "id": "your-distro-id",
  "name": "Your Distro Name",
  "family": "Debian",
  "latest_version": "1.0",
  "release_date": "2024-01-01",
  "target_users": ["beginner"],
  "desktop_environments": ["GNOME"],
  "package_manager": "apt",
  "kernel": "6.5",
  "min_ram_mb": 2048,
  "min_storage_mb": 20480,
  "iso_files": [
    {
      "id": "iso-1",
      "url": "https://example.com/distro.iso",
      "filename": "distro.iso",
      "size_mb": 2048,
      "sha256": "<64-char-hex-checksum>",
      "protocol": "https",
      "hosted": false
    }
  ],
  "install_steps": [...],
  "official_docs_url": "https://example.com/docs",
  "license": "GPL",
  "tags": ["beginner-friendly"],
  "last_verified": "2024-01-01"
}
```

### 2. Verify

```bash
npm run ingest:verify
```

### 3. Index for Search

```bash
npm run search:index
```

## AI Bot (Ollama)

This project includes an intelligent AI assistant powered by Ollama for providing Linux distribution recommendations, installation help, and troubleshooting.

### Quick Setup

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Pull a model**:
   ```bash
   ollama pull mistral-small-3
   ```
3. **Start Ollama**:
   ```bash
   ollama serve
   ```
4. **Configure** (already set in `.env.example`):
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=mistral-small-3
   ```

### Features

- ✅ **Health Check API**: Monitor Ollama status at `/api/ai/health`
- ✅ **Context-Aware**: Uses distro-specific data from JSON files
- ✅ **Safety-First**: Never provides destructive commands without confirmation
- ✅ **Multi-Platform**: Provides instructions for Windows, macOS, WSL, and Linux
- ✅ **Citation**: Always cites sources from official documentation
- ✅ **Graceful Errors**: User-friendly error messages with troubleshooting hints

### Available Models

| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| `mistral-small-3` | 3B | Default, balanced | Fast ⚡ |
| `llama3.2:3b` | 3B | Quick responses | Fastest ⚡⚡ |
| `mistral:7b` | 7B | Better quality | Medium |
| `llama3.1:8b` | 8B | High quality | Slower |

### API Endpoints

**Health Check**:
```bash
GET /api/ai/health
```

**Query AI**:
```bash
POST /api/ai/query
{
  "query": "How do I install Ubuntu?",
  "platform": "windows",
  "user_profile": {"skill_level": "beginner"}
}
```

### Troubleshooting

**"Ollama is not running"**:
```bash
ollama serve
```

**"Model not found"**:
```bash
ollama pull mistral-small-3
```

📖 **Full documentation**: See [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

The CI/CD pipeline will:
- Run linting and type checks
- Verify distro data integrity
- Run tests
- Build and deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add your distribution JSON or make changes
4. Run tests (`npm run test` and `npm run test:e2e`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Moderation Guidelines

User submissions are stored in `data/submissions/` and require manual review:

1. Review JSON file for completeness and accuracy
2. Verify ISO checksums against official sources
3. Test download links
4. Check for malicious content
5. Move approved submissions to `data/distros/`
6. Run `npm run ingest:verify` and `npm run search:index`

## Security

- CSP headers configured in `next.config.js`
- Rate limiting on API routes (10 req/min per IP)
- Zod validation for all inputs
- No PII sent to AI models
- SHA256 verification for all ISOs

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- All Linux distribution maintainers
- Open source community
- Contributors

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/linux-distro-catalog/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/linux-distro-catalog/discussions)
