import { useState } from "react";
import { jobsiteUserLogin, JobsiteUserLoginRequest } from "../../api/auth";
import {
  socialLoginFacebookStart,
  socialLoginGoogleStart,
  socialLoginKakaoStart,
  socialLoginNaverStart,
} from "../../api/social";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";
import logo from "../../assets/logo.png";

function LoginContent() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const [isInformationOpen, setIsInformationOpen] = useState<boolean>(false); // 회사 정보 펼침 여부

  const [userId, setUserId] = useState<string>(""); // 아이디
  const [userPwd, setUserPwd] = useState<string>(""); // 비밀번호

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 메시지
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 여부

  // 아이디 입력 이벤트
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = e.target.value;
    setUserId(userId);
  };

  // 비밀번호 입력 이벤트
  const handleUserPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userPwd = e.target.value;
    setUserPwd(userPwd);
  };

  // 비밀번호 입력 엔터 이벤트
  const handleUserPwdKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoginButtonClick();
    }
  };

  // 로그인 버튼 클릭 이벤트
  const handleLoginButtonClick = () => {
    const jobsiteUserLoginRequest: JobsiteUserLoginRequest = {
      userId,
      userPwd,
    };

    // 로그인 API 호출
    jobsiteUserLogin(jobsiteUserLoginRequest).then((response) => {
      if (response) {
        if (response.code === "C000") {
          dispatch({ type: "LOGIN", payload: response.user }); // 로그인 성공 시 유저 정보 저장

          navigate("/"); // 로그인 성공 시 홈 화면으로 이동
        } else if (response.code === "C001") {
          dispatch({ type: "SET_USER" }); // 이미 로그인 되어있는 경우 기존 상태 유지

          navigate("/"); // 이미 로그인 되어있는 경우 홈 화면으로 이동
        } else {
          // 로그인 실패 시 팝업
          setConfirmTitle("알림");
          setConfirmMessage("로그인에 실패하셨습니다.");
          setIsConfirmPopupOpen(true);
        }
      }
    });
  };

  // 아이디 찾기 버튼 클릭 이벤트
  const handleFindIdButtonClick = () => {
    navigate("/help/find/id"); // 아이디 찾기 페이지로 이동
  };

  // 비밀번호 찾기 버튼 클릭 이벤트
  const handleFindPwdButtonClick = () => {
    navigate("/help/find/pwd"); // 비밀번호 찾기 페이지로 이동
  };

  // 회원가입 버튼 클릭 이벤트
  const handleSignUpButtonClick = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  // 네이버 로그인 버튼 클릭 이벤트
  const handleNaverLoginButtonClick = () => {
    socialLoginNaverStart(); // 네이버 로그인 API 호출
  };

  // 카카오 로그인 버튼 클릭 이벤트
  const handleKakaoLoginButtonClick = () => {
    socialLoginKakaoStart(); // 카카오 로그인 API 호출
  };

  // Facebook 로그인 버튼 클릭 이벤트
  const handleFacebookLoginButtonClick = () => {
    socialLoginFacebookStart(); // Facebook 로그인 API 호출
  };

  // 구글 로그인 버튼 클릭 이벤트
  const handleGoogleLoginButtonClick = () => {
    socialLoginGoogleStart(); // 구글 로그인 API 호출
  };

  return (
    <div className="flex w-full flex-col items-center px-5 py-20 pc:mx-auto pc:my-auto pc:px-0 pc:py-0 pc:pb-0">
      {/* 로고 이미지 */}
      <div className="flex flex-col items-center gap-1">
        <h1
          className="cursor-pointer pb-4 text-5xl leading-[58px] text-[#DC143C]"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="고알바" className="mx-auto h-[72px]" />
        </h1>
        <span className="text-base leading-[19px]">
          고알바과 함께 채용의 질을 높여보세요!
        </span>
      </div>

      {/* 로그인 폼 */}
      <div className="mt-[74px] flex w-full flex-col border border-solid border-light pc:mt-10 pc:w-[400px] pc:flex-row pc:gap-1">
        <div className="flex w-full flex-col pc:w-[300px] pc:gap-1">
          {/* 아이디 */}
          <div className="flex min-h-12 w-full border-b border-solid border-light bg-white p-[10px]">
            <input
              type="text"
              className="h-full w-full text-sm placeholder:text-[#CCCCCC]"
              placeholder="아이디"
              value={userId}
              onChange={handleUserIdChange}
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex min-h-12 w-full border-b border-solid border-light bg-white p-[10px]">
            <input
              type="password"
              className="h-full w-full text-sm placeholder:text-[#CCCCCC]"
              placeholder="비밀번호   8 ~ 16자 영문, 숫자, 특수기호"
              value={userPwd}
              onChange={handleUserPwdChange}
              onKeyPress={handleUserPwdKeyPress}
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-center bg-[#DC143C] text-xl font-bold text-white pc:h-[100px] pc:w-[100px] pc:rounded"
          onClick={handleLoginButtonClick}
        >
          로그인
        </button>
      </div>

      {/* 아이디 찾기 / 비밀번호 찾기 / 회원가입 */}
      <div className="mt-[50px] flex items-center justify-center gap-[15px] pc:mt-10">
        <span
          className="cursor-pointer text-sm text-[#666666]"
          onClick={handleFindIdButtonClick}
        >
          아이디 찾기
        </span>
        <div className="h-3 w-[1px] bg-[#CCCCCC]"></div>
        <span
          className="cursor-pointer text-sm text-[#666666]"
          onClick={handleFindPwdButtonClick}
        >
          비밀번호 찾기
        </span>
        <div className="h-3 w-[1px] bg-[#CCCCCC]"></div>
        <span
          className="cursor-pointer text-sm text-[#666666]"
          onClick={handleSignUpButtonClick}
        >
          회원가입
        </span>
      </div>

      {/* 소셜 로그인 */}
      <div className="mt-[50px] flex w-full flex-col items-center gap-4 pc:mt-10">
        <span className="text-sm">소셜 로그인</span>
        <div className="flex items-center justify-center gap-4 pc:gap-10">
          {/* 네이버 로그인 */}
          <button
            type="button"
            className="hidden h-12 min-h-12 w-12 min-w-12 rounded-full bg-[#10B981]"
            onClick={handleNaverLoginButtonClick}
          >
            <img
              src="/assets/images/logo/naver_logo.png"
              alt="Naver"
              className="w-full"
            />
          </button>

          {/* 카카오 로그인 */}
          <button
            type="button"
            className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-full bg-[#FFD700]"
            onClick={handleKakaoLoginButtonClick}
          >
            <img
              src="/assets/images/logo/kakao_logo.png"
              alt="Kakao"
              className="w-1/2"
            />
          </button>

          {/* Facebook 로그인 */}
          <button
            type="button"
            className="h-12 min-h-12 w-12 min-w-12 rounded-full bg-[#0099FF]"
            onClick={handleFacebookLoginButtonClick}
          >
            <img
              src="/assets/images/logo/facebook_logo.png"
              alt="Facebook"
              className="w-full"
            />
          </button>

          {/* 애플 로그인 */}
          {/* <button
            type="button"
            className="h-12 min-h-12 min-w-12 w-12 rounded-full bg-[#000000]"
          ></button> */}

          {/* 구글 로그인 */}
          <button
            type="button"
            className="h-12 min-h-12 w-12 min-w-12 rounded-full"
            onClick={handleGoogleLoginButtonClick}
          >
            <img
              src="/assets/images/logo/google_logo.png"
              alt="Google"
              className="w-full"
            />
          </button>
        </div>
      </div>

      {/* 회사 정보 토글 */}
      <div className="fixed bottom-24 left-1/2 hidden w-full -translate-x-1/2 transform flex-col items-center gap-5 pc:flex">
        <div
          className="flex cursor-pointer items-center justify-center gap-[11px]"
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
          <h4 className="absolute top-6 text-center text-xxs text-[#333333]">
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
      </div>

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
          isLogin // 로그인 팝업인지 여부
        />
      )}
    </div>
  );
}

export default LoginContent;
