import AddToCalendar from "./_components/calendar/AddToCalendar";
import { Calendar } from "./_components/calendar/Calendar";
import { GalleryContainer } from "./_components/gallery/GalleryContainer";
import { LocationButtons } from "./_components/location/LocationButtons";
import { Section } from "./_components/common/Section";
import { Story } from "./_components/our-stories/Story";
import { HorizontalScroll } from "./_components/common/HorizontalScroll";
import { TypingAnimation } from "./_components/common/TypingText";
import { Accounts } from "./_components/accounts/Accounts";
import { Contact } from "./_components/contact/Contact";
import { Share } from "./_components/share-invitation/Share";

const COLOR_CARDS = [
  { id: 1, color: "bg-rose-300", title: "Rose" },
  { id: 2, color: "bg-orange-200", title: "Peach" },
  { id: 3, color: "bg-amber-200", title: "Cream" },
  { id: 4, color: "bg-emerald-200", title: "Mint" },
  { id: 5, color: "bg-sky-200", title: "Sky" },
  { id: 6, color: "bg-indigo-200", title: "Lavender" },
  { id: 7, color: "bg-purple-300", title: "Violet" },
  { id: 8, color: "bg-stone-300", title: "Stone" },
];

const Wedding = () => {
  return (
    <main role="main" id="main" className="w-screen min-h-svh">
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-4">
        {/* <Image
          src="/images/sample.jpg" // 본식/스튜디오 사진 경로
          alt="Wedding Day"
          width={300}
          height={450}
          className="object-cover"
          priority // 메인 이미지는 priority 필수
        /> */}
        <div className="w-full h-full bg-rose-300 rounded-3xl shadow-sm aspect-3/4" />
        <h1 className="text-4xl font-bold italic">Our Wedding Day</h1>
      </Section>

      {/* Wedding Introduction */}
      <Section className="flex flex-col items-center justify-center gap-24">
        <TypingAnimation>
          <>
            <p key="introduction">
              2015년 겨울, 와인색 코트를 입고 만나,
              <br />
              함께 웃으며 11번의 봄날을 보내고
              <br />
              2026년 봄, 하나가 됩니다.
            </p>
            <div
              className="w-full px-12 flex flex-col items-center justify-center"
              key="groom"
            >
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
              <div
                className="w-full flex items-center justify-between gap-x-4"
                key="bride"
              >
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
          </>
        </TypingAnimation>
      </Section>

      {/* Our Story */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Story />
      </Section>

      <HorizontalScroll speed={400} direction="left">
        {/* 시작 카드 (타이틀) */}
        <div className="flex h-full w-[40vh] shrink-0 flex-col justify-center bg-white border-4 border-stone-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-stone-800">
            Colorful
            <br />
            Moments
          </h2>
        </div>

        {/* 컬러 박스들 (Map) */}
        {COLOR_CARDS.map((card) => (
          <div
            key={card.id}
            className={`
              relative h-full w-[50vh] shrink-0 
              flex items-center justify-center 
              rounded-3xl shadow-lg ${card.color}
              transform transition-transform hover:scale-105
            `}
          >
            <span className="text-4xl font-bold text-white drop-shadow-md">
              {card.id}. {card.title}
            </span>
          </div>
        ))}

        {/* 끝 카드 */}
        <div className="flex h-full w-[40vh] shrink-0 items-center justify-center bg-stone-100 rounded-3xl">
          <p className="text-xl font-medium text-stone-400">End of Gallery</p>
        </div>
      </HorizontalScroll>

      {/* Calendar */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title
          category="Calendar"
          title="Our Wedding Day"
          description={`2026년 4월 19일 일요일 오전 11시\n더베르G 웨딩\n서울 영등포구 국회대로 612 지상2층,지하1층`}
        />
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
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Gallery" title="Lovely Moments" />
        <GalleryContainer />
      </Section>

      {/* Location */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title
          category="Location"
          title="오시는 길"
          description={`더베르G 웨딩\n서울 영등포구 국회대로 612\n지상2층(예식장), 지하1층(연회장)`}
        />
        {/* TODO: 네이버지도 혹은 카카오맵 API 추가 */}
        <LocationButtons
          placeName="더베르G 웨딩"
          address="서울 영등포구 국회대로 612 지상2층,지하1층"
          lat={37.5257757}
          lng={126.902050869}
        />
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
