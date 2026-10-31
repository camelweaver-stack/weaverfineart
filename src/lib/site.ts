export const SITE = {
  name: "Weaver Fine Art",
  url: "https://weaverfineart.com",
  email: "camelweaver@gmail.com",
  dealer: "Chris Weaver",
  locality: "Aledo",
  region: "TX",
  description:
    "Weaver Fine Art in Aledo, Texas offers historic American regional art, including Indiana regionalists such as Floyd D. Hopper and Texas artists, with prices shown and a permanent sold archive.",
} as const;

export function canonicalUrl(pathname: string): string {
  const path = pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  return new URL(path, SITE.url).href;
}
