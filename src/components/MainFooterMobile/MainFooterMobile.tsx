import { useState } from "react";
import { jobsiteUserLogout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ModalPopup from "../../pages/ModalPopup";

function MainFooterMobile() {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const [isInformationOpen, setIsInformationOpen] = useState<boolean>(false); // 회사정보 오픈 여부

  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState<boolean>(false); // 이용약관 팝업 오픈 여부
  const [isPrivacyPopupOpen, setIsPrivacyPopupOpen] = useState<boolean>(false); // 개인정보보호방침 팝업 오픈 여부

  // 로그인 / 로그아웃 버튼 클릭 이벤트
  const handleLoginORLogoutButtonClick = () => {
    if (state.isLoggedIn) {
      // 로그인 상태일 때 로그아웃
      jobsiteUserLogout().then(() => {
        dispatch({ type: "LOGOUT" }); // 로그아웃 상태로 변경

        window.location.reload(); // 로그아웃 성공 시 페이지 새로고침
      });
    } else {
      // 로그아웃 상태일 때 로그인 페이지로 이동
      navigate("/login");
    }
  };

  // 내 정보 / 회원가입 버튼 클릭 이벤트
  const handleMyInfoOrSignUpButtonClick = () => {
    if (state.isLoggedIn) {
      // 로그인 상태일 때 내 정보 페이지로 이동
      navigate("/service");
    } else {
      // 로그아웃 상태일 때 회원가입 페이지로 이동
      navigate("/signup");
    }
  };

  // 이용약관 버튼 클릭 이벤트
  const handleTermsOfServiceButtonClick = () => {
    setIsTermsPopupOpen(true);
  };

  // 개인정보보호방침 버튼 클릭 이벤트
  const handlePrivacyPolicyButtonClick = () => {
    setIsPrivacyPopupOpen(true);
  };

  // 회사소개 버튼 클릭 이벤트
  const handleCompanyIntroductionButtonClick = () => {
    window.open("https://ikoreatm.com/", "_blank"); // 새 창으로 회사소개 페이지 이동
  };

  return (
    <div className="mt-[34px] flex w-full flex-col items-center pb-[23.3px]">
      {/* 로그인 / 회원가입 버튼 */}
      <div className="flex min-h-9 items-center justify-center gap-[10px]">
        <button
          type="button"
          className="h-full min-w-[100px] border border-solid border-[#CCCCCC] bg-[#EAEAEA] text-sm font-semibold text-[#666666]"
          onClick={handleLoginORLogoutButtonClick}
        >
          {state.isLoggedIn ? "로그아웃" : "로그인"}
        </button>
        <button
          type="button"
          className="h-full min-w-[100px] border border-solid border-[#CCCCCC] bg-[#EAEAEA] text-sm font-semibold text-[#666666]"
          onClick={handleMyInfoOrSignUpButtonClick}
        >
          {state.isLoggedIn ? "내 정보" : "회원가입"}
        </button>
      </div>

      {/* 이용약관 / 개인정보보호방침 */}
      <div className="mt-10 flex items-center gap-1">
        <span
          className="cursor-pointer text-xs text-[#333333]"
          onClick={handleTermsOfServiceButtonClick}
        >
          이용약관
        </span>
        <span className="text-xs text-[#333333]">ㆍ</span>
        <span
          className="cursor-pointer text-xs font-bold text-[#333333]"
          onClick={handlePrivacyPolicyButtonClick}
        >
          개인정보보호방침
        </span>
      </div>

      {/* 회사소개 / 고객지원 */}
      <div className="mt-5 flex items-center gap-1">
        <span
          className="cursor-pointer text-xs text-[#333333]"
          onClick={handleCompanyIntroductionButtonClick}
        >
          회사소개
        </span>
        <span className="text-xs text-[#333333]">ㆍ</span>
        <span
          className="cursor-pointer text-xs font-bold text-[#333333]"
          onClick={() => navigate("/faq")}
        >
          고객지원
        </span>
      </div>

      {/* 회사정보 */}
      <div
        className="mt-[27px] flex cursor-pointer items-center justify-center gap-[11px]"
        onClick={() => setIsInformationOpen(!isInformationOpen)}
      >
        <span className="text-sm text-[#333333]">ⓒ Recruiting Lab</span>
        <img
          src="/assets/images/icons/svg/down_arrow_light.svg"
          alt="Open"
          className={`${isInformationOpen ? "rotate-180" : "rotate-0"} w-3 cursor-pointer`}
        />
      </div>

      {isInformationOpen && (
        <h4 className="mt-5 text-center text-xxs text-[#333333]">
          서울특별시 중구 다산로38길 66-47
          <br />
          개인정보관리책임자 : 이태준 | 고객센터 : 1644-4223
          <br />
          사업자등록번호 : 789-81-02395
          <br />
          통신판매업신고 : 제2022-서울중구-1101호
          <br />
          직업소개사업 신고번호 : 제2021-3010165-14-5-0003호 
        </h4>
      )}

      {/* 이용약관 팝업 */}
      {isTermsPopupOpen && (
        <ModalPopup closeModal={() => setIsTermsPopupOpen(false)} isTerms />
      )}

      {/* 개인정보보호방침 팝업 */}
      {isPrivacyPopupOpen && (
        <ModalPopup closeModal={() => setIsPrivacyPopupOpen(false)} isPrivacy />
      )}
    </div>
  );
}

export default MainFooterMobile;
