"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "../common/Section";

// --- 타입 정의 ---
type Contact = {
  role: string; // 신랑, 아버지, 어머니
  name: string;
  phone: string;
};

type ContactGroupProps = {
  title: string; // "신랑측 연락처"
  contacts: Contact[];
  isOpen: boolean;
  onToggle: () => void;
};

// --- 아이콘 컴포넌트 ---
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

// --- 1. 개별 연락처 행 (Row) ---
const ContactRow = ({ contact }: { contact: Contact }) => {
  // 전화번호에서 하이픈 제거
  const cleanPhone = contact.phone.replace(/-/g, "");

  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700">
            {contact.name}
          </span>
          <span className="text-xs text-stone-400">{contact.role}</span>
        </div>
        <div className="text-sm text-stone-500 tabular-nums">
          {contact.phone}
        </div>
      </div>

      <div className="flex gap-2">
        {/* 전화 버튼 */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          aria-label={`${contact.name}에게 전화하기`}
        >
          <PhoneIcon className="w-4 h-4" />
        </a>

        {/* 문자 버튼 */}
        <a
          href={`sms:${cleanPhone}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
          aria-label={`${contact.name}에게 문자하기`}
        >
          <MessageIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// --- 2. 아코디언 그룹 (AccountGroup과 디자인 동일) ---
const ContactGroup = ({
  title,
  contacts,
  isOpen,
  onToggle,
}: ContactGroupProps) => {
  return (
    <div className="w-full mb-3 last:mb-0 overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
      {/* 헤더 */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 bg-rose-50/50 hover:bg-rose-50 transition-colors"
      >
        <span className="font-bold text-stone-700">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-rose-400"
        >
          ▼
        </motion.span>
      </button>

      {/* 내용 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 py-2">
              {contacts.map((contact, idx) => (
                <ContactRow key={idx} contact={contact} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. 메인 섹션 컴포넌트 ---
export const Contact = () => {
  const [openGroom, setOpenGroom] = useState(false);
  const [openBride, setOpenBride] = useState(false);

  // 데이터
  const groomContacts: Contact[] = [
    { role: "신랑", name: "김철수", phone: "010-1234-5678" },
    { role: "아버지", name: "김아빠", phone: "010-1111-2222" },
    { role: "어머니", name: "이엄마", phone: "010-3333-4444" },
  ];

  const brideContacts: Contact[] = [
    { role: "신부", name: "이영희", phone: "010-9876-5432" },
    { role: "아버지", name: "이아빠", phone: "010-5555-6666" },
    { role: "어머니", name: "박엄마", phone: "010-7777-8888" },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <Section.Title
        category="Contact"
        title="연락하기"
        description="축하의 마음을 전해주세요."
      />

      {/* 아코디언 리스트 */}
      <div className="flex flex-col gap-3">
        <ContactGroup
          title="신랑측 연락처"
          contacts={groomContacts}
          isOpen={openGroom}
          onToggle={() => setOpenGroom(!openGroom)}
        />
        <ContactGroup
          title="신부측 연락처"
          contacts={brideContacts}
          isOpen={openBride}
          onToggle={() => setOpenBride(!openBride)}
        />
      </div>
    </div>
  );
};
