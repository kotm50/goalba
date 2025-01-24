import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import RegionContent from "../../components/RegionContent";
import AppBar from "../../components/AppBar";
import JobListContent from "../../components/JobListContent";

function Region() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"지역"} /> : <MainHeaderPC />}

      {isMobileScreen ? <JobListContent /> : <RegionContent />}
    </div>
  );
}

export default Region;
