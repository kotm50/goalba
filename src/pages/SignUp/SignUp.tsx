import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import SignUpContent from "../../components/SignUpContent";
import TopBarPC from "../../components/TopBarPC";
import { useState } from "react";
import WarningPopup from "../../components/WarningPopup";
import { useLocation } from "react-router-dom";

function SignUp() {
  const location = useLocation();
  const { socialId, socialType } = location.state || {}; // 소셜 로그인 사용자일 경우 소셜 정보 가져오기

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [backButtonWarning, setBackButtonWarning] = useState<string>(""); // 뒤로가기 버튼 클릭 시 경고창
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false); // 경고창 열림 여부

  // 뒤로가기 버튼 클릭 시 이벤트
  const handleBackButtonClick = () => {
    setIsWarningOpen(true); // 경고창 열림
    setBackButtonWarning(
      "페이지 이동시 회원가입이 취소됩니다.<br>회원가입을 다음에 진행하시겠습니까?",
    );
  };

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? (
        <AppBar
          title={"회원가입"}
          handleBackButtonClick={handleBackButtonClick}
        />
      ) : (
        <TopBarPC />
      )}
      <SignUpContent socialId={socialId} socialType={socialType} />

      {/* 경고창 */}
      {isWarningOpen && (
        <WarningPopup
          message={backButtonWarning}
          modalClose={() => setIsWarningOpen(false)}
        />
      )}
    </div>
  );
}

export default SignUp;
