import type { WhatsAppProvider } from "./provider";
import { createStubProvider } from "./providers/stub";
import { createCloudProvider } from "./providers/cloud";

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


