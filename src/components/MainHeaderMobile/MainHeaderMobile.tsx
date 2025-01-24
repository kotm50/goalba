import { useState } from "react";
import MenuMobile from "../MenuMobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import ConfirmPopup from "../ConfirmPopup";

function MainHeaderMobile() {
  const { state } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // 메뉴 오픈 여부

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 오픈 여부

  // 유저 버튼 클릭 이벤트
  const handleUserButtonClick = () => {
    if (state.isLoggedIn) {
      navigate("/service"); // 로그인 상태일 때 서비스 페이지로 이동
    } else {
      // 로그인 상태가 아닐 때 확인 팝업 띄우기
      setConfirmTitle("알림");
      setConfirmMessage("로그인이 필요한 서비스입니다.");
      setIsConfirmPopupOpen(true);
    }
  };

  return (
    <>
      <header className="flex min-h-12 w-full items-center justify-between border-b border-solid border-light bg-white px-3">
        {/* 햄버거 버튼 */}
        <button type="button" className="h-5 w-5">
          <img
            src="/assets/images/icons/svg/hamburger.svg"
            alt="Open Menu"
            className="h-full w-full"
            onClick={() => setIsMenuOpen(true)}
          />
        </button>

        {/* 로고 이미지 */}
        <button type="button" className="">
          <img src={logo} alt="고알바" className="mx-auto h-[24px]" />
        </button>

        {/* 회원 서비스 버튼 */}
        <button
          type="button"
          className="h-6 w-6"
          onClick={handleUserButtonClick}
        >
          <img
            src="/assets/images/icons/svg/user.svg"
            alt="User"
            className="h-full w-full"
          />
        </button>
      </header>

      {/* 메뉴창 */}
      {isMenuOpen && (
        <MenuMobile isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => {
            setIsConfirmPopupOpen(false);
            navigate("/login", { replace: true });
          }}
        />
      )}
    </>
  );
}

export default MainHeaderMobile;
