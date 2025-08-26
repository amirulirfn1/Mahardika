import type { WhatsAppProvider } from "./provider";
import { createCloudProvider } from "./providers/cloud";
import { createStubProvider } from "./providers/stub";

let cached: WhatsAppProvider | null = null;

export function getProvider(): WhatsAppProvider {
  if (cached) return cached;
  const name = (process.env.WHATSAPP_PROVIDER || "stub").toLowerCase();
  if (name === "cloud") {
    cached = createCloudProvider();
  } else {
    cached = createStubProvider();
  }
  return cached;
}


