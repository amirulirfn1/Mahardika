import axios from 'axios';

const WA_TOKEN = process.env.WA_TOKEN;
const WA_NUMBER = process.env.WA_NUMBER;

if (!WA_TOKEN || !WA_NUMBER) {
  console.warn('WhatsApp API credentials not set (WA_TOKEN, WA_NUMBER)');
}

export interface WhatsAppResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
}

/**
 * Send plain text WhatsApp message via Cloud API
 * @param to E164 formatted phone number, e.g. 60123456789
 * @param body Text body within 4096 chars
 */
export async function sendText(to: string, body: string): Promise<WhatsAppResponse> {
  if (!WA_TOKEN || !WA_NUMBER) return { success: false, error: 'WA creds missing' };

  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${WA_NUMBER}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body },
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err: any) {
    return { success: false, error: err?.response?.data?.error?.message || err.message, status: err?.response?.status };
  }
}

/**
 * Send WhatsApp message from a template previously approved.
 */
export async function sendTemplate(to: string, templateName: string, lang: string = 'en_US', components?: unknown[]): Promise<WhatsAppResponse> {
  if (!WA_TOKEN || !WA_NUMBER) return { success: false, error: 'WA creds missing' };

  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${WA_NUMBER}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: lang },
          components,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err: any) {
    return { success: false, error: err?.response?.data?.error?.message || err.message, status: err?.response?.status };
  }
} 