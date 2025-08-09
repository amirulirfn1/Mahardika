export function toWaLink(input: string, message?: string): string {
  const digits = (input || "").replace(/\D/g, "");
  let normalized = digits;
  if (normalized.startsWith("0")) {
    normalized = `60${normalized.slice(1)}`;
  } else if (!normalized.startsWith("60")) {
    normalized = `60${normalized}`;
  }
  const base = `https://wa.me/${normalized}`;
  if (message && message.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
