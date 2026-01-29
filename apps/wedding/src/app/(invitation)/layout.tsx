import { Suspense } from "react";
import { getHeartCount } from "./_actions/hearts";
import { HeartButton } from "./_components/floating/HeartButton";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const InvitationLayout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* <Splash /> */}
      {children}
      {/* <FloatingButton /> */}
      <Suspense fallback={null}>
        <HeartButton initialCountPromise={getHeartCount()} />
      </Suspense>
    </>
  );
};

export default InvitationLayout;
