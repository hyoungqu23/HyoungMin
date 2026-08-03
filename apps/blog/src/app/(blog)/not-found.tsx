import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
      <h1 className="text-6xl font-extrabold">404</h1>
      <p className="text-lg">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="font-bold underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
