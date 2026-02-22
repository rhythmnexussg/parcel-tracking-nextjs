import { NextResponse } from 'next/server';
import { rateLimit, secureApiResponse } from '../security';

const MAX_MESSAGE_LENGTH = 2000;
const UPSTREAM_TIMEOUT_MS = 20000;
const DEFAULT_N8N_WEBHOOK_URL =
  'https://n8ngc.codeblazar.org/webhook/6de02273-a19c-4249-8eb9-0944e48eecff';

function extractReply(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data.text === 'string') return data.text;
  if (typeof data.output === 'string') return data.output;
  if (typeof data.response === 'string') return data.response;
  if (typeof data.answer === 'string') return data.answer;
  if (typeof data.message === 'string') return data.message;

  if (Array.isArray(data)) {
    const lastString = [...data].reverse().find((item) => typeof item === 'string');
    if (lastString) return lastString;
  }

  if (Array.isArray(data.messages)) {
    const lastAssistant = [...data.messages]
      .reverse()
      .find((item) => item?.role === 'assistant' && typeof item?.content === 'string');
    if (lastAssistant?.content) return lastAssistant.content;
  }

  return '';
}

function extractUpstreamErrorMessage(errorText) {
  if (!errorText) return '';

  try {
    const parsed = JSON.parse(errorText);
    if (typeof parsed?.message === 'string') return parsed.message;
    if (typeof parsed?.error === 'string') return parsed.error;
    if (typeof parsed?.details === 'string') return parsed.details;
  } catch {
    // Fall back to plain text handling
  }

  return String(errorText);
}

export async function POST(request) {
  const limited = rateLimit(request, { keyPrefix: 'chatbot', maxRequests: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  const webhookUrl = process.env.CHATBOT_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK_URL;

  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return secureApiResponse(
        NextResponse.json(
          { error: 'Message is required.' },
          { status: 400 }
        )
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return secureApiResponse(
        NextResponse.json(
          { error: `Message is too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.` },
          { status: 400 }
        )
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    const webhookPayload = {
      message,
      question: message,
      history: Array.isArray(body?.history) ? body.history : []
    };

    let upstreamResponse;
    try {
      upstreamResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload),
        cache: 'no-store',
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error('Chatbot webhook request failed:', upstreamResponse.status, errorText);

      const upstreamMessage = extractUpstreamErrorMessage(errorText);
      const lowerErrorText = String(upstreamMessage || errorText || '').toLowerCase();
      const isRateLimited =
        upstreamResponse.status === 429 ||
        lowerErrorText.includes('rate limit') ||
        lowerErrorText.includes('rate_limit_exceeded') ||
        lowerErrorText.includes('tokens per day');

      if (isRateLimited) {
        return secureApiResponse(
          NextResponse.json(
            { error: 'Chatbot is rate-limited right now. Please try again in a few minutes.' },
            { status: 429 }
          )
        );
      }

      const isAuthIssue = upstreamResponse.status === 401 || upstreamResponse.status === 403;
      if (isAuthIssue) {
        return secureApiResponse(
          NextResponse.json(
            { error: 'Chatbot authentication failed. Please verify webhook credentials.' },
            { status: 502 }
          )
        );
      }

      const isMissingWebhook = upstreamResponse.status === 404;
      if (isMissingWebhook) {
        return secureApiResponse(
          NextResponse.json(
            { error: 'Chatbot webhook endpoint was not found. Please verify CHATBOT_WEBHOOK_URL.' },
            { status: 502 }
          )
        );
      }

      if (lowerErrorText.includes('please provide your request') || lowerErrorText.includes('invalid payload')) {
        return secureApiResponse(
          NextResponse.json(
            { error: 'Chatbot request format was rejected by webhook. Please check webhook payload mapping.' },
            { status: 502 }
          )
        );
      }

      if (upstreamMessage) {
        const trimmed = upstreamMessage.slice(0, 260);
        return secureApiResponse(
          NextResponse.json(
            { error: `Chatbot provider error: ${trimmed}` },
            { status: 502 }
          )
        );
      }

      return secureApiResponse(
        NextResponse.json(
          { error: 'Chatbot provider request failed.' },
          { status: 502 }
        )
      );
    }

    const data = await upstreamResponse.json();
    const reply = extractReply(data).trim();

    if (!reply) {
      return secureApiResponse(
        NextResponse.json(
          { error: 'Chatbot returned an empty response.' },
          { status: 502 }
        )
      );
    }

    return secureApiResponse(
      NextResponse.json(
        { reply },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error('Chatbot route error:', error);

    if (error?.name === 'AbortError') {
      return secureApiResponse(
        NextResponse.json(
          { error: 'Chatbot timed out. Please try again.' },
          { status: 504 }
        )
      );
    }

    return secureApiResponse(
      NextResponse.json(
        { error: 'Unable to process chatbot request.' },
        { status: 500 }
      )
    );
  }
}
