"use client";

import Check from "@icons/check.svg";
import Copy from "@icons/copy.svg";
import Image from "next/image";
import { useState } from "react";

export type Account = {
  name: string;
  relation: string;
  bank: string;
  accountNumber: string;
};

export const AccountCard = ({ account }: { account: Account }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const numberOnly = account.accountNumber.replace(/-/g, "");
      await navigator.clipboard.writeText(numberOnly);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{account.name}</span>
          <span className="text-xs">{account.relation}</span>
        </div>
        <div className="text-sm">
          <span className="mr-2">{account.bank}</span>
          <span className="tabular-nums font-medium">
            {account.accountNumber}
          </span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-primary/20"
      >
        {isCopied ? (
          <Image src={Check} alt="Check" width={16} height={16} />
        ) : (
          <Image src={Copy} alt="Copy" width={16} height={16} />
        )}
      </button>
    </div>
  );
};
