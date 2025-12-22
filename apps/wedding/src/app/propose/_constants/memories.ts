export type MemorySide = "left" | "right";

export type MemoryItem = {
  id: string;
  date: string; // yyyy-mm-dd
  src: string;
  t: number; // 0..1 along the corridor curve
  side: MemorySide;
  letter: string;
};

export const MEMORIES: MemoryItem[] = [
  {
    id: "m-1",
    date: "2015-12-26",
    src: "/images/sample.jpg",
    t: 1 / 12,
    side: "left",
    letter:
      "처음 만났던 겨울.\n그날의 공기와 마음을 아직도 기억해.\n\n이 복도에 걸어둔 모든 순간들이 우리를 여기까지 데려왔어.",
  },
  {
    id: "m-2",
    date: "2016-03-09",
    src: "/images/sample.jpg",
    t: 2 / 12,
    side: "right",
    letter:
      "서로를 더 알아가던 시간.\n평범한 하루가 특별해지는 방법을 너에게서 배웠어.",
  },
  {
    id: "m-3",
    date: "2017-07-09",
    src: "/images/sample.jpg",
    t: 3 / 12,
    side: "left",
    letter:
      "우리가 함께 웃고, 또 서로를 안아주던 날들.\n\n언제나 내 편이 되어줘서 고마워.",
  },
  {
    id: "m-4",
    date: "2018-10-03",
    src: "/images/sample.jpg",
    t: 4 / 12,
    side: "right",
    letter:
      "힘든 날에도 결국 우리답게.\n\n앞으로도 손 놓지 말고 같이 걸어가자.",
  },
  {
    id: "m-5",
    date: "2019-10-03",
    src: "/images/sample.jpg",
    t: 5 / 12,
    side: "left",
    letter:
      "그리고 지금.\n\n이제는 ‘우리’라는 이름으로,\n매일을 함께하고 싶어.",
  },
  {
    id: "m-6",
    date: "2020-10-03",
    src: "/images/sample.jpg",
    t: 6 / 12,
    side: "right",
    letter: "여섯 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
  {
    id: "m-7",
    date: "2021-05-21",
    src: "/images/sample.jpg",
    t: 7 / 12,
    side: "left",
    letter: "일곱 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
  {
    id: "m-8",
    date: "2022-05-21",
    src: "/images/sample.jpg",
    t: 8 / 12,
    side: "right",
    letter: "여덟 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
  {
    id: "m-9",
    date: "2023-12-31",
    src: "/images/sample.jpg",
    t: 9 / 12,
    side: "left",
    letter: "아홉 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
  {
    id: "m-10",
    date: "2024-12-31",
    src: "/images/sample.jpg",
    t: 10 / 12,
    side: "right",
    letter: "열 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
  {
    id: "m-11",
    date: "2025-12-26",
    src: "/images/sample.jpg",
    t: 11 / 12,
    side: "left",
    letter: "열한 번째 추억.\n\n(여기에 편지 내용을 채워 넣어줘.)",
  },
];
