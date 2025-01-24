import MainContent from "../../components/MainContent";
import MainFooterMobile from "../../components/MainFooterMobile";
import MainFooterPC from "../../components/MainFooterPC";
import MainHeaderMobile from "../../components/MainHeaderMobile";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainTopPC from "../../components/MainTopPC";
import NavigationBarMobile from "../../components/NavigationBarMobile";
import { useMediaQuery } from "@react-hook/media-query";

function Main() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <MainHeaderMobile /> : <MainHeaderPC />}
      {isMobileScreen ? <NavigationBarMobile /> : <MainTopPC />}
      <MainContent />
      {isMobileScreen ? <MainFooterMobile /> : <MainFooterPC />}
    </div>
  );
}

export default Main;
