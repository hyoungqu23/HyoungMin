#!/usr/bin/env node
/**
 * 빌드 시 이미지 메타데이터를 생성하는 스크립트
 * 서버리스 함수에서 fs를 사용하지 않고 이미지 정보를 제공하기 위함
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const STORIES_DIR = path.join(process.cwd(), "public", "images", "stories");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "src",
  "generated",
  "story-gallery-items.json",
);

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
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;

  const isSof = (marker: number) =>
    marker === 0xc0 ||
    marker === 0xc1 ||
    marker === 0xc2 ||
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
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (offset < buf.length && buf[offset] === 0xff) offset += 1;
    const marker = buf[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) break;
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
      if (dataOffset + 5 > buf.length) return null;
      if (buf[dataOffset] !== 0x2f) return null;
      const b0 = buf[dataOffset + 1];
      const b1 = buf[dataOffset + 2];
      const b2 = buf[dataOffset + 3];
      const b3 = buf[dataOffset + 4];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width, height };
    }

    if (chunkType === "VP8 ") {
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

async function main() {
  console.log("📸 이미지 메타데이터 생성 시작...");

  let entries: string[] = [];
  try {
    entries = await fs.readdir(STORIES_DIR);
  } catch (error) {
    console.error("❌ stories 디렉토리를 읽을 수 없습니다:", error);
    // 빈 배열로 JSON 생성
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
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

  // 출력 디렉토리 생성
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

  // JSON 파일 저장
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(items, null, 2));

  console.log(`✅ ${items.length}개 이미지 메타데이터 생성 완료`);
  console.log(`📁 저장 위치: ${OUTPUT_FILE}`);
}

main().catch(console.error);
