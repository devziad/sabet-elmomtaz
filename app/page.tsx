import { Hero } from "../components/hero/Hero";
import { AnnouncementSection } from "../components/announcement/AnnouncementSection";
import { CharacterStrip } from "../components/character/CharacterStrip";
import { FeaturedGuests } from "../components/guests/FeaturedGuests";
import { getLatestVideos } from "../services/youtube";

export default async function Home() {
  // Fetch videos dynamically on the server
  const videos = await getLatestVideos();

  return (
    <main>
      <Hero videos={videos} />
      <AnnouncementSection />
      <CharacterStrip />
      <FeaturedGuests />
    </main>
  );
}
