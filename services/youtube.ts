import { YouTubeVideo } from "../types/video";

export async function getLatestVideos(): Promise<YouTubeVideo[]> {
  const channelId = "UCTlNScos3pvlTWnZW18F0Kg"; // The real Mogzz channel ID
  try {
    // If API key is present, we could use the data API, but to guarantee real data
    // right now without requiring an API key, we will use the official YouTube RSS feed.
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch RSS feed:", res.status);
      return [];
    }

    const xml = await res.text();

    // Parse the XML with regex (since this is a server component and we want to avoid extra dependencies)
    // The feed contains <entry> elements
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [...xml.matchAll(entryRegex)].map(m => m[1]);

    const videos: YouTubeVideo[] = entries.slice(0, 10).map((entry) => {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const pubMatch = entry.match(/<published>([^<]+)<\/published>/);

      const id = idMatch ? idMatch[1] : '';
      const title = titleMatch ? titleMatch[1] : '';
      const publishedAt = pubMatch ? pubMatch[1] : '';

      const url = `https://www.youtube.com/watch?v=${id}`;

      return {
        id,
        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
        description: '', // RSS doesn't give full description cleanly, but we don't use it in UI anyway
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        publishedAt,
        url,
      };
    });

    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}
