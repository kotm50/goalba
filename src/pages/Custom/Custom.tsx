import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import JobListContent from "../../components/JobListContent";
import CustomContent from "../../components/CustomContent";

function Custom() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"맞춤"} /> : <MainHeaderPC />}

      {isMobileScreen ? <JobListContent /> : <CustomContent />}
    </div>
  );
}

export default Custom;
