export type Price = number | "Inquire";
export type WorkStatus = "available" | "hold" | "sold";
export type SizeBand = "small" | "medium" | "large";
export type PriceBand = "under-1000" | "1000-5000" | "5000-15000" | "over-15000" | "inquire";

const FRACTIONS: Record<string, string> = {
  "0.25": "¼",
  "0.5": "½",
  "0.75": "¾",
};

export function formatInches(value: number): string {
  const whole = Math.floor(value);
  const fraction = Math.round((value - whole) * 100) / 100;
  if (fraction === 0) return String(whole);
  const glyph = FRACTIONS[String(fraction)];
  if (!glyph) {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  return whole === 0 ? glyph : `${whole}${glyph}`;
}

export function formatSize(width: number, height: number): string {
  return `${formatInches(width)} × ${formatInches(height)} in`;
}

export function formatPrice(price: Price, status?: WorkStatus): string {
  if (typeof price === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  }
  return "Price not published";
}

export function priceBand(price: Price): PriceBand {
  if (typeof price !== "number") return "inquire";
  if (price < 1000) return "under-1000";
  if (price <= 5000) return "1000-5000";
  if (price <= 15000) return "5000-15000";
  return "over-15000";
}

/** Longer side of the image, not the frame. */
export function sizeBand(widthIn: number, heightIn: number): SizeBand {
  const longer = Math.max(widthIn, heightIn);
  if (longer < 16) return "small";
  if (longer <= 30) return "medium";
  return "large";
}

export function statusLabel(status: WorkStatus): string {
  if (status === "hold") return "On hold";
  if (status === "sold") return "Sold";
  return "Available";
}

export function formatSoldOn(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function schemaAvailability(status: WorkStatus): string {
  if (status === "sold") return "https://schema.org/SoldOut";
  if (status === "hold") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}
