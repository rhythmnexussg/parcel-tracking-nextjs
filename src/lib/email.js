/**
 * Email Utility for Contact Forms
 * 
 * This utility provides email sending functionality for the contact forms.
 * It uses nodemailer to send emails through Gmail SMTP.
 * 
 * Setup Instructions:
 * 1. Install nodemailer: npm install nodemailer
 * 2. Create a .env.local file in the root directory
 * 3. Add the following environment variables:
 *    EMAIL_USER=rhythmnexusco@gmail.com
 *    EMAIL_PASSWORD=your_app_password_here
 * 
 * For Gmail, you need to use an App Password:
 * 1. Go to Google Account settings
 * 2. Enable 2-Factor Authentication
 * 3. Go to Security > App Passwords
 * 4. Generate a new app password for "Mail"
 * 5. Use that password in EMAIL_PASSWORD
 */

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('nodemailer is not installed. Email functionality will be limited.');
}

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (!nodemailer) {
    throw new Error('nodemailer is not installed');
  }

  if (transporter) {
    return transporter;
  }

  const emailUser = process.env.EMAIL_USER || 'rhythmnexusco@gmail.com';
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailPassword) {
    console.warn('EMAIL_PASSWORD not set in environment variables');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

  return transporter;
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.replyTo - Reply-to email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {Object} [options.attachment] - Optional attachment
 * @param {string} options.attachment.filename - Attachment filename
 * @param {string} options.attachment.content - Base64 encoded content
 * @param {string} options.attachment.contentType - MIME type
 */
export async function sendEmail({ to, replyTo, subject, text, attachment }) {
  try {
    const transport = getTransporter();
    
    if (!transport) {
      console.error('Email transporter not configured. Email not sent.');
      console.log('Email details:', { to, replyTo, subject, text: text.substring(0, 100) + '...' });
      return { success: false, error: 'Email not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'rhythmnexusco@gmail.com',
      to: to,
      replyTo: replyTo,
      subject: subject,
      text: text
    };

    if (attachment) {
      mailOptions.attachments = [{
        filename: attachment.filename,
        content: attachment.content,
        encoding: 'base64'
      }];
    }

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a contact form submission email
 */
export async function sendContactFormEmail({
  name,
  email,
  enquiryType,
  orderNumber,
  message,
  translatedMessage,
  sourceLanguage,
  agreed,
}) {
  let emailContent = `
New Contact Form Submission
============================

Name: ${name}
Email: ${email}
Enquiry Type: ${enquiryType}
Source Language: ${(sourceLanguage || 'en').toUpperCase()}
`;

  if (orderNumber) {
    emailContent += `Order Number: ${orderNumber}\n`;
  }

  if (message) {
    emailContent += `\nOriginal Message:\n${message}\n`;

    if (translatedMessage && translatedMessage !== message) {
      emailContent += `\nTranslated Message (English):\n${translatedMessage}\n`;
    }
  }

  emailContent += `\nUser agreed to terms: ${agreed ? 'Yes' : 'No'}\n`;
  emailContent += `\nSubmitted at: ${new Date().toISOString()}\n`;

  return await sendEmail({
    to: 'rhythmnexusco@gmail.com',
    replyTo: email,
    subject: `Contact Form: ${enquiryType} - ${name}`,
    text: emailContent
  });
}

/**
 * Sends a parcel enquiry email
 */
export async function sendParcelEnquiryEmail({
  name,
  orderNumber,
  email,
  shippingMethod,
  trackingNumber,
  undeliveredLongTime,
  deliveredButMissing,
  caseReferenceId,
  imageData
}) {
  let emailContent = `
New Parcel Enquiry Submission
==============================

Name: ${name}
Order Number: ${orderNumber}
Email: ${email}
Shipping Method: ${shippingMethod}
Tracking Number: ${trackingNumber}

Parcel Status
-------------
Undelivered for more than required time: ${undeliveredLongTime}
Delivered but missing: ${deliveredButMissing}
Case Reference ID: ${caseReferenceId}

Submitted at: ${new Date().toISOString()}
`;

  if (imageData) {
    emailContent += `\nImage Evidence: Attached (${imageData.filename}, ${(imageData.size / 1024 / 1024).toFixed(2)} MB)\n`;
  }

  return await sendEmail({
    to: 'rhythmnexusco@gmail.com',
    replyTo: email,
    subject: `Parcel Enquiry: ${orderNumber} - ${trackingNumber}`,
    text: emailContent,
    attachment: imageData
  });
}
