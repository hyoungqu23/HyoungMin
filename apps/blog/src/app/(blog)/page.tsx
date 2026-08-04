import { EditorialHome } from "./_components/EditorialHome";
import { getHomePageData } from "./_lib/home-page-data";

const Home = async () => {
  const data = await getHomePageData();
  return <EditorialHome data={data} />;
};

export default Home;
