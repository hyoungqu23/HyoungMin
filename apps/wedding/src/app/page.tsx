import SAMPLE_IMAGE from "../../public/images/sample.jpg";
import { getGuestMessages } from "./_actions/guestbook";
import { Accounts } from "./_components/accounts/Accounts";
import AddToCalendar from "./_components/calendar/AddToCalendar";
import { Calendar } from "./_components/calendar/Calendar";
// import { FlowerFrame } from "./_components/common/FlowerFrame";
import Image from "next/image";
import { Section } from "./_components/common/Section";
import { TypingAnimation } from "./_components/common/TypingText";
import { WeddingProgressBar } from "./_components/common/WeddingProgressBar";
import { Contact } from "./_components/contact/Contact";
import { GalleryContainer } from "./_components/gallery/GalleryContainer";
import { RollingPaper } from "./_components/guestbook/RollingPaper";
import { KakaoMap } from "./_components/location/KakaoMap";
import { LocationButtons } from "./_components/location/LocationButtons";
import { Share } from "./_components/share-invitation/Share";

const Wedding = async () => {
  const initialGuestMessages = await getGuestMessages(1, 10);

  return (
    <main
      role="main"
      id="main"
      className="w-screen overflow-x-hidden min-h-svh"
    >
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-4 py-0!">
        {/* <FlowerFrame imageSrc={SAMPLE_IMAGE.src} /> */}
        <div className="relative w-screen h-screen overflow-hidden">
          <Image
            src={SAMPLE_IMAGE.src}
            alt="Wedding Day"
            width={300}
            height={500}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/15" />
          <h1 className="absolute top-20 left-1/2 -translate-x-1/2 w-full text-center text-4xl font-bold font-yeongwol italic text-rose-50">
            Our Wedding Day
          </h1>
        </div>
      </Section>

      {/* Wedding Introduction */}
      <Section className="flex flex-col items-center justify-center gap-24">
        <p className="text-center text-lg">
          <span className="font-bold">2015년 겨울</span>, 버건디 코트를 입고
          만나
          <br />
          <span className="text-rose-400 font-semibold">열한 번째</span>{" "}
          <span className="font-bold">2026년</span> 봄에,
          <br />
          <span className="text-rose-400 font-semibold">하나</span>가 됩니다.
        </p>
        <div className="w-full px-12 flex flex-col items-center justify-center gap-y-4">
          <div className="w-full flex items-center justify-between gap-x-4">
            <div className="flex flex-col items-start justify-center">
              <p>
                <span className="font-semibold">이병수, 이광이</span>의 아들
              </p>
              <p>
                <span className="font-semibold">이민주, 이지연</span>의 오빠
              </p>
            </div>
            <h2 className="text-3xl font-bold">
              <TypingAnimation>이형민</TypingAnimation>
            </h2>
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
            <h2 className="text-3xl font-bold">
              <TypingAnimation>임희재</TypingAnimation>
            </h2>
          </div>
        </div>
      </Section>

      {/* Calendar */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Calendar" title="Our Wedding Day" />
        <p className="text-center text-stone-800 leading-relaxed whitespace-pre-line">
          서울 영등포구 국회대로 612 지상2층, 지하1층
          <br />
          <span className="font-semibold">더베르G 웨딩</span>
        </p>
        <h3 className="text-lg font-semibold text-stone-800">
          2026년 4월 19일 일요일 오전 11시
        </h3>
        <WeddingProgressBar />
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
      <Section className="flex flex-col items-center justify-center gap-4">
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

      {/* Our Story */}
      {/* <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Love Story" title="우리가 걸어온 길" />
        <Story />
      </Section> */}

      {/* Gallery */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Gallery" title="Lovely Moments" />
        <GalleryContainer />
      </Section>

      {/* Contact */}
      {/* Share */}
      {/* Accounts */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Contact />
        <Accounts />
        <Share />
      </Section>

      {/* Guestbook */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Guestbook" title="축하 인사 전하기" />
        <RollingPaper initialMessages={initialGuestMessages} />
      </Section>
    </main>
  );
};

export default Wedding;
