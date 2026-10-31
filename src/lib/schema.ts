import type { CollectionEntry } from "astro:content";
import { schemaAvailability } from "./format";
import { SITE } from "./site";

export function galleryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ArtGallery",
    "@id": `${SITE.url}/#gallery`,
    name: SITE.name,
    url: `${SITE.url}/`,
    image: `${SITE.url}/og.jpg`,
    email: SITE.email,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: "US",
    },
    founder: {
      "@type": "Person",
      name: SITE.dealer,
    },
  };
}

export function personJsonLd(artist: CollectionEntry<"artists">) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.data.name,
    url: `${SITE.url}/artists/${artist.id}/`,
    description: artist.data.summary,
    ...(artist.data.birthDate ? { birthDate: artist.data.birthDate } : {}),
    ...(artist.data.deathDate ? { deathDate: artist.data.deathDate } : {}),
    ...(artist.data.birthPlace
      ? {
          birthPlace: {
            "@type": "Place",
            name: artist.data.birthPlace,
          },
        }
      : {}),
    ...(artist.data.sources[0]
      ? {
          subjectOf: {
            "@type": "Article",
            name: artist.data.sources[0].title,
            url: artist.data.sources[0].url,
            ...(artist.data.sources[0].publisher
              ? {
                  publisher: {
                    "@type": "Organization",
                    name: artist.data.sources[0].publisher,
                  },
                }
              : {}),
          },
        }
      : {}),
  };
}

export function artworkJsonLd(
  work: CollectionEntry<"works">,
  artist: CollectionEntry<"artists">,
  imageUrl: string,
) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    availability: schemaAvailability(work.data.status),
    priceCurrency: "USD",
    url: `${SITE.url}/works/${work.id}/`,
    seller: { "@id": `${SITE.url}/#gallery` },
  };

  if (typeof work.data.price === "number") {
    offer.price = work.data.price;
  }

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.data.title,
    url: `${SITE.url}/works/${work.id}/`,
    image: imageUrl,
    description: workDescription(work),
    artMedium: work.data.medium,
    artform: work.data.medium,
    ...(work.data.year ? { dateCreated: String(work.data.year) } : {}),
    artist: {
      "@type": "Person",
      name: artist.data.name,
      url: `${SITE.url}/artists/${artist.id}/`,
    },
    width: {
      "@type": "QuantitativeValue",
      value: work.data.imageWidthIn,
      unitCode: "INH",
      unitText: "in",
    },
    height: {
      "@type": "QuantitativeValue",
      value: work.data.imageHeightIn,
      unitCode: "INH",
      unitText: "in",
    },
    additionalProperty: [
      ...(work.data.frameWidthIn && work.data.frameHeightIn
        ? [
            {
              "@type": "PropertyValue",
              name: "Frame size",
              value: `${work.data.frameWidthIn} × ${work.data.frameHeightIn} in`,
            },
          ]
        : []),
      {
        "@type": "PropertyValue",
        name: "Condition",
        value: work.data.condition,
      },
      {
        "@type": "PropertyValue",
        name: "Signature",
        value: work.data.signature,
      },
    ],
    offers: offer,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).href,
    })),
  };
}

export function workDescription(work: CollectionEntry<"works">): string {
  const price =
    typeof work.data.price === "number"
      ? `Priced at ${work.data.price} USD.`
      : work.data.status === "sold"
        ? "Sold. Price not published."
        : "Price on request.";
  return `${work.data.title}, ${work.data.medium.toLowerCase()} by ${work.data.artist}. Image ${work.data.imageWidthIn} × ${work.data.imageHeightIn} inches. ${work.data.condition} ${price} Weaver Fine Art, Aledo, Texas.`;
}
