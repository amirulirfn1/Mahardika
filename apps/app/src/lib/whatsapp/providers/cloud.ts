import type { WhatsAppMessage, WhatsAppProvider } from "../provider";

export function createCloudProvider(): WhatsAppProvider {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return {
    async send(msg: WhatsAppMessage) {
      if (!token || !phoneId) {
        return { ok: false as const, error: 'Cloud provider not configured' };
      }
      try {
        const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: msg.to,
            type: 'text',
            text: { body: msg.body ?? '' },
          }),
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          return { ok: false as const, error: JSON.stringify(payload) };
        }
        return { ok: true as const };
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        return { ok: false as const, error: err };
      }
    },
  };
}
