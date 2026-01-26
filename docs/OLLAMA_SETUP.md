# Ollama AI Bot Setup

This project uses [Ollama](https://ollama.ai) to power the AI assistant for Linux distribution recommendations and support.

## Prerequisites

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
   - Windows: Download and run the installer
   - macOS: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.ai/install.sh | sh`

## Quick Start

### 1. Start Ollama Service

```bash
ollama serve
```

### 2. Pull the AI Model

The default model is `mistral-small-3`. Pull it with:

```bash
ollama pull mistral-small-3
```

**Alternative models** (you can use these by setting `OLLAMA_MODEL` in `.env`):
- `llama3.2:3b` - Fast, good for general chat (3B parameters)
- `mistral:7b` - Balanced performance (7B parameters)
- `llama3.1:8b` - Better quality responses (8B parameters)
- `codellama:13b` - For code-heavy assistance (13B parameters)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral-small-3
```

### 4. Start the Development Server

```bash
npm run dev
```

## Usage

### Chat Widget

The AI assistant appears as a floating chat widget in the bottom-right corner of the application. Users can:

- Ask questions about Linux distributions
- Get installation instructions
- Compare different distros
- Troubleshoot issues
- Verify checksums

### API Endpoints

#### POST `/api/ai/query`

Send a query to the AI assistant.

**Request:**
```json
{
  "query": "How do I install Ubuntu on Windows?",
  "distro_id": "ubuntu-lts",
  "platform": "windows",
  "user_profile": {
    "skill_level": "beginner"
  },
  "allow_hosted_iso": false
}
```

**Response:**
```json
{
  "answer_md": "To install Ubuntu...",
  "steps": [...],
  "commands": [...],
  "sources": [...],
  "followup": "Would you like more details?",
  "verification": {...}
}
```

#### GET `/api/ai/health`

Check Ollama service status and available models.

**Response:**
```json
{
  "status": "healthy",
  "ollama": {
    "running": true,
    "baseUrl": "http://localhost:11434",
    "model": "mistral-small-3",
    "modelAvailable": true
  },
  "availableModels": [...],
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

## Troubleshooting

### "Ollama is not running"

1. Make sure Ollama is installed
2. Start the service: `ollama serve`
3. Check if it's running: `curl http://localhost:11434`

### "Model not found"

Pull the model:
```bash
ollama pull mistral-small-3
```

Or use a different model by setting `OLLAMA_MODEL` in `.env.local`.

### Port already in use

If port 11434 is in use, you can change it:

```bash
# Set custom port
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

Then update `.env.local`:
```env
OLLAMA_BASE_URL=http://localhost:11435
```

## Features

### AI Capabilities

- **Context-Aware**: Uses distro-specific data from JSON files
- **Safety-First**: Never provides destructive commands without explicit confirmation
- **Citation**: Always cites sources from official documentation
- **Multi-Platform**: Provides instructions for Windows, macOS, WSL, and Linux
- **Skill-Aware**: Adapts responses based on user skill level

### Technical Features

- Health check endpoint to verify Ollama status
- Automatic model availability detection
- Graceful error handling with user-friendly messages
- Support for multiple Ollama models
- TypeScript SDK integration for better type safety

## Model Recommendations

| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| `mistral-small-3` | 3B | Default, balanced | Fast |
| `llama3.2:3b` | 3B | Quick responses | Fastest |
| `mistral:7b` | 7B | Better quality | Medium |
| `llama3.1:8b` | 8B | High quality | Slower |
| `codellama:13b` | 13B | Code assistance | Slowest |

## Development

### Testing the AI

1. Start Ollama: `ollama serve`
2. Test the health endpoint: `curl http://localhost:3000/api/ai/health`
3. Use the chat widget in the UI or test the API directly:

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is Linux?",
    "platform": "windows",
    "user_profile": {"skill_level": "beginner"}
  }'
```

### Customizing the System Prompt

Edit [tools/ai/system_prompt.txt](../tools/ai/system_prompt.txt) to customize the AI's behavior, response format, and safety rules.

## Production Deployment

For production:

1. Run Ollama on a dedicated server
2. Set `OLLAMA_BASE_URL` to your server URL
3. Consider using a GPU-accelerated instance for better performance
4. Monitor the health endpoint
5. Set up rate limiting (currently disabled due to lru-cache issues)

## Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Ollama Models](https://ollama.ai/library)
- [Model Comparison](https://ollama.ai/blog/model-comparison)
