"use client";

import Phone from "@icons/call.svg";
import Message from "@icons/sms.svg";
import Image from "next/image";
import { Accordion } from "../common/Accordion";
import { Section } from "../common/Section";

type Contact = {
  role: string;
  name: string;
  phone: string;
};

const ContactRow = ({ contact }: { contact: Contact }) => {
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
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-100 hover:bg-rose-200 transition-colors"
          aria-label={`${contact.name}에게 전화하기`}
        >
          <Image src={Phone} alt="Phone" width={16} height={16} />
        </a>

        <a
          href={`sms:${cleanPhone}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-100 hover:bg-rose-200 transition-colors"
          aria-label={`${contact.name}에게 문자하기`}
        >
          <Image src={Message} alt="Message" width={16} height={16} />
        </a>
      </div>
    </div>
  );
};

export const Contact = () => {
  const groomContacts: Contact[] = [
    { role: "신랑", name: "이형민", phone: "010-2783-2123" },
    { role: "아버지", name: "이병수", phone: "010-3752-9324" },
    { role: "어머니", name: "이광이", phone: "010-9978-9324" },
  ];

  const brideContacts: Contact[] = [
    { role: "신부", name: "임희재", phone: "010-8624-8945" },
    { role: "아버지", name: "임종윤", phone: "010-3747-8947" },
    { role: "어머니", name: "서미경", phone: "010-7933-4309" },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 flex flex-col gap-12">
      <Section.Title
        category="Contact"
        title="연락하기"
        description="축하의 마음을 전해주세요."
      />

      <div className="flex flex-col gap-3">
        <Accordion name="contact" title="신랑측 연락처">
          {groomContacts.map((contact, idx) => (
            <ContactRow key={idx} contact={contact} />
          ))}
        </Accordion>
        <Accordion name="contact" title="신부측 연락처">
          {brideContacts.map((contact, idx) => (
            <ContactRow key={idx} contact={contact} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
