export type WhatsAppMessage = {
  to: string;
  template?: string;
  body?: string;
  tenantId: string;
};

export interface WhatsAppProvider {
  send(msg: WhatsAppMessage): Promise<{ ok: boolean; error?: string }>;
}
