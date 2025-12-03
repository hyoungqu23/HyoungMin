import { ShareButtons } from "./ShareButtons";
import { Section } from "../common/Section";

export const Share = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Section.Title
        category="Share"
        title="소식 전하기"
        description="소중한 분들에게 저희의 결혼 소식을 전해주세요"
      />
      <ShareButtons />
    </div>
  );
};
