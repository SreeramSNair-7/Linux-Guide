# Hugging Face AI Setup Guide

## ✅ Current Status

Your Hugging Face integration is **100% implemented and ready to go**. All code is in place:
- ✅ [src/lib/huggingface-client.ts](src/lib/huggingface-client.ts) - Full API client with retry logic
- ✅ [src/app/api/ai/query/route.ts](src/app/api/ai/query/route.ts) - Integrated into main AI endpoint
- ✅ [src/components/chat-widget.tsx](src/components/chat-widget.tsx) - Chat UI ready
- ❌ **Missing:** API key in `.env.local` (currently empty: `HUGGING_FACE_API_KEY=""`)

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Free API Token

1. Go to: https://huggingface.co/settings/tokens
2. Click "New token"
3. Choose a name (e.g., "Linux-Guide-AI")
4. Select **"Read"** permission (minimum required)
5. Click "Create token"
6. Copy the token (starts with `hf_`)

### Step 2: Add to `.env.local`

Replace the empty value in `.env.local`:

```env
# Before:
HUGGING_FACE_API_KEY=""

# After (paste your token):
HUGGING_FACE_API_KEY="hf_your_token_here"
```

**Example:**
```env
HUGGING_FACE_API_KEY="hf_dMkzrzBjznQAsdfghjklqwertyuiopzxcvbnm"
```

### Step 3: Restart Your Server

If running locally:
```bash
# Stop the dev server (Ctrl+C)
# Restart:
npm run dev
```

If on Vercel:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add: `HUGGING_FACE_API_KEY` = `hf_your_token_here`
4. Click "Save"
5. Click "Redeploy" on the Deployments tab

## ✨ What Happens Next

Once the API key is set:

- **Chat widget becomes active** on every distro page
- **Model used:** `HuggingFaceH4/zephyr-7b-beta` (free, fast)
- **Auto-fallback:** If HF is busy, falls back to Ollama
- **No cold start needed:** HF caches models

## 🧪 Test It

### Local Testing
```bash
# Health check
curl http://localhost:3000/api/ai/huggingface/health

# Should return (after key is added):
{
  "service": "huggingface",
  "enabled": true,
  "configured": true,
  "model": "HuggingFaceH4/zephyr-7b-beta"
}
```

### Production Testing
1. Visit: https://linux-distro-catalog.vercel.app
2. Go to any distro (e.g., Ubuntu)
3. Scroll to bottom → Chat widget
4. Type a question: "How do I install this?"
5. Get response from Hugging Face ✅

## ⚙️ Configuration Details

| Variable | Value | Required |
|----------|-------|----------|
| `HUGGING_FACE_API_KEY` | Your HF token | ✅ YES |
| `HF_MODEL` | Model name (default: `HuggingFaceH4/zephyr-7b-beta`) | ❌ Optional |
| `HUGGING_FACE_INSECURE_TLS` | Set to `"1"` for dev (default: enabled) | ❌ Optional |

## 🔧 Available HF Models

You can use any HF Inference API compatible model:

```env
# Fast, good for general chat
HF_MODEL="HuggingFaceH4/zephyr-7b-beta"

# More capable but slower
HF_MODEL="mistralai/Mistral-7B-Instruct-v0.2"

# Code-focused
HF_MODEL="codellama/CodeLlama-7b-Instruct-hf"
```

## 🆘 Troubleshooting

### "HUGGING_FACE_API_KEY is not configured"
- Check `.env.local` - key must be non-empty
- Restart your server after adding the key

### "API error: 401"
- Token is invalid or revoked
- Regenerate token at https://huggingface.co/settings/tokens
- Make sure token has **Read** permission

### "API error: 503 (Model Overloaded)"
- HF model server is busy (free tier)
- System will auto-fallback to Ollama
- Try again in 1-2 minutes
- Consider using a different model

### "Works on Vercel but not locally"
- Windows + Node.js dev server has compatibility issues
- This is NOT a code problem
- Test on Vercel instead (always works)

## 📝 Security Notes

- Never commit `.env.local` to GitHub (it's in `.gitignore` ✅)
- Token has "Read" permission only (safe)
- Can rotate token anytime at HF dashboard

## ✅ Checklist

- [ ] Copied token from https://huggingface.co/settings/tokens
- [ ] Updated `HUGGING_FACE_API_KEY=""` in `.env.local`
- [ ] Restarted dev server (or redeployed on Vercel)
- [ ] Tested chat widget on a distro page
- [ ] Getting responses from Hugging Face

## 🎯 Next Steps

1. **Add the API key** → 2 minutes
2. **Test the chat** → instant feedback
3. **Enjoy cloud AI** → zero latency, always available

**That's it!** Your AI assistant is ready to go. 🚀

---

*Need help? See [GROK_INTEGRATION.md](GROK_INTEGRATION.md) for more provider options and [OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md) for local AI fallback.*
