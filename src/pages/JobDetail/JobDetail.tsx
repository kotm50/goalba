import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import JobDetailContent from "../../components/JobDetailContent";
import MainHeaderPC from "../../components/MainHeaderPC";

function JobDetail() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"공고상세"} /> : <MainHeaderPC />}

      <JobDetailContent />
    </div>
  );
}

export default JobDetail;
