This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure your environment variables:

```bash
cp .env.local.example .env.local
```

**Required Environment Variables:**

Choose ONE authentication method:

**Method 1: Service Account (Recommended for Private Sheets)**

- `GOOGLE_SERVICE_ACCOUNT_KEY` - JSON credentials for a Google Cloud service account
  1. Go to [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
  2. Create a new service account (or use existing)
  3. Click on the service account → Keys → Add Key → Create New Key → JSON
  4. Download the JSON key file
  5. **Share your Google Sheet** with the service account email (found in the JSON as `client_email`)
  6. Copy the entire JSON content and add it to `.env.local`:
     ```bash
     GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'
     ```
  7. For Vercel: Paste the JSON as a single line in environment variables

**Method 2: API Key (Only for Public Sheets)**

- `GOOGLE_SHEETS_API_KEY` - Get your API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Enable the Google Sheets API for your project
  - Create an API key and restrict it to Google Sheets API
  - **Note:** This only works if your sheet is publicly accessible

**Optional Environment Variables:**

- `GOOGLE_SHEET_ID` - Override the default Google Sheet ID (default: `1t-1V0WBpuFmRCLgctUZqm4-BXCdyyqG-NBrm8JgULQQ`)
- `GOOGLE_SHEET_RANGE` - Override the default sheet range (default: `Current!A:J`)

- Admin authentication credentials (for admin features)
- Basic authentication (if needed)
- Access control captcha secret
- Site URL (auto-detected on Vercel)

See `.env.local.example` for all available options.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Troubleshooting

### "Order database is temporarily unavailable" Error

This error occurs when the application cannot access the Google Sheets database. Common causes:

1. **Missing Authentication**: Ensure either `GOOGLE_SERVICE_ACCOUNT_KEY` or `GOOGLE_SHEETS_API_KEY` is set in your `.env.local` file (local) or environment variables (production/Vercel).

2. **Service Account Not Shared**: If using service account authentication, you must share your Google Sheet with the service account email address (found in your JSON credentials as `client_email`).

3. **Invalid Credentials**: 
   - For service accounts: Verify the JSON key is valid and properly formatted
   - For API keys: Verify your API key is correct and has not been restricted or revoked

4. **Google Sheets API Not Enabled**: 
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/library)
   - Search for "Google Sheets API"
   - Click "Enable"

5. **Incorrect Sheet ID or Range**: 
   - Verify the `GOOGLE_SHEET_ID` matches your sheet
   - Ensure the `GOOGLE_SHEET_RANGE` (default: `Current!A:J`) exists in your sheet

6. **API Key Restrictions**: 
   - Check your API key settings in Google Cloud Console
   - Ensure the key has access to Google Sheets API
   - If using IP restrictions, ensure your server IP is allowed

7. **Rate Limiting**: Google Sheets API has usage quotas. Check your quota in the Google Cloud Console.

### "No order found matching all fields" Error

This error means the order details you entered don't match any records in the database. Check:

1. **Tracking Number**: Ensure it's entered correctly (case-insensitive, but must be exact)
2. **Order Number**: Must match exactly (case-insensitive)
3. **Destination Country**: Must match the country code in the database
4. **Postcode**: Must match exactly (for US, can match first 5 digits of ZIP code)

All four fields must match for the order to be found.

### For Production/Vercel Deployments

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add ONE of the following:
   - **For Service Account** (Recommended): 
     - Variable: `GOOGLE_SERVICE_ACCOUNT_KEY`
     - Value: Paste the entire JSON content from your service account key file (as a single line)
   - **For API Key** (Public sheets only): 
     - Variable: `GOOGLE_SHEETS_API_KEY`
     - Value: Your API key
4. Optionally add `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_RANGE` if different from defaults
5. Redeploy your application

### Checking Logs

- **Local Development**: Check the terminal where `npm run dev` is running
- **Production**: Check browser console (F12) and server logs for detailed error messages

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
