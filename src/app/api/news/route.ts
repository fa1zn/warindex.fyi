import { NextResponse } from "next/server";

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  country?: string;
  sentiment?: "positive" | "negative" | "neutral";
  category: "conflict" | "markets" | "diplomacy" | "military";
}

// GDELT API - free, no key needed, real-time global news
async function fetchGDELTNews(): Promise<NewsItem[]> {
  const keywords = [
    "war", "military", "conflict", "sanctions", "missile",
    "NATO", "Russia Ukraine", "China Taiwan", "Iran Israel",
    "defense stocks", "oil prices", "geopolitical"
  ];

  const query = keywords.join(" OR ");
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=30&format=json&sort=DateDesc`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // 5 min cache
    const data = await res.json();

    if (!data.articles) return [];

    return data.articles.map((article: any) => ({
      title: article.title,
      source: article.domain || article.source || "Unknown",
      url: article.url,
      publishedAt: article.seendate || new Date().toISOString(),
      category: categorizeArticle(article.title),
      sentiment: analyzeSentiment(article.title),
    }));
  } catch (error) {
    console.error("GDELT fetch error:", error);
    return [];
  }
}

// Backup: Fetch from multiple RSS feeds
async function fetchRSSNews(): Promise<NewsItem[]> {
  const feeds = [
    { url: "https://feeds.reuters.com/reuters/worldNews", source: "Reuters" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", source: "NYT" },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "BBC" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", source: "Al Jazeera" },
    { url: "https://feeds.washingtonpost.com/rss/world", source: "Washington Post" },
    { url: "https://rss.dw.com/xml/rss-en-world", source: "DW" },
    { url: "https://www.ft.com/world?format=rss", source: "Financial Times" },
    { url: "https://www.theguardian.com/world/rss", source: "Guardian" },
  ];

  const results: NewsItem[] = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 300 } });
      const text = await res.text();

      // Simple XML parsing for RSS - handle multiple formats
      const items = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

      for (const item of items.slice(0, 8)) {
        // Handle multiple title formats
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
          || item.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          || "";
        // Handle multiple link formats
        const link = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)?.[1]
          || item.match(/<link>(.*?)<\/link>/)?.[1]
          || item.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1]
          || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]
          || item.match(/<dc:date>(.*?)<\/dc:date>/)?.[1]
          || "";

        if (isGeopoliticalNews(title)) {
          results.push({
            title: title.trim(),
            source: feed.source,
            url: link,
            publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            category: categorizeArticle(title),
            sentiment: analyzeSentiment(title),
          });
        }
      }
    } catch (error) {
      console.error(`RSS fetch error for ${feed.source}:`, error);
    }
  }

  return results;
}

// Filter for geopolitical relevance
function isGeopoliticalNews(title: string): boolean {
  const keywords = [
    "war", "military", "conflict", "sanction", "missile", "nuclear",
    "nato", "russia", "ukraine", "china", "taiwan", "iran", "israel",
    "north korea", "troops", "defense", "attack", "strike", "invasion",
    "oil", "energy", "commodity", "geopolit", "diplomacy", "treaty",
    "army", "navy", "air force", "pentagon", "kremlin", "beijing",
    "gaza", "hamas", "hezbollah", "syria", "yemen", "houthi",
    "tariff", "trade war", "embargo", "weapons", "drone", "ballistic",
    "pakistan", "india", "kashmir", "border", "tension", "escalat",
    "ceasefire", "peace talk", "negotiat", "summit", "alliance",
    "defense contract", "lockheed", "raytheon", "boeing", "northrop",
    "crude", "brent", "opec", "lng", "pipeline", "shipping", "red sea"
  ];

  const lower = title.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

// Categorize article by content
function categorizeArticle(title: string): NewsItem["category"] {
  const lower = title.toLowerCase();

  if (lower.match(/stock|market|price|trade|econom|oil|energy|sanction/)) {
    return "markets";
  }
  if (lower.match(/diplomat|treaty|talk|negotiat|summit|agree/)) {
    return "diplomacy";
  }
  if (lower.match(/military|troop|army|navy|air force|weapon|missile|defense/)) {
    return "military";
  }
  return "conflict";
}

// Simple sentiment analysis
function analyzeSentiment(title: string): NewsItem["sentiment"] {
  const lower = title.toLowerCase();

  const negative = ["attack", "kill", "dead", "war", "strike", "bomb", "crisis", "threat", "escalat", "collapse"];
  const positive = ["peace", "agree", "deal", "ceasefire", "withdraw", "de-escalat", "talks", "progress"];

  const negCount = negative.filter(w => lower.includes(w)).length;
  const posCount = positive.filter(w => lower.includes(w)).length;

  if (negCount > posCount) return "negative";
  if (posCount > negCount) return "positive";
  return "neutral";
}

// Map news to countries
function mapToCountry(title: string): string | undefined {
  const countryMap: Record<string, string> = {
    "russia": "RUS", "russian": "RUS", "moscow": "RUS", "kremlin": "RUS", "putin": "RUS",
    "ukraine": "UKR", "ukrainian": "UKR", "kyiv": "UKR", "zelensky": "UKR",
    "china": "CHN", "chinese": "CHN", "beijing": "CHN", "xi jinping": "CHN",
    "taiwan": "TWN", "taiwanese": "TWN", "taipei": "TWN",
    "iran": "IRN", "iranian": "IRN", "tehran": "IRN", "khamenei": "IRN",
    "israel": "ISR", "israeli": "ISR", "tel aviv": "ISR", "netanyahu": "ISR", "idf": "ISR", "gaza": "ISR",
    "north korea": "PRK", "pyongyang": "PRK", "kim jong": "PRK",
    "south korea": "KOR", "korean": "KOR", "seoul": "KOR",
    "saudi": "SAU", "riyadh": "SAU", "mbs": "SAU",
    "turkey": "TUR", "turkish": "TUR", "ankara": "TUR", "erdogan": "TUR",
    "poland": "POL", "polish": "POL", "warsaw": "POL",
    "germany": "DEU", "german": "DEU", "berlin": "DEU",
    "france": "FRA", "french": "FRA", "paris": "FRA", "macron": "FRA",
    "united kingdom": "GBR", "british": "GBR", "london": "GBR", "uk": "GBR",
    "japan": "JPN", "japanese": "JPN", "tokyo": "JPN",
    "india": "IND", "indian": "IND", "delhi": "IND", "modi": "IND",
    "pakistan": "PAK", "pakistani": "PAK", "islamabad": "PAK",
    "syria": "SYR", "syrian": "SYR", "damascus": "SYR", "assad": "SYR",
    "yemen": "YEM", "yemeni": "YEM", "houthi": "YEM",
    "lebanon": "LBN", "lebanese": "LBN", "beirut": "LBN", "hezbollah": "LBN",
    "iraq": "IRQ", "iraqi": "IRQ", "baghdad": "IRQ",
    "egypt": "EGY", "egyptian": "EGY", "cairo": "EGY",
    "uae": "ARE", "emirates": "ARE", "dubai": "ARE", "abu dhabi": "ARE",
    "qatar": "QAT", "qatari": "QAT", "doha": "QAT",
    "norway": "NOR", "norwegian": "NOR", "oslo": "NOR",
    "sweden": "SWE", "swedish": "SWE", "stockholm": "SWE",
    "finland": "FIN", "finnish": "FIN", "helsinki": "FIN",
    "vietnam": "VNM", "vietnamese": "VNM", "hanoi": "VNM",
    "philippines": "PHL", "philippine": "PHL", "manila": "PHL",
    "indonesia": "IDN", "indonesian": "IDN", "jakarta": "IDN",
    "australia": "AUS", "australian": "AUS", "canberra": "AUS",
  };

  const lower = title.toLowerCase();
  for (const [keyword, code] of Object.entries(countryMap)) {
    if (lower.includes(keyword)) return code;
  }
  return undefined;
}

export async function GET() {
  try {
    // Try GDELT first, fall back to RSS
    let news = await fetchGDELTNews();

    if (news.length < 5) {
      const rssNews = await fetchRSSNews();
      news = [...news, ...rssNews];
    }

    // Add country mapping
    news = news.map(item => ({
      ...item,
      country: mapToCountry(item.title),
    }));

    // Dedupe by title similarity
    const seen = new Set<string>();
    news = news.filter(item => {
      const key = item.title.toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by date
    news.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({
      news: news.slice(0, 20),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ news: [], error: "Failed to fetch news" }, { status: 500 });
  }
}
