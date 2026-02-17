# 🔒 SECURITY NOTICE

## Credentials Are Protected ✅

Your service account credentials in `.env.local` are **NOT** committed to git and **WILL NOT** be pushed to GitHub or made public.

### What's Protected:
- ✅ `.env.local` - Ignored by git (contains your credentials)
- ✅ `*service-account*.json` - Service account key files ignored
- ✅ `*.pem` - Private key files ignored

### How It Works:

**Local Development (Your Computer):**
- Credentials are in `.env.local` 
- This file is listed in `.gitignore`
- Git will NEVER track or commit this file
- Only exists on your local machine

**Production (Vercel):**
- You manually add credentials in Vercel Dashboard
- Go to: Your Project → Settings → Environment Variables
- Add `GOOGLE_SERVICE_ACCOUNT_KEY` with the JSON content
- Vercel stores it securely and injects it only at runtime
- Never exposed in your code or git repository

**Git Repository (GitHub/GitLab/etc):**
- Only `.env.local.example` is tracked (template with NO real credentials)
- Actual credentials NEVER appear in commits or repository

### Verify Security:

Run this command to confirm `.env.local` is ignored:
```bash
git status
```

You should NOT see `.env.local` in the list of changes.

### For Vercel Deployment:

1. **Never commit credentials to git** ✅ (already protected)
2. **Add to Vercel Environment Variables**:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Variable name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: Paste the entire JSON from `.env.local`
   - Select all environments: Production, Preview, Development
   - Click Save

3. **Redeploy** your application

### If You Accidentally Committed Credentials:

1. **Immediately revoke the service account key**:
   - Go to https://console.cloud.google.com/iam-admin/serviceaccounts
   - Find your service account → Keys tab
   - Delete the compromised key
   - Create a new key

2. **Remove from git history** (if already pushed):
   ```bash
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.local" --prune-empty --tag-name-filter cat -- --all
   git push origin --force --all
   ```

3. **Update Vercel** with the new credentials

### Best Practices:

- ✅ Keep `.env.local` only on your local machine
- ✅ Use Vercel's Environment Variables for production
- ✅ Never share credentials in Slack, email, or screenshots
- ✅ Rotate keys periodically
- ✅ Use different service accounts for dev/prod if possible
- ✅ Only grant minimum required permissions (Viewer for sheets)

### Questions?

- Check if file is ignored: `git check-ignore .env.local` (should output: `.env.local`)
- See what files are tracked: `git ls-files` (should NOT include `.env.local`)
- Verify gitignore rules: `git status --ignored`

---

**Your credentials are safe!** 🔒
