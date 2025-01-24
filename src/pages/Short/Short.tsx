import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import AppBar from "../../components/AppBar";
import JobListContent from "../../components/JobListContent";
import ShortContent from "../../components/ShortContent/ShortContent";

function Short() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"단기"} /> : <MainHeaderPC />}

      {isMobileScreen ? <JobListContent /> : <ShortContent />}
    </div>
  );
}

export default Short;
