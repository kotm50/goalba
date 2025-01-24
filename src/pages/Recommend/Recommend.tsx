import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import RecommendContent from "../../components/RecommendContent";
import AppBar from "../../components/AppBar";
import JobListContent from "../../components/JobListContent";

function Recommend() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"추천"} /> : <MainHeaderPC />}

      {isMobileScreen ? <JobListContent /> : <RecommendContent />}
    </div>
  );
}

export default Recommend;
