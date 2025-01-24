import { useState } from "react";
import AppBar from "../../components/AppBar";
import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainFooterPC from "../../components/MainFooterPC";
import UpdateProfileContent from "../../components/UpdateProfileContent";

function UpdateProfile() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [selectedTab, setSelectedTab] = useState<string>("개인정보수정");

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={selectedTab} /> : <MainHeaderPC />}

      <UpdateProfileContent
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* PC 버전 푸터 */}
      {isMobileScreen || <MainFooterPC />}
    </div>
  );
}

export default UpdateProfile;
