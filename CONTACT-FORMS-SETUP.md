# Contact Forms Setup Guide

This document describes the contact form system and how to configure it.

## Overview

The contact form system consists of two forms:

1. **Main Contact Form** (`/contact`) - For general enquiries, business enquiries, order/shipping questions, and exchange/refund requests
2. **Parcel Enquiry Form** (`/contact/parcel-enquiry`) - Specifically for missing or undelivered parcels

## Features

### Main Contact Form (/contact)

- **Name field** - Required, no nicknames or phone numbers
- **Email field** - Required, used for responses
- **Enquiry Type** - Dropdown with 5 options:
  - General Enquiry / Feedback
  - Business Enquiry
  - Order/Shipping Enquiry
  - Exchange/Refund/Return Enquiry
  - Others

- **Conditional Content**:
  - **General/Business/Others**: Shows message field (max 1000 characters)
  - **Order/Shipping**: Shows alert with link to parcel enquiry form
  - **Exchange/Refund**: Shows platform refund policies and Payhip information

- **Agreement checkbox** - User must agree to email usage for response
- **Response time notice** - 3-5 business days

### Parcel Enquiry Form (/contact/parcel-enquiry)

- **Name** - Required
- **Order Number** - Required (with platform-specific instructions)
- **Email** - Required
- **Shipping Method** - Dropdown with options:
  - SingPost ePacket (ePAC)
  - SingPost Prepaid Tracked Label
  - SpeedPost Standard
  - SpeedPost Priority (EMS)
  - SpeedPost Express
  - DHL Express
  
- **Tracking Number** - Required
- **Delivery Status Questions** - Conditional logic:
  - If parcel undelivered for required time → Show additional fields
  - If not → Show "wait for delivery" message and prevent submission
  
- **Additional Fields** (when applicable):
  - Delivered but missing status
  - Case Reference ID from local post office (NA for Singapore)
  - Image evidence upload (max 1GB, images only)
  - Agreement checkbox

## Email Configuration

All form submissions are sent to `rhythmnexusco@gmail.com`.

### Setup Steps

1. **Install Dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   
   - Edit `.env.local` and set:
     ```env
     EMAIL_USER=rhythmnexusco@gmail.com
     EMAIL_PASSWORD=your_app_password_here
     ```

3. **Get Gmail App Password**:
   - Go to https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification (must be enabled)
   - Scroll to "App passwords"
   - Create a new app password for "Mail"
   - Copy the 16-character password
   - Paste it in `.env.local` as `EMAIL_PASSWORD`

4. **Test the Forms**:
   - Start the development server: `npm run dev`
   - Visit http://localhost:3000/contact
   - Fill out and submit a test form
   - Check your Gmail for the received email

## File Structure

```
src/
├── app/
│   ├── contact/
│   │   ├── page.js                    # Main contact form
│   │   └── parcel-enquiry/
│   │       └── page.js                # Parcel enquiry form
│   └── api/
│       ├── contact/
│       │   └── route.js               # Contact form API endpoint
│       └── parcel-enquiry/
│           └── route.js               # Parcel enquiry API endpoint
├── lib/
│   └── email.js                       # Email utility functions
└── components/
    └── Navigation.js                  # Navigation component (used in forms)
```

## How It Works

### Contact Form Flow

1. User fills out the form at `/contact`
2. Form validates inputs client-side
3. On submit, sends POST request to `/api/contact`
4. API validates data server-side
5. Email utility sends email via nodemailer (Gmail SMTP)
6. User receives success/error message

### Parcel Enquiry Flow

1. User navigated from contact form or directly to `/contact/parcel-enquiry`
2. Form validates inputs with conditional logic
3. User can upload image evidence (optional, max 1GB)
4. On submit, sends POST request with FormData to `/api/parcel-enquiry`
5. API validates data and file
6. Converts image to base64 for email attachment
7. Email utility sends email with attachment
8. User receives success/error message

## Email Content

### Contact Form Emails

Subject: `Contact Form: [Enquiry Type] - [Name]`

Content includes:
- Name
- Email (set as Reply-To)
- Enquiry Type
- Message (if applicable)
- Agreement status
- Timestamp

### Parcel Enquiry Emails

Subject: `Parcel Enquiry: [Order Number] - [Tracking Number]`

Content includes:
- Name
- Order Number
- Email (set as Reply-To)
- Shipping Method
- Tracking Number
- Delivery status answers
- Case Reference ID
- Image evidence (as attachment if provided)
- Agreement status
- Timestamp

## Security Features

- Server-side validation for all inputs
- File type validation (images only)
- File size validation (max 1GB)
- Email validation
- Required field validation
- Prevents submission when conditions aren't met
- CSRF protection via Next.js API routes

## Troubleshooting

### Emails Not Sending

1. Check `.env.local` exists and has correct credentials
2. Verify Gmail App Password is correct (not regular password)
3. Check server logs for error messages
4. Ensure 2-Factor Authentication is enabled on Gmail
5. Try regenerating the App Password

### Form Submission Errors

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify all required fields are filled
4. Check file size if uploading images

### Development Testing

During development, if email configuration is not set up, the forms will still:
- Validate inputs
- Log submission details to console
- Return success to the user

This allows development without email configuration.

## Production Deployment

1. Set environment variables in your hosting platform (Vercel, etc.):
   - `EMAIL_USER=rhythmnexusco@gmail.com`
   - `EMAIL_PASSWORD=[your-app-password]`

2. Deploy the application

3. Test the forms in production

## Future Enhancements

Possible improvements:
- Add spam protection (e.g., reCAPTCHA)
- Store submissions in a database
- Add admin panel to view submissions
- Implement email templates with HTML
- Add file upload to cloud storage instead of email attachment
- Add auto-reply emails to users
- Implement rate limiting
