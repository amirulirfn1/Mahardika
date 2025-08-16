export type WhatsAppMessage = {
  to: string;
  template?: string;
  body?: string;
  agencyId: string;
};

export interface WhatsAppProvider {
  send(msg: WhatsAppMessage): Promise<{ ok: boolean; id?: string; error?: string }>;
}


