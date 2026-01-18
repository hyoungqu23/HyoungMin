import Image from "next/image";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
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

const STORIES_DIR = path.join(process.cwd(), "public", "images", "stories");

const readHead = async (filePath: string, bytes = 64 * 1024) => {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(bytes);
    const { bytesRead } = await handle.read(buffer, 0, bytes, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
};

const getPngSize = (buf: Buffer) => {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47)
    return null;
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
};

const getGifSize = (buf: Buffer) => {
  if (buf.length < 10) return null;
  const header = buf.toString("ascii", 0, 6);
  if (header !== "GIF87a" && header !== "GIF89a") return null;
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  return { width, height };
};

const getJpegSize = (buf: Buffer) => {
  if (buf.length < 4) return null;
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null; // SOI
  let offset = 2;

  const isSof = (marker: number) =>
    marker === 0xc0 || // SOF0
    marker === 0xc1 || // SOF1
    marker === 0xc2 || // SOF2
    marker === 0xc3 ||
    marker === 0xc5 ||
    marker === 0xc6 ||
    marker === 0xc7 ||
    marker === 0xc9 ||
    marker === 0xca ||
    marker === 0xcb ||
    marker === 0xcd ||
    marker === 0xce ||
    marker === 0xcf;

  while (offset + 3 < buf.length) {
    // find next marker 0xFF
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    // skip fill bytes 0xFF
    while (offset < buf.length && buf[offset] === 0xff) offset += 1;
    const marker = buf[offset];
    offset += 1;

    // stand-alone markers
    if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
    if (offset + 1 >= buf.length) break;

    const size = buf.readUInt16BE(offset);
    if (size < 2) break;

    if (isSof(marker)) {
      if (offset + 7 >= buf.length) return null;
      const height = buf.readUInt16BE(offset + 3);
      const width = buf.readUInt16BE(offset + 5);
      return { width, height };
    }

    offset += size;
  }
  return null;
};

const getWebpSize = (buf: Buffer) => {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  let offset = 12;
  while (offset + 8 <= buf.length) {
    const chunkType = buf.toString("ascii", offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (chunkType === "VP8X") {
      if (dataOffset + 10 > buf.length) return null;
      const width = 1 + buf.readUIntLE(dataOffset + 4, 3);
      const height = 1 + buf.readUIntLE(dataOffset + 7, 3);
      return { width, height };
    }

    if (chunkType === "VP8L") {
      // Lossless bitstream header (5 bytes) after chunk header
      if (dataOffset + 5 > buf.length) return null;
      if (buf[dataOffset] !== 0x2f) return null; // signature
      const b0 = buf[dataOffset + 1];
      const b1 = buf[dataOffset + 2];
      const b2 = buf[dataOffset + 3];
      const b3 = buf[dataOffset + 4];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width, height };
    }

    if (chunkType === "VP8 ") {
      // Lossy frame header: after 3 bytes frame tag, 3 bytes start code, then 2+2 bytes width/height
      if (dataOffset + 10 > buf.length) return null;
      if (
        buf[dataOffset + 3] !== 0x9d ||
        buf[dataOffset + 4] !== 0x01 ||
        buf[dataOffset + 5] !== 0x2a
      )
        return null;
      const width = buf.readUInt16LE(dataOffset + 6) & 0x3fff;
      const height = buf.readUInt16LE(dataOffset + 8) & 0x3fff;
      return { width, height };
    }

    // chunks are padded to even size
    offset = dataOffset + chunkSize + (chunkSize % 2);
  }
  return null;
};

const getImageSize = async (filePath: string) => {
  const buf = await readHead(filePath);
  return (
    getWebpSize(buf) || getPngSize(buf) || getJpegSize(buf) || getGifSize(buf)
  );
};

const getStoryGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(STORIES_DIR);
  } catch {
    return [];
  }

  const imageFiles = entries
    .filter((name) => {
      const lower = name.toLowerCase();
      return (
        (lower.endsWith(".webp") ||
          lower.endsWith(".png") ||
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".gif")) &&
        !lower.startsWith(".")
      );
    })
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const items = await Promise.all(
    imageFiles.map(async (fileName, index) => {
      const filePath = path.join(STORIES_DIR, fileName);
      try {
        const size = await getImageSize(filePath);
        return {
          id: index,
          src: `/images/stories/${fileName}`,
          width: size?.width,
          height: size?.height,
        };
      } catch {
        return {
          id: index,
          src: `/images/stories/${fileName}`,
        };
      }
    }),
  );

  return items;
});

const Wedding = async () => {
  const [initialGuestMessages, storyGalleryItems] = await Promise.all([
    getGuestMessages(1, 10),
    getStoryGalleryItems(),
  ]);

  return (
    <main
      role="main"
      id="main"
      className="w-screen overflow-x-hidden min-h-svh"
    >
      {/* Main */}
      <Section className="flex flex-col items-center justify-center gap-8 py-20">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-5xl font-bold font-great-vibes italic text-primary">
            Our Wedding Day
          </h1>
          <p className="font-hahmlet text-white opacity-75">이형민 & 임희재</p>
        </div>
        <div className="h-fit overflow-hidden w-full border-2 border-white">
          <Image
            src="/images/1624.jpg"
            alt="1624.jpg"
            width={400}
            height={400}
            className="w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-hahmlet font-bold -tracking-[0.05rem] uppercase text-primary">
            {"You're invited to our wedding."}
          </p>
          <p className="font-hahmlet text-white text-center">
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
      <Section className="flex flex-col items-center justify-center gap-8 pt-4 py-20">
        <Image
          src={"/icons/ribbon_10.svg"}
          alt="invitation"
          width={40}
          height={40}
        />

        <p className="font-hahmlet whitespace-pre-line text-white text-center">
          {
            "11년이라는 긴 시간동안\n서로의 청춘을 채워준 가장 친한 친구이자 연인."
          }
        </p>

        <p className="font-hahmlet whitespace-pre-line text-white text-center">
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

      {/* Calendar */}
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title
          category="Calendar"
          title="2026년 4월 19일 일요일 오전 11시"
        />
        <p className="text-center text-sm text-white/75 leading-relaxed whitespace-pre-line">
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
      <Section className="flex flex-col items-center justify-center gap-4">
        <Section.Title category="Gallery" title="Lovely Moments" />
        <GalleryContainer items={storyGalleryItems} />
        <UploadWeddingPhoto />
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
