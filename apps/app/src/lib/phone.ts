export function normalizePhone(input?: string | null): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) {
    return `60${digits.slice(1)}`;
  }
  if (!digits.startsWith("60")) {
    return `60${digits}`;
  }
  return digits;
}



