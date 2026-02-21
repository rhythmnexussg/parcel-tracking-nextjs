import { NextResponse } from 'next/server';
import { sendParcelEnquiryEmail } from '../../../lib/email';
import { validateEmail } from '../../../lib/spam-detection';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const orderNumber = formData.get('orderNumber');
    const email = formData.get('email');
    const shippingMethod = formData.get('shippingMethod');
    const trackingNumber = formData.get('trackingNumber');
    const undeliveredLongTime = formData.get('undeliveredLongTime');
    const deliveredButMissing = formData.get('deliveredButMissing');
    const caseReferenceId = formData.get('caseReferenceId');
    const imageEvidence = formData.get('imageEvidence');
    const language = formData.get('language') || 'en';
    const agreed = formData.get('agreed') === 'true';

    // Validate required fields
    if (!name || !orderNumber || !email || !shippingMethod || !trackingNumber || !undeliveredLongTime || !agreed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email, language);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.reason },
        { status: 400 }
      );
    }

    // Prevent submission if user selected "No"
    if (undeliveredLongTime === 'No') {
      return NextResponse.json(
        { error: 'Cannot submit form if parcel has not been undelivered for the required time period' },
        { status: 400 }
      );
    }

    // Validate case reference ID
    if (!deliveredButMissing || !caseReferenceId) {
      return NextResponse.json(
        { error: 'Missing delivery status or case reference ID' },
        { status: 400 }
      );
    }

    // Handle image evidence
    let imageData = null;
    if (imageEvidence && imageEvidence.size > 0) {
      // Validate file size (max 1GB)
      const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
      if (imageEvidence.size > maxSize) {
        return NextResponse.json(
          { error: 'Image file size exceeds 1GB limit' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!imageEvidence.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Convert image to base64 for email attachment
      const bytes = await imageEvidence.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageData = {
        filename: imageEvidence.name,
        content: buffer.toString('base64'),
        contentType: imageEvidence.type,
        size: imageEvidence.size
      };
    }

    // Send email
    try {
      const result = await sendParcelEnquiryEmail({
        name,
        orderNumber,
        email,
        shippingMethod,
        trackingNumber,
        undeliveredLongTime,
        deliveredButMissing,
        caseReferenceId,
        imageData
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
      { success: true, message: 'Parcel enquiry submitted successfully', warning: emailValidation.warning || '' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing parcel enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
