import Image from "next/image";
import Link from "next/link";
import { getGuestMessages } from "./_actions/guestbook";
import { Accounts } from "./_components/accounts/Accounts";
import AddToCalendar from "./_components/calendar/AddToCalendar";
import { Calendar } from "./_components/calendar/Calendar";
import { Accordion } from "./_components/common/Accordion";
import { Section } from "./_components/common/Section";
import { Contact } from "./_components/contact/Contact";
import { GridGallery } from "./_components/gallery/GridGallery";
import { UploadWeddingPhoto } from "./_components/gallery/UploadWeddingPhoto";
import { RollingPaper } from "./_components/guestbook/RollingPaper";
import { WriteOurName } from "./_components/hero/WriteOurName";
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
      <Section className="flex flex-col items-center justify-center gap-8 py-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-5xl font-bold font-great-vibes italic text-primary">
            Our Wedding Day
          </h1>
          <p className="font-playfair-display text-sm tracking-tight text-white opacity-75">
            Lee HyoungMin & Lim HeeJae
          </p>
        </div>

        <Image
          src="/images/main.webp"
          alt="main.webp"
          width={1200}
          height={800}
          priority
          className="w-full h-auto"
        />

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
            "'너'와 '나'에서 '우리'가 된 지 열한 해\n이제는 부부라는 이름으로 손 꼭 잡고 함께 걷고자 합니다."
          }
        </p>
        <p className="font-pretendard whitespace-pre-line text-white text-center">
          {
            "소중한 걸음 하시어 축복해 주세요.\n그 마음 깊이 간직하며 예쁘고 행복하게 살겠습니다."
          }
        </p>
      </Section>

      {/* Opening Image */}
      <Section className="p-0!">
        <Image
          src="/images/curtain.webp"
          alt="curtain.webp"
          width={1000}
          height={1000}
          priority
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
          <h2 className="text-3xl font-bold font-cafe24">
            <WriteOurName name="groom" />
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
          <h2 className="text-3xl font-bold font-cafe24">
            <WriteOurName name="bride" />
          </h2>
        </div>
      </Section>

      <Section className="flex flex-col gap-4">
        <GridGallery
          items={[
            { id: 0, src: "/images/gallery/0428.webp" },
            { id: 1, src: "/images/gallery/0107.webp" },
            { id: 2, src: "/images/gallery/0333.webp" },
            { id: 3, src: "/images/gallery/0516.webp" },
            { id: 4, src: "/images/gallery/0554.webp" },
            { id: 5, src: "/images/gallery/0578.webp" },
            { id: 6, src: "/images/gallery/0664.webp" },
            { id: 7, src: "/images/gallery/0713.webp" },
            { id: 8, src: "/images/gallery/0984.webp" },
            { id: 9, src: "/images/gallery/1034.webp" },
            { id: 10, src: "/images/gallery/1210.webp" },
            { id: 11, src: "/images/gallery/1230.webp" },
            { id: 12, src: "/images/gallery/1399.webp" },
            { id: 13, src: "/images/gallery/1435.webp" },
            { id: 14, src: "/images/gallery/1523.webp" },
            { id: 15, src: "/images/gallery/1787.webp" },
          ]}
        />

        <Link
          href="/moments"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary text-white font-pretendard font-medium rounded-full hover:bg-primary/80 transition-all duration-300"
        >
          더 많은 사진 보러가기
        </Link>
      </Section>

      <div className="bg-white">
        {/* Calendar */}
        <Section className="flex flex-col items-center justify-center gap-4">
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
        <Section className="flex flex-col items-center justify-center gap-4">
          <Section.Title
            category="Location"
            title="오시는 길"
            description={`더베르G 웨딩\n서울 영등포구 국회대로 612 코레일유통사옥\n지상2층(예식장), 지하1층(연회장)`}
          />
          <KakaoMap />
          <LocationButtons
            placeName="더베르G 웨딩"
            lat={37.5257757}
            lng={126.902050869}
          />

          <Accordion name="location" title="약도">
            <Image
              src="/images/location.webp"
              alt="약도"
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </Accordion>

          {/* 대중교통 및 주차 안내 */}
          <ul className="flex flex-col gap-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2">
            <li>
              <h3>자차로 오시는 길</h3>
              <ul className="list-disc list-inside text-xs flex flex-col gap-1 text-gray-600">
                <li>네비게이션 [더베르G] 검색</li>
                <li>국회대로 612 코레일유통사옥 2층 / 당산동34가 2-7</li>
              </ul>
            </li>
            <li>
              <h3>지하철로 오시는 길</h3>
              <ul className="list-disc list-inside text-xs flex flex-col gap-1 text-gray-600">
                <li>2, 5호선 영등포구청역 4번 출구에서 566m(도보 약 7분)</li>
              </ul>
            </li>
            <li>
              <h3>버스로 오시는 길</h3>
              <ul className="list-disc list-inside text-xs flex flex-col gap-1 text-gray-600">
                <li>서울시립청소년 문화센터[19-439]: 간선 660</li>
                <li>하이서울유스호스텔[19-127]: 일반 5</li>
                <li>
                  신화병원[19-121]: 좌석 700, 간선 605, 간선 661, 간선 760,{" "}
                  <br />
                  <span className="pl-28">지선 5616, 지선 5714</span>
                </li>
                <li>삼환아파트[19-125]: 직행 9030, 직행 8000</li>
              </ul>
            </li>
            <li>
              <h3>셔틀버스 안내</h3>
              <ul className="list-disc list-inside text-xs flex flex-col gap-1 text-gray-600">
                <li>
                  2, 5호선 영등포구청역 5번 출구 뒤 ↔ 더베르G 주차장 입구 좌측
                </li>
                <li>2대 운행</li>
              </ul>
            </li>
          </ul>
        </Section>

        {/* Contact */}
        {/* Share */}
        {/* Accounts */}
        <Section className="flex flex-col items-center justify-center gap-4 py-0!">
          <Contact />
          <Accounts />
          <Share />
        </Section>

        {/* Guestbook */}
        <Section className="flex flex-col items-center justify-center gap-4">
          <Section.Title category="Guestbook" title="축하 인사 전하기" />
          <UploadWeddingPhoto />
          <RollingPaper initialMessages={initialGuestMessages} />
        </Section>
      </div>
    </main>
  );
};

export default Wedding;
