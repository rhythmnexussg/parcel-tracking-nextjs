import { NextResponse } from 'next/server';
import { rateLimit, secureApiResponse } from '../security';
import { google } from 'googleapis';

// Allow configuration via environment variables, with fallback to defaults
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1t-1V0WBpuFmRCLgctUZqm4-BXCdyyqG-NBrm8JgULQQ';
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Current!A:J';

// Get Google Sheets client with proper authentication
async function getAuthenticatedSheetsClient() {
  // Check if service account credentials are provided
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    // Use Service Account authentication (recommended for production)
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return google.sheets({ version: 'v4', auth });
  }
  
  // Fallback to API key for public sheets
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (apiKey) {
    return google.sheets({ version: 'v4', auth: apiKey });
  }
  
  return null;
}

export async function GET(request) {
  const limited = rateLimit(request, { keyPrefix: 'orders', maxRequests: 60, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const sheets = await getAuthenticatedSheetsClient();
    
    if (!sheets) {
      console.error('Google Sheets authentication not configured');
      return secureApiResponse(
        NextResponse.json(
          {
            error: 'order_source_unavailable',
            message: 'Order database is not configured. Please contact support.',
            details: 'Server configuration missing authentication credentials.',
          },
          { status: 503 }
        )
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    const values = response.data.values;
    if (!Array.isArray(values) || values.length === 0) {
      console.error('Google Sheets API error: No data found');
      return secureApiResponse(
        NextResponse.json(
          {
            error: 'order_source_unavailable',
            message: 'Unable to access order database. Please try again later.',
            details: 'No data found in the specified sheet range.',
          },
          { status: 502 }
        )
      );
    }

    const rows = values.slice(1).map((r) => ({
      orderNumber: r[0] || '',
      email: r[1] || '',
      dialingCode: r[2] || '',
      phone: r[3] || '',
      trackingNumber: r[4] || '',
      destinationCountry: r[5] || '',
      postcode: r[6] || '',
      status: r[7] || '',
      postedDate: r[8] || '',
      shippedVia: r[9] || '',
    }));

    return secureApiResponse(
      NextResponse.json(
        { orders: rows },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    );
  } catch (error) {
    console.error('Unexpected error fetching orders:', error);
    return secureApiResponse(
      NextResponse.json(
        { 
          error: 'order_source_unavailable',
          message: 'An unexpected error occurred. Please try again later.' 
        },
        { status: 502 }
      )
    );
  }
}

