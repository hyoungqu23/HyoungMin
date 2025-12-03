import { Accordion } from "../common/Accordion";
import { Section } from "../common/Section";
import { type Account, AccountCard } from "./AccountCard";

export const Accounts = () => {
  const groomAccounts: Account[] = [
    {
      name: "이형민",
      relation: "신랑",
      bank: "국민은행",
      accountNumber: "123-45-67890",
    },
    {
      name: "이병수",
      relation: "아버지",
      bank: "신한은행",
      accountNumber: "110-222-333333",
    },
    {
      name: "이광이",
      relation: "어머니",
      bank: "농협",
      accountNumber: "352-1234-5678-99",
    },
  ];

  const brideAccounts: Account[] = [
    {
      name: "임희재",
      relation: "신부",
      bank: "우리은행",
      accountNumber: "1002-987-654321",
    },
    {
      name: "임종윤",
      relation: "아버지",
      bank: "하나은행",
      accountNumber: "123-456-789012",
    },
    {
      name: "서미경",
      relation: "어머니",
      bank: "카카오뱅크",
      accountNumber: "3333-01-2345678",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 flex flex-col gap-12">
      <Section.Title
        category="Account"
        title="마음 전하실 곳"
        description={`참석이 어려우신 분들을 위해\n계좌번호를 기재하였습니다.\n너른 양해와 축하 부탁드립니다.`}
      />

      <div className="flex flex-col gap-3">
        <Accordion name="accounts" title="신랑측 계좌번호">
          {groomAccounts.map((acc, idx) => (
            <AccountCard key={idx} account={acc} />
          ))}
        </Accordion>
        <Accordion name="accounts" title="신부측 계좌번호">
          {brideAccounts.map((acc, idx) => (
            <AccountCard key={idx} account={acc} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
