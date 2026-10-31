import { getCollection, type CollectionEntry } from "astro:content";

export async function getCatalog() {
  const [works, artists] = await Promise.all([getCollection("works"), getCollection("artists")]);

  const publishedArtists = artists
    .filter((artist) => !artist.data.draft)
    .sort((a, b) => a.data.sortName.localeCompare(b.data.sortName, "en"));

  const artistById = new Map(publishedArtists.map((artist) => [artist.id, artist]));

  const publishedWorks = works
    .filter((work) => !work.data.draft)
    .sort((a, b) => b.data.dateAdded.localeCompare(a.data.dateAdded) || a.data.title.localeCompare(b.data.title));

  for (const work of publishedWorks) {
    if (!artistById.has(work.data.artistSlug)) {
      throw new Error(
        `Artwork "${work.data.title}" (src/content/works/${work.id}.md) lists artistSlug "${work.data.artistSlug}", but src/content/artists/${work.data.artistSlug}.md is missing or still marked draft.`,
      );
    }
  }

  return { works: publishedWorks, artists: publishedArtists, artistById };
}

export function isListed(work: CollectionEntry<"works">): boolean {
  return work.data.status === "available" || work.data.status === "hold";
}

export function worksByArtist(works: CollectionEntry<"works">[], artistId: string) {
  return works.filter((work) => work.data.artistSlug === artistId);
}
