import { NextResponse } from 'next/server';
import { sendContactFormEmail } from '../../../lib/email';
import { validateContactSubmission } from '../../../lib/spam-detection';

async function translateToEnglish(text) {
  if (!text || !text.trim()) return '';

  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return text;

  return payload[0].map(part => part?.[0] || '').join('') || text;
}

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, enquiryType, orderNumber, message, agreed, language } = formData;

    // Validate required fields
    if (!name || !email || !enquiryType || !agreed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate message for certain enquiry types
    const requiresMessage = ['General Enquiry / Feedback', 'Business Enquiry', 'Others', 'Order/Shipping Enquiry'].includes(enquiryType);
    if (requiresMessage && !message) {
      return NextResponse.json(
        { error: 'Message is required for this enquiry type' },
        { status: 400 }
      );
    }
    
    // Validate order number for Order/Shipping enquiry
    if (enquiryType === 'Order/Shipping Enquiry' && !orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required for Order/Shipping enquiries' },
        { status: 400 }
      );
    }

    // Validate email and check for spam
    const validation = validateContactSubmission({ name, email, message, enquiryType });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Send email
    try {
      let translatedMessage = message || '';
      const sourceLanguage = (language || 'en').toLowerCase();

      if (message && sourceLanguage !== 'en') {
        try {
          translatedMessage = await translateToEnglish(message);
        } catch (translationError) {
          console.error('Message translation failed, falling back to original text:', translationError);
          translatedMessage = message;
        }
      }

      const result = await sendContactFormEmail({
        name,
        email,
        enquiryType,
        orderNumber,
        message,
        translatedMessage,
        sourceLanguage,
        agreed,
      });
      
      if (!result.success) {
        console.error('Email sending failed:', result.error);
        // Continue anyway - the form data is still logged
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue anyway - we still want to acknowledge the submission
    }

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
