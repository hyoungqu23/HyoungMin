"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "../common/Section";

type Account = {
  name: string;
  relation: string;
  bank: string;
  accountNumber: string;
};

type AccountGroupProps = {
  title: string;
  accounts: Account[];
  isOpen: boolean;
  onToggle: () => void;
};

const AccountCard = ({ account }: { account: Account }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const numberOnly = account.accountNumber.replace(/-/g, "");
      await navigator.clipboard.writeText(numberOnly);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700">
            {account.name}
          </span>
          <span className="text-xs text-stone-400">{account.relation}</span>
        </div>
        <div className="text-sm text-stone-600">
          <span className="mr-2">{account.bank}</span>
          <span className="tabular-nums font-medium">
            {account.accountNumber}
          </span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className={`
          px-3 py-1.5 rounded-lg text-xs font-bold transition-all
          ${
            isCopied
              ? "bg-emerald-100 text-emerald-600"
              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
          }
        `}
      >
        {isCopied ? "복사됨 ✔" : "복사"}
      </button>
    </div>
  );
};

const AccountGroup = ({
  title,
  accounts,
  isOpen,
  onToggle,
}: AccountGroupProps) => {
  return (
    <div className="w-full mb-3 last:mb-0 overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
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

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 py-2">
              {accounts.map((acc, idx) => (
                <AccountCard key={idx} account={acc} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accounts = () => {
  const [openGroom, setOpenGroom] = useState(false);
  const [openBride, setOpenBride] = useState(false);

  const groomAccounts: Account[] = [
    {
      name: "김철수",
      relation: "신랑",
      bank: "국민은행",
      accountNumber: "123-45-67890",
    },
    {
      name: "김아빠",
      relation: "아버지",
      bank: "신한은행",
      accountNumber: "110-222-333333",
    },
    {
      name: "이엄마",
      relation: "어머니",
      bank: "농협",
      accountNumber: "352-1234-5678-99",
    },
  ];

  const brideAccounts: Account[] = [
    {
      name: "이영희",
      relation: "신부",
      bank: "우리은행",
      accountNumber: "1002-987-654321",
    },
    {
      name: "이아빠",
      relation: "아버지",
      bank: "하나은행",
      accountNumber: "123-456-789012",
    },
    {
      name: "박엄마",
      relation: "어머니",
      bank: "카카오뱅크",
      accountNumber: "3333-01-2345678",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <Section.Title
        category="Account"
        title="마음 전하실 곳"
        description={`참석이 어려우신 분들을 위해\n계좌번호를 기재하였습니다.\n너른 양해와 축하 부탁드립니다.`}
      />

      <div className="flex flex-col gap-3">
        <AccountGroup
          title="신랑측 계좌번호"
          accounts={groomAccounts}
          isOpen={openGroom}
          onToggle={() => setOpenGroom(!openGroom)}
        />
        <AccountGroup
          title="신부측 계좌번호"
          accounts={brideAccounts}
          isOpen={openBride}
          onToggle={() => setOpenBride(!openBride)}
        />
      </div>
    </div>
  );
};
