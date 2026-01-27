type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const InvitationLayout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* <Splash /> */}
      {children}
      {/* <FloatingButton />
      <Suspense fallback={null}>
        <HeartButton initialCountPromise={getHeartCount()} />
      </Suspense> */}
    </>
  );
};

export default InvitationLayout;
