import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import JobListContent from "../../components/JobListContent";
import UrgentContent from "../../components/UrgentContent";

function Urgent() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"급구"} /> : <MainHeaderPC />}

      {isMobileScreen ? <JobListContent /> : <UrgentContent />}
    </div>
  );
}

export default Urgent;
