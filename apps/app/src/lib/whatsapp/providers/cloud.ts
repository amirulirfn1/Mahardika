import type { WhatsAppMessage, WhatsAppProvider } from "../provider";
import { getServerClient } from "@/lib/supabase/server";

export function createCloudProvider(): WhatsAppProvider {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return {
    async send(msg: WhatsAppMessage) {
      const supabase = getServerClient();
      if (!token || !phoneId) {
        const { data } = await supabase
          .from("outbound_messages")
          .insert({
            agency_id: msg.agencyId,
            channel: "whatsapp",
            to_number: msg.to,
            template: msg.template,
            body: msg.body,
            status: "failed",
            error: "Cloud provider not configured",
          })
          .select("id")
          .single();
        return { ok: false as const, error: "Cloud provider not configured", id: data?.id };
      }
      try {
        const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: msg.to,
            type: "text",
            text: { body: msg.body ?? "" },
          }),
        });
        const ok = res.ok;
        const payload = await res.json().catch(() => ({}));
        const status = ok ? "sent" : "failed";
        const error = ok ? null : JSON.stringify(payload);
        const { data } = await supabase
          .from("outbound_messages")
          .insert({
            agency_id: msg.agencyId,
            channel: "whatsapp",
            to_number: msg.to,
            template: msg.template,
            body: msg.body,
            status,
            error,
          })
          .select("id")
          .single();
        return { ok: ok as boolean, id: data?.id, error: error ?? undefined };
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        const { data } = await supabase
          .from("outbound_messages")
          .insert({
            agency_id: msg.agencyId,
            channel: "whatsapp",
            to_number: msg.to,
            template: msg.template,
            body: msg.body,
            status: "failed",
            error: err,
          })
          .select("id")
          .single();
        return { ok: false as const, id: data?.id, error: err };
      }
    },
  };
}


