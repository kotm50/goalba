import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import SearchResultContent from "../../components/SearchResultContent";
import MainHeaderPC from "../../components/MainHeaderPC";

function SearchResult() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"검색결과"} /> : <MainHeaderPC />}

      <SearchResultContent />
    </div>
  );
}

export default SearchResult;
