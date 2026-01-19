import Image from "next/image";
import { getGuestMessages } from "./_actions/guestbook";
import { Accounts } from "./_components/accounts/Accounts";
import AddToCalendar from "./_components/calendar/AddToCalendar";
import { Calendar } from "./_components/calendar/Calendar";
import { Section } from "./_components/common/Section";
import { Contact } from "./_components/contact/Contact";
import type { GalleryItem } from "./_components/gallery/GalleryContainer";
import { GalleryContainer } from "./_components/gallery/GalleryContainer";
import { UploadWeddingPhoto } from "./_components/gallery/UploadWeddingPhoto";
import { RollingPaper } from "./_components/guestbook/RollingPaper";
import { KakaoMap } from "./_components/location/KakaoMap";
import { LocationButtons } from "./_components/location/LocationButtons";
import { Share } from "./_components/share-invitation/Share";

// 빌드 시 생성된 이미지 메타데이터 (fs 접근 제거)
import storyGalleryData from "@/generated/story-gallery-items.json";

const getStoryGalleryItems = (): GalleryItem[] => {
  return storyGalleryData as GalleryItem[];
};

const Wedding = async () => {
  const [initialGuestMessages, storyGalleryItems] = await Promise.all([
    getGuestMessages(1, 10),
    Promise.resolve(getStoryGalleryItems()),
  ]);

  return (
    <main
      role="main"
      id="main"
      className="w-screen overflow-x-hidden min-h-svh"
    >
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-8 py-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-5xl font-bold font-great-vibes italic text-primary">
            Our Wedding Day
          </h1>
          <p className="font-playfair-display text-sm tracking-tight text-white opacity-75">
            Lee HyoungMin & Lim HeeJae
          </p>
        </div>
        <div className="h-fit overflow-hidden w-[60vw] border-2 border-white">
          <Image
            src="/images/1624.jpg"
            alt="1624.jpg"
            width={400}
            height={400}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-sm">
          <p className="font-playfair-display font-bold uppercase text-primary">
            {"You're invited to our wedding."}
          </p>
          <p className="font-pretendard text-white text-center">
            <b>
              <span>2026년 4월 19일 일요일 오전 11시</span>
            </b>
            <br />
            <span>더베르G 웨딩</span>
            <br />
            <span>서울시 영등포구 국회대로 612 2층</span>
          </p>
        </div>
      </Section>

      {/* Introduction */}
      <Section className="flex flex-col items-center justify-center gap-8 pt-4 py-20 text-xs">
        <Image
          src={"/icons/ribbon_10.svg"}
          alt="invitation"
          width={40}
          height={40}
        />

        <p className="font-pretendard whitespace-pre-line text-white text-center">
          {
            "11년이라는 긴 시간동안\n서로의 청춘을 채워준 가장 친한 친구이자 연인."
          }
        </p>

        <p className="font-pretendard whitespace-pre-line text-white text-center">
          {
            "많은 계절을 함께 보낸 저희 두 사람,\n이제 평생을 약속하는 자리에 여러분을 모십니다."
          }
        </p>
      </Section>

      {/* Opening Image */}
      <Section className="p-0!">
        <Image
          src="/images/1034.jpg"
          alt="1034.jpg"
          width={400}
          height={400}
          className="w-full h-auto"
        />
      </Section>

      {/* Bride and Groom */}
      <Section className="bg-primary w-full px-12 flex flex-col items-center font-pretendard justify-center gap-y-4">
        <div className="w-full flex items-center justify-between gap-x-4">
          <div className="flex flex-col items-start justify-center">
            <p>
              <span className="font-semibold">이병수, 이광이</span>의 아들
            </p>
            <p>
              <span className="font-semibold">이민주, 이지연</span>의 오빠
            </p>
          </div>
          <h2 className="text-3xl font-bold font-cafe24">이형민</h2>
        </div>
        <div className="w-full flex items-center justify-between gap-x-4">
          <div className="flex flex-col items-start justify-center">
            <p>
              <span className="font-semibold">임종윤, 서미경</span>의 딸
            </p>
            <p>
              <span className="font-semibold">임성재</span>의 동생
            </p>
          </div>
          <h2 className="text-3xl font-bold font-cafe24">임희재</h2>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-3 grid-rows-3 gap-3">
          <div className="col-span-3 row-span-2 w-full rounded bg-amber-50" />
          <div className="aspect-square w-full rounded bg-amber-100" />
          <div className="aspect-square w-full rounded bg-amber-200" />
          <div className="aspect-square w-full rounded bg-amber-300" />
          <div className="aspect-square w-full rounded bg-amber-400" />
          <div className="aspect-square w-full rounded bg-amber-500" />
          <div className="aspect-square w-full rounded bg-amber-600" />
          <div className="aspect-square w-full rounded bg-amber-700" />
          <div className="aspect-square w-full rounded bg-amber-800" />
          <div className="aspect-square w-full rounded bg-amber-900" />
        </div>
      </Section>

      {/* Calendar */}
      <Section className="flex flex-col items-center justify-center gap-4 bg-white text-black">
        <Section.Title
          category="Calendar"
          title="2026년 4월 19일 일요일 오전 11시"
        />
        <p className="text-center text-sm  leading-relaxed whitespace-pre-line">
          서울 영등포구 국회대로 612 지상2층, 지하1층
          <br />
          <span className="font-semibold">더베르G 웨딩</span>
        </p>
        <Calendar />
        <AddToCalendar
          title="Our Wedding Day"
          description="Our Wedding Day"
          startDate="2026-04-19 11:00"
          endDate="2026-04-19 12:30"
          location="더베르G 웨딩"
        />
      </Section>

      {/* Location */}
      <Section className="flex flex-col items-center justify-center gap-4 bg-white">
        <Section.Title
          category="Location"
          title="오시는 길"
          description={`더베르G 웨딩\n서울 영등포구 국회대로 612\n지상2층(예식장), 지하1층(연회장)`}
        />
        <KakaoMap />
        <LocationButtons
          placeName="더베르G 웨딩"
          lat={37.5257757}
          lng={126.902050869}
        />
        {/* 대중교통 */}
        {/* 주차 */}
      </Section>

      {/* Gallery */}
      <Section className="flex flex-col items-center justify-center gap-4 bg-white">
        <Section.Title category="Gallery" title="Lovely Moments" />
        <GalleryContainer items={storyGalleryItems} />
        <UploadWeddingPhoto />
      </Section>

      {/* Contact */}
      {/* Share */}
      {/* Accounts */}
      <Section className="flex flex-col items-center justify-center gap-4 bg-white">
        <Contact />
        <Accounts />
        <Share />
      </Section>

      {/* Guestbook */}
      <Section className="flex flex-col items-center justify-center gap-4 bg-white">
        <Section.Title category="Guestbook" title="축하 인사 전하기" />
        <RollingPaper initialMessages={initialGuestMessages} />
      </Section>
    </main>
  );
};

export default Wedding;
