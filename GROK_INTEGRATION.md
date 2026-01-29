# AI Provider Integration Guide

This project supports **free AI providers** for flexible, cost-effective responses:

## Quick Setup

### Option 1: Use Ollama (Recommended for Local - FREE)
1. Install from [ollama.ai](https://ollama.ai)
2. Start Ollama:
   ```bash
   ollama serve
   ```
3. Pull the model:
   ```bash
   ollama pull mistral-small-3
   ```
4. The system will automatically use it

### Option 2: Use Hugging Face (FREE - Cloud)
1. Get API token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Set environment variable:
   ```bash
   export HUGGING_FACE_API_KEY="hf_your_token_here"
   ```
3. The system will automatically use it

### Option 3: Use Both (Automatic Fallback - RECOMMENDED)
When multiple providers are configured:
- **Hugging Face** is tried first (free, cloud)
- Falls back to **Ollama** if Hugging Face unavailable (free, local)

## Features

### Ollama (Local - FREE)
- ✅ Runs completely offline (no internet needed)
- ✅ Free and open-source (no costs)
- ✅ Full privacy (data never leaves your machine)
- ✅ Configurable model
- ✅ Works without any API key

### Hugging Face (Cloud - FREE)
- ✅ Completely free API access (unlimited)
- ✅ Access to thousands of models
- ✅ Fast inference (cloud-based)
- ✅ No credit card needed
- ✅ Simple setup with token

## API Usage

### Sending requests with provider selection

```typescript
// Auto-select best available provider
const response = await fetch('/api/ai/query', {
  method: 'POST',
  body: JSON.stringify({
    query: 'How do I install Ubuntu?',
    distro_id: 'ubuntu',
    platform: 'linux',
    user_profile: { skill_level: 'beginner' },
    provider: 'auto', // 'auto', 'huggingface', or 'ollama'
  }),
});

// Force Hugging Face
const response = await fetch('/api/ai/query', {
  method: 'POST',
  body: JSON.stringify({
    // ... same payload
    provider: 'huggingface',
  }),
});

// Force Ollama
const response = await fetch('/api/ai/query', {
  method: 'POST',
  body: JSON.stringify({
    // ... same payload
    provider: 'ollama',
  }),
});
```

## Health Checks

### Check Hugging Face health
```bash
curl http://localhost:3000/api/ai/huggingface/health
```

### Check Ollama health
```bash
curl http://localhost:3000/api/ai/health
```

## Environment Variables

```bash
# Ollama Configuration (Local - FREE)
OLLAMA_BASE_URL=http://localhost:11434 # Ollama server URL
OLLAMA_MODEL=mistral-small-3           # Model to use

# Hugging Face Configuration (Cloud - FREE)
HUGGING_FACE_API_KEY=hf_your_token    # Get from: https://huggingface.co/settings/tokens
HF_API_KEY=hf_your_token              # Alternative
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.1  # Model to use
```

## Cost Considerations

### Ollama (Local - FREE)
- **Cost**: $0 (completely free)
- **Pros**: Offline, private, no setup costs
- **Cons**: Slower than cloud, requires local resources
- **Best for**: Development, privacy-sensitive apps

### Hugging Face (Cloud - FREE)
- **Cost**: $0 (unlimited free API calls)
- **Pros**: Fast cloud inference, free forever
- **Cons**: Requires internet connection
- **Best for**: Development, free cloud solution

## Troubleshooting

### Hugging Face returns 401
- Check your API token is valid at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Verify token has "Read" permission
- Verify environment variable is set correctly

### Hugging Face returns 503 (Model Overloaded)
- The model server is busy, wait and retry
- Try a different model by changing HF_MODEL
- Use Ollama as fallback

### All providers fail
- Check internet connection (needed for Hugging Face)
- Start Ollama: `ollama serve`
- See error message for detailed setup instructions

## Architecture

```
┌─────────────────────┐
│   Chat Widget       │
│   (Frontend)        │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────┐
│  /api/ai/query           │
│  (Next.js Route)         │
└──────────┬───────────────┘
           │
       ┌───┴────────┐
       ▼            ▼
     [HF]       [Ollama]
    (Cloud)     (Local)
    (Free)      (Free)
```

### Provider Selection Order (Auto Mode)
1. **Hugging Face** - if API token configured (free, cloud)
2. **Ollama** - if running locally (free, offline)
3. **Error message** - if none available with setup help

## Response Format

All responses include optional `provider` field:

```json
{
  "answer_md": "...",
  "steps": [...],
  "commands": [...],
  "sources": [...],
  "followup": "...",
  "verification": {...},
  "provider": "grok"  // or "ollama"
}
```

## Next Steps

- [ ] Implement streaming responses for real-time output
- [ ] Add provider selection UI to chat widget
- [ ] Implement caching for identical queries
- [ ] Add analytics to track provider usage
- [ ] Support additional providers (Claude, GPT, etc.)

## Support

For issues with:
- **Ollama**: See [Ollama Documentation](https://ollama.ai)
- **Hugging Face**: See [Hugging Face Documentation](https://huggingface.co/docs)
- **This integration**: Check GitHub issues
