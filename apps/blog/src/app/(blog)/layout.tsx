import Footer from "@/widgets/footer/Footer";
import Header from "@/widgets/header/Header";

const BlogLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <main id="main" role="main" className="flex-1 flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default BlogLayout;
