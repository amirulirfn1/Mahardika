import type { WhatsAppMessage, WhatsAppProvider } from "../provider";
import { getServerClient } from "@/lib/supabase/server";
import { toWaLink } from "@/src/lib/whatsapp";

export function createStubProvider(): WhatsAppProvider {
  return {
    async send(msg: WhatsAppMessage) {
      const supabase = getServerClient();
      const { data, error } = await supabase
        .from("outbound_messages")
        .insert({
          agency_id: msg.agencyId,
          channel: "whatsapp",
          to_number: msg.to,
          template: msg.template,
          body: msg.body,
          status: "sent",
        })
        .select("id")
        .single();
      // Optional log a wa.me link for convenience
      const link = toWaLink(msg.to, msg.body);
      // eslint-disable-next-line no-console
      console.log("[stub:whatsapp]", link);
      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const, id: data?.id };
    },
  };
}


