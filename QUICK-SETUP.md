# Quick Setup - Service Account Authentication

## Why Service Account?
Service accounts are the correct way to authenticate server-side applications with Google APIs. They work without user interaction and are secure for production use.

## Step 1: Create Service Account (2 minutes)
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. If prompted, select or create a project
3. Click **"+ CREATE SERVICE ACCOUNT"**
4. Enter a name (e.g., "parcel-tracking-reader")
5. Click **"CREATE AND CONTINUE"**
6. Skip the optional "Grant this service account access" (click CONTINUE)
7. Skip "Grant users access" (click DONE)

## Step 2: Create JSON Key
1. Click on your newly created service account in the list
2. Go to the **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"CREATE"**
6. A file will download (e.g., `your-project-123456-abcdef123456.json`) - **SAVE IT**

## Step 3: Enable Google Sheets API
1. Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com
2. Click **"ENABLE"**
3. Wait for it to enable (takes a few seconds)

## Step 4: Share Your Sheet with Service Account
1. Open the JSON key file you downloaded
2. Find the `"client_email"` field - it looks like:
   ```
   "client_email": "parcel-tracking-reader@your-project-123456.iam.gserviceaccount.com"
   ```
3. **COPY** that email address
4. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1t-1V0WBpuFmRCLgctUZqm4-BXCdyyqG-NBrm8JgULQQ/edit
5. Click the **"Share"** button (top right)
6. **PASTE** the service account email
7. Make sure it's set to **"Viewer"** permission
8. **UNCHECK** "Notify people"
9. Click **"Share"** or **"Done"**

## Step 5: Add Credentials to .env.local
1. Open the JSON key file in a text editor
2. **COPY THE ENTIRE CONTENT** (it's already one line in most editors)
3. Open `.env.local` in this project
4. Find the line: `# GOOGLE_SERVICE_ACCOUNT_KEY=...`
5. Remove the `#` and paste your JSON after the `=`:
   ```
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-123456",...entire JSON here...}
   ```
6. **IMPORTANT**: Keep it as ONE line, with the JSON inside quotes or not
7. Save the file

## Step 6: Restart Development Server
In the terminal:
```bash
npm run dev
```

## Step 7: Test
Visit: http://localhost:3000/api/orders

You should see your order data as JSON! ✅

---

## For Vercel (Production)
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON content from your key file
   - Check: Production, Preview, Development
4. Click **"Save"**
5. Go to Deployments → Click ⋯ on latest → **"Redeploy"**

---

## Troubleshooting

### "Permission denied"
- Make sure you shared the sheet with the service account email
- Check that you gave "Viewer" permission (or higher)

### "Invalid credentials" / "Parse error"
- Ensure the JSON is complete and valid
- Try wrapping it in single quotes: `GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'`

### "API not enabled"
- Go to https://console.cloud.google.com/apis/library/sheets.googleapis.com
- Make sure Google Sheets API is enabled

### Still not working?
- Check the terminal for error messages
- Verify the service account email in the JSON matches what you shared the sheet with
- Make sure you're using the correct Google Cloud project
