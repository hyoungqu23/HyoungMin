import SAMPLE_IMAGE from "../../public/images/sample.jpg";
import { Accounts } from "./_components/accounts/Accounts";
import AddToCalendar from "./_components/calendar/AddToCalendar";
import { Calendar } from "./_components/calendar/Calendar";
import { FlowerFrame } from "./_components/common/FlowerFrame";
import { Section } from "./_components/common/Section";
import { TypingAnimation } from "./_components/common/TypingText";
import { Contact } from "./_components/contact/Contact";
import { GalleryContainer } from "./_components/gallery/GalleryContainer";
import { KakaoMap } from "./_components/location/KakaoMap";
import { LocationButtons } from "./_components/location/LocationButtons";
import { Story } from "./_components/our-stories/Story";
import { Share } from "./_components/share-invitation/Share";

const Wedding = () => {
  return (
    <main role="main" id="main" className="w-screen min-h-svh">
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <FlowerFrame imageSrc={SAMPLE_IMAGE.src} />
        <h1 className="text-4xl font-bold italic font-serif tracking-tight">
          Our Wedding Day
        </h1>
      </Section>

      {/* Wedding Introduction */}
      <Section className="flex flex-col items-center justify-center gap-24">
        <p className="text-center text-lg">
          <span className="font-bold">2015년 겨울</span>, 버건디 코트를 입고
          만나
          <br />
          함께 웃으며 <span className="text-rose-400 font-semibold">11번</span>
          의 봄날을 보내고
          <br />
          <span className="font-bold">2026년 봄</span>,{" "}
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
        <Section.Title
          category="Calendar"
          title="Our Wedding Day"
          description={`2026년 4월 19일 일요일 오전 11시\n더베르G 웨딩\n서울 영등포구 국회대로 612 지상2층, 지하1층`}
        />
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
      <Section className="flex flex-col items-center justify-center gap-4">
        <Story />
      </Section>

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
      </Section>
    </main>
  );
};

export default Wedding;
