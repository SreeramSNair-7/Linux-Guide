# Security & Environment Variables

## ⚠️ IMPORTANT - Before Pushing to GitHub

This project uses environment variables for sensitive configuration. **NEVER commit your `.env.local` file to GitHub!**

### Files That Are Protected (Already in .gitignore)

✅ `.env.local` - Your local development secrets  
✅ `.env*.local` - Any environment-specific local files  
✅ `.env.production` - Production secrets  

### Before First Commit

1. **Verify .gitignore is working:**
```powershell
git status
```
You should NOT see `.env.local` in the list.

2. **Double-check sensitive files are ignored:**
```powershell
git check-ignore .env.local
```
Should output: `.env.local` (confirms it's ignored)

3. **Test with a dry run:**
```powershell
git add -A --dry-run
```

### Setup for New Developers

New team members should:

1. Copy `.env.example` to `.env.local`:
```powershell
cp .env.example .env.local
```

2. Ask team lead for actual credentials

3. Replace all placeholder values in `.env.local`

### Required Environment Variables

#### Minimum for Development
- `DATABASE_URL` - SQLite or PostgreSQL connection
- `OLLAMA_BASE_URL` - Ollama API endpoint
- `NEXT_PUBLIC_SITE_URL` - Your site URL

#### Required for Production
- `POSTGRES_URL` - Production database
- `MEILISEARCH_HOST` + `MEILISEARCH_API_KEY` - Search service
- `ADMIN_SECRET_KEY` - Admin authentication
- `VERCEL_TOKEN` - For CI/CD deployment

#### Optional Services
- Cloudflare R2 - ISO file hosting
- Plausible - Privacy-focused analytics
- SMTP - Email notifications
- Sentry - Error tracking

### Generating Secure Secrets

```powershell
# Generate random secret (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use OpenSSL
openssl rand -base64 32
```

### CI/CD Secrets (GitHub Actions)

Add these as **Repository Secrets** in GitHub:

1. Go to your repo → Settings → Secrets and variables → Actions
2. Add each secret:
   - `POSTGRES_URL`
   - `MEILISEARCH_HOST`
   - `MEILISEARCH_API_KEY`
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add all production secrets
3. Select "Production" environment
4. Click "Save"

### Security Checklist Before Going Live

- [ ] All secrets in `.env.local` (not `.env`)
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets hardcoded in source code
- [ ] Production secrets added to Vercel
- [ ] GitHub Actions secrets configured
- [ ] Different secrets for dev/staging/production
- [ ] `ADMIN_SECRET_KEY` is strong (32+ chars)
- [ ] Database credentials are unique
- [ ] API keys have minimal required permissions

### What's Safe to Commit

✅ `.env.example` - Template with placeholder values  
✅ `README.md` - Documentation  
✅ `package.json` - Dependencies (no secrets)  
✅ All source code files  

### What's NEVER Safe to Commit

❌ `.env.local` - Your actual secrets  
❌ `.env.production` - Production secrets  
❌ Any file with actual API keys  
❌ Database credentials  
❌ Private keys or certificates  

### If You Accidentally Commit Secrets

1. **Immediately rotate/revoke the exposed credentials**
2. **Remove from git history:**
```powershell
# Remove file from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.local" --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: Rewrites history)
git push origin --force --all
```

3. **Better approach - use BFG Repo-Cleaner:**
```powershell
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env.local
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

4. **Update all exposed credentials immediately**

### Questions?

- Check if file is ignored: `git check-ignore .env.local`
- See what will be committed: `git status`
- Verify before push: `git diff --cached`
