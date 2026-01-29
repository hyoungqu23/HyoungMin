import storyGalleryData from "@/generated/story-gallery-items.json";
import Link from "next/link";
import { Section } from "../_components/common/Section";
import type { GalleryItem } from "../_components/gallery/GalleryContainer";
import { GalleryContainer } from "../_components/gallery/GalleryContainer";

const getStoryGalleryItems = (): GalleryItem[] => {
  return storyGalleryData as GalleryItem[];
};

const MomentsPage = () => {
  const storyGalleryItems = getStoryGalleryItems();

  return (
    <main
      role="main"
      id="moments"
      className="w-screen overflow-x-hidden min-h-svh bg-white"
    >
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="w-full text-center font-great-vibes text-xl text-primary">
            Moments
          </h1>
        </div>
      </header>

      {/* Gallery Section */}
      <Section className="flex flex-col items-center justify-center gap-6 py-8">
        <Section.Title category="2015. 12. 26 ~ 2026. 04. 19" title="" />
        <GalleryContainer items={storyGalleryItems} initialVisibleCount={20} />
      </Section>
    </main>
  );
};

export default MomentsPage;
