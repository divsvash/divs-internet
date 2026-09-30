import { NextResponse } from "next/server";

function value(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, "i"));
  return match?.[1]?.trim().replace(/<!\[CDATA\[|\]\]>/g, "") ?? "";
}

function decode(text: string) {
  return text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export async function GET() {
  try {
    const response = await fetch("https://letterboxd.com/divsvash/rss/", {
      headers: { Accept: "application/rss+xml, application/xml;q=0.9", "User-Agent": "divs-internet" },
      next: { revalidate: 1800 },
    });
    if (!response.ok) throw new Error(`Letterboxd returned ${response.status}`);
    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 10).map((match) => {
      const item = match[1];
      return {
        title: decode(value(item, "letterboxd:filmTitle") || value(item, "title")),
        rating: value(item, "letterboxd:memberRating"),
        watchedDate: value(item, "letterboxd:watchedDate"),
        publishedAt: value(item, "pubDate"),
        link: decode(value(item, "link")),
      };
    }).filter((item) => item.title && item.link);
    if (!items.length) throw new Error("The configured Letterboxd feed returned no diary entries.");
    return NextResponse.json({ source: "LIVE", fetchedAt: new Date().toISOString(), items }, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=7200" } });
  } catch (error) {
    return NextResponse.json({ source: "UNAVAILABLE", error: error instanceof Error ? error.message : "Letterboxd could not be reached." }, { status: 502 });
  }
}
