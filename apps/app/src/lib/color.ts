export function toHslChannels(input?: string): string {
  const DEFAULT = "258 94% 66%"; // violet-600-ish
  if (!input) return DEFAULT;
  const v = input.trim().toLowerCase();

  const named: Record<string, string> = {
    violet: "258 94% 66%",
    indigo: "243 75% 59%",
    blue: "217 91% 60%",
    fuchsia: "292 84% 61%",
    emerald: "152 76% 40%",
    rose: "347 77% 54%",
    amber: "37 92% 50%",
    purple: "270 89% 60%",
    cyan: "188 94% 42%",
  };
  if (named[v]) return named[v];

  // h s l (optionally with % signs on s,l)
  const hslMatch = v.match(/^(\d{1,3})(?:\s+)(\d{1,3})%?(?:\s+)(\d{1,3})%?$/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) % 360;
    const s = Math.max(0, Math.min(100, parseInt(hslMatch[2], 10)));
    const l = Math.max(0, Math.min(100, parseInt(hslMatch[3], 10)));
    // avoid unreadable (too light or near-grey)
    if (l > 90 || (s < 10 && l > 80)) return DEFAULT;
    return `${h} ${s}% ${l}%`;
  }

  // hex #rgb or #rrggbb
  const hexMatch = v.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r: number, g: number, b: number;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    const { h, s, l } = rgbToHsl(r, g, b);
    if (l > 90 || (s < 10 && l > 80)) return DEFAULT;
    return `${h} ${s}% ${l}%`;
  }

  // some CSS color names that often pop up
  if (v === "white" || v === "#fff" || v === "#ffffff") return DEFAULT;
  if (v === "black") return "0 0% 0%";

  // fallback
  return DEFAULT;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
