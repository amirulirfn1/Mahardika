import { toWaLink } from "@/lib/whatsapp";

import type { WhatsAppMessage, WhatsAppProvider } from "../provider";

export function createStubProvider(): WhatsAppProvider {
  return {
    async send(msg: WhatsAppMessage) {
      // eslint-disable-next-line no-console
      console.log('[stub:whatsapp]', toWaLink(msg.to, msg.body));
      return { ok: true as const };
    },
  };
}
