import Image from "next/image";
import AddToCalendar from "./_components/AddToCalendar";
import { Calendar } from "./_components/Calendar";
import { GalleryContainer } from "./_components/GalleryContainer";
import { LocationButtons } from "./_components/LocationButtons";
import { Section } from "./_components/Section";
import { ShareButtons } from "./_components/ShareButtons";
import { Story } from "./_components/Story";
import { TypingText } from "./_components/TypingText";

const Wedding = () => {
  return (
    <main
      role="main"
      id="main"
      className="w-screen overflow-x-hidden min-h-svh"
    >
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Image
          src="/images/sample.jpg" // 본식/스튜디오 사진 경로
          alt="Wedding Day"
          width={300}
          height={450}
          className="object-cover"
          priority // 메인 이미지는 priority 필수
        />
        <h1 className="text-4xl font-bold italic">Our Wedding Day</h1>
      </Section>

      {/* Wedding Introduction */}
      <Section className="flex flex-col items-center justify-center gap-24">
        <TypingText
          text={`2015년 겨울, 와인색 코트를 입고 만나,\n\n함께 웃으며 11번의 봄날을 보내고\n\n2026년 봄, 하나가 됩니다.`}
          speed={0.05}
          delay={0}
          className="text-center text-lg"
        />
        <div className="w-full px-12 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between gap-x-4">
            <div className="flex flex-col items-start justify-center">
              <p>
                <span className="font-semibold">이병수, 이광이</span>의 아들
              </p>
              <p>
                <span className="font-semibold">이민주, 이지연</span>의 오빠
              </p>
            </div>
            <h2 className="font-bold text-2xl">이형민</h2>
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
            <h2 className="font-bold text-2xl">임희재</h2>
          </div>
        </div>
      </Section>

      {/* Our Story */}
      <Section>
        <Story />
      </Section>

      {/* Calendar */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <h2>Calendar</h2>
        <Calendar />

        <h3 className="text-center text-lg">
          2026년 4월 19일 일요일 오전 11시
        </h3>

        <AddToCalendar
          title="Our Wedding Day"
          description="Our Wedding Day"
          startDate="2026-04-19 11:00"
          endDate="2026-04-19 12:30"
          location="더베르G 웨딩"
        />
      </Section>

      {/* Gallery */}
      <Section className="flex flex-col items-center gap-4">
        <h2>Gallery</h2>

        <GalleryContainer />
      </Section>

      {/* Location */}
      <Section>
        <h2>Location</h2>

        <LocationButtons
          placeName="더베르G 웨딩"
          address="서울 영등포구 국회대로 612 지상2층,지하1층"
          lat={37.5257757}
          lng={126.902050869}
        />
      </Section>

      {/* Accounts */}
      <Section>
        <h2>Accounts</h2>
      </Section>

      {/* Share */}
      <Section className="flex flex-col items-center gap-6">
        <h2>Share</h2>
        <p className="text-stone-500 text-center">
          소중한 분들에게 저희의 결혼 소식을 전해주세요
        </p>
        <ShareButtons />
      </Section>

      {/* Contact */}
      <Section>
        <h2>Contact</h2>
      </Section>

      {/* Guestbook */}
      <Section>
        <h2>Guestbook</h2>
      </Section>
    </main>
  );
};

export default Wedding;
