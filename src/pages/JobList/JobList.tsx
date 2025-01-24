import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import JobListContent from "../../components/JobListContent";
import MainHeaderPC from "../../components/MainHeaderPC";

function JobList() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"공고리스트"} /> : <MainHeaderPC />}

      <JobListContent />
    </div>
  );
}

export default JobList;
