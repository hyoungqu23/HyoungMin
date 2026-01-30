import { Suspense } from "react";
import { getHeartCount } from "./_actions/hearts";
import { FloatingButton } from "./_components/floating/FloatingButton";
import { HeartButton } from "./_components/floating/HeartButton";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const InvitationLayout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <FloatingButton />
      </Suspense>
      <Suspense fallback={null}>
        <HeartButton initialCountPromise={getHeartCount()} />
      </Suspense>
    </>
  );
};

export default InvitationLayout;
