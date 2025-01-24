import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserInfoPopup from "../UserInfoPopup";

interface AppBarProps {
  title: string;
  handleBackButtonClick?: () => void;
}

function AppBar(appBarProps: AppBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { title, handleBackButtonClick } = appBarProps;

  const [isUserInfoPopupOpen, setIsUserInfoPopupOpen] =
    useState<boolean>(false); // 회원정보 팝업 열림 여부

  // 회원 서비스 버튼 클릭 이벤트
  const handleUserButtonClick = () => {
    if (location.pathname.includes("/service")) {
      // 서비스 페이지에서는 회원정보 팝업 열기
      setIsUserInfoPopupOpen(true);
      return;
    }

    navigate("/service"); // 서비스 페이지로 이동
  };

  // 홈 버튼 클릭 이벤트
  const handleHomeButtonClick = () => {
    window.location.href = "/"; // 메인페이지로 리다이렉트
  };

  // 뒤로가기 버튼 클릭 이벤트
  const handleBackClick = () => {
    if (handleBackButtonClick) {
      handleBackButtonClick();
    } else {
      window.history.back(); // props가 없을 경우 브라우저 뒤로 가기
    }
  };

  return (
    <div className="flex min-h-12 w-full items-center justify-between border-b border-solid border-light bg-white px-[18px] py-[6px]">
      {/* Left (뒤로가기 / 타이틀)*/}
      <div className="flex items-center gap-5">
        <button type="button" className="w-3" onClick={handleBackClick}>
          <img
            src="/assets/images/icons/svg/left_arrow_light.svg"
            alt="Back"
            className="w-full"
          />
        </button>
        <h1 className="text-base font-bold">{title}</h1>
      </div>

      {/* Right (아이콘) */}
      <div className="flex items-center gap-2.5">
        {/* 회원정보 / 회원 서비스 버튼 */}
        <button
          type="button"
          className="h-6 w-6"
          onClick={handleUserButtonClick}
        >
          <img
            src={`/assets/images/icons/svg/${location.pathname.includes("/service") ? "gear.svg" : "user.svg"}`}
            alt="User"
            className="h-full w-full"
          />
        </button>
        {/* 홈 버튼 */}
        <button
          type="button"
          className="h-6 w-6"
          onClick={handleHomeButtonClick}
        >
          <img
            src="/assets/images/icons/svg/home.svg"
            alt="User"
            className="h-full w-full"
          />
        </button>
      </div>

      {/* 회원정보 팝업 */}
      {isUserInfoPopupOpen && (
        <UserInfoPopup onClose={() => setIsUserInfoPopupOpen(false)} />
      )}
    </div>
  );
}

export default AppBar;
