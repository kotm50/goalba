import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { jobsiteUserLogout } from "../../api/auth";
import logo from "../../assets/logo.png";

const RECRUiTMENT_INFO = [
  { title: "추천 채용정보", link: "/recommend" },
  { title: "지역별 채용정보", link: "/region" },
  { title: "단기 채용정보", link: "/short" },
  { title: "급구! 채용정보", link: "/urgent" },
];

const MEMBER_SERVICE = [
  { title: "개인정보수정", link: "/edit" },
  { title: "스크랩", link: "/scrape" },
  { title: "좋아요", link: "/favorite" },
  { title: "최근열람공고", link: "/recent" },
  //{ title: "지원현황", link: "/" },
  //{ title: "관심정보", link: "/" },
  { title: "회원정보", link: "/service" },
];

const ADDITIONAL_SERVICE = [
  { title: "급여계산기", link: "/salary" },
  { title: "주휴수당계산기", link: "/weekly" },
];

const CUSTOMER_SUPPORT = [
  { title: "공지사항", link: "/notice" },
  { title: "자주 묻는 질문", link: "/faq" },
];

function MainHeaderPC() {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // 메뉴 열림 여부

  const [keyword, setKeyword] = useState<string>(""); // 검색어

  // 검색어 입력 이벤트
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 검색 버튼 클릭 이벤트
  const handleSearchButtonClick = () => {
    navigate(`/search?keyword=${keyword}`); // 검색 결과 페이지로 이동
  };

  // 로그인 / 로그아웃 버튼 클릭 이벤트
  const handleLoginORLogoutButtonClick = () => {
    if (state.isLoggedIn) {
      // 로그인 상태일 경우 로그아웃 처리
      jobsiteUserLogout().then(() => {
        dispatch({ type: "LOGOUT" }); // 로그아웃 상태로 변경

        window.location.reload(); // 로그아웃 성공 시 페이지 새로고침
      });
    } else {
      // 로그아웃 상태일 경우 로그인 페이지로 이동
      navigate("/login");
    }
  };

  // 내 정보 / 회원가입 버튼 클릭 이벤트
  const handleMyInfoOrSignUpButtonClick = () => {
    if (state.isLoggedIn) {
      // 로그인 상태일 경우 회원 서비스 페이지로 이동
      navigate("/service");
    } else {
      // 로그아웃 상태일 경우 회원가입 페이지로 이동
      navigate("/signup");
    }
  };

  return (
    <div className="relative flex h-[148px] min-h-[148px] w-full flex-col bg-white">
      <div className="w-full border-b border-solid border-normal">
        <div className="mx-auto flex h-[88px] min-h-[88px] w-full max-w-[1240px] items-center justify-between p-5">
          {/* 로고 이미지 */}
          <button type="button" className="">
            <h1
              className="py-2 text-[32px] text-[#DC143C]"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="고알바" className="mx-auto h-[36px]" />
            </h1>
          </button>

          {/* 검색바 */}
          <div className="relative flex h-12 min-h-12 w-[480px] rounded border border-solid border-[#DC143C] px-2 py-2.5">
            <img
              src="/assets/images/icons/svg/search_red.svg"
              alt="Search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={handleSearchButtonClick}
            />
            <input
              type="text"
              className="h-full w-full"
              value={keyword || ""}
              onChange={handleKeywordChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchButtonClick();
                }
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="w-full border-b border-solid border-normal"
        onMouseEnter={() => setIsMenuOpen(true)} // 마우스 오버 시 메뉴 열림
        onMouseLeave={() => setIsMenuOpen(false)} // 마우스 아웃 시 메뉴 닫힘
      >
        <div className="mx-auto flex h-[60px] min-h-[60px] w-full max-w-[1240px] items-center justify-between">
          {/* 메뉴 depth1 */}
          <ul className="flex h-full">
            <li className="flex w-40 cursor-pointer items-center justify-center text-base font-semibold text-[#666666]">
              채용정보
            </li>
            <li className="flex w-40 cursor-pointer items-center justify-center text-base font-semibold text-[#666666]">
              회원서비스
            </li>
            <li className="flex w-40 cursor-pointer items-center justify-center text-base font-semibold text-[#666666]">
              부가서비스
            </li>
            <li className="flex w-40 cursor-pointer items-center justify-center text-base font-semibold text-[#666666]">
              고객지원
            </li>
          </ul>

          {/* 로그인 / 로그아웃, 내 정보 / 회원가입 */}
          <div className="mr-5 flex h-8 min-h-8 items-center justify-center gap-2.5">
            <button
              type="button"
              className="flex h-full w-[84px] items-center justify-center whitespace-nowrap rounded bg-[#FFD700] text-base font-semibold text-[#666666]"
              onClick={handleLoginORLogoutButtonClick}
            >
              {state.isLoggedIn ? "로그아웃" : "로그인"}
            </button>
            <button
              type="button"
              className="flex h-full w-[84px] items-center justify-center whitespace-nowrap rounded bg-[#DC143C] text-base font-semibold text-white"
              onClick={handleMyInfoOrSignUpButtonClick}
            >
              {state.isLoggedIn ? "내 정보" : "회원가입"}
            </button>
          </div>
        </div>
      </div>

      {/* 메뉴 depth2 */}
      {isMenuOpen && (
        <div
          className="absolute left-0 top-full z-[1000] mt-[2px] w-full border-b border-solid border-normal bg-white"
          onMouseEnter={() => setIsMenuOpen(true)} // 마우스 오버 시 메뉴 열림
          onMouseLeave={() => setIsMenuOpen(false)} // 마우스 아웃 시 메뉴 닫힘
        >
          <div className="mx-auto flex h-full w-full max-w-[1240px]">
            {/* 채용정보 */}
            <ul className="flex w-40 flex-col py-2">
              {RECRUiTMENT_INFO.map((item, index) => (
                <li
                  key={index}
                  className="flex h-[50px] cursor-pointer items-center justify-center whitespace-nowrap text-base font-semibold text-[#666666] hover:bg-[#F5F5F5]"
                  onClick={() => navigate(item.link)}
                >
                  {item.title}
                </li>
              ))}
            </ul>

            {/* 회원서비스 */}
            <ul className="flex w-40 flex-col py-2">
              {MEMBER_SERVICE.map((item, index) => (
                <li
                  key={index}
                  className="flex h-[50px] cursor-pointer items-center justify-center whitespace-nowrap text-base font-semibold text-[#666666] hover:bg-[#F5F5F5]"
                  onClick={() => navigate(item.link)}
                >
                  {item.title}
                </li>
              ))}
            </ul>

            {/* 부가서비스 */}
            <ul className="flex w-40 flex-col py-2">
              {ADDITIONAL_SERVICE.map((item, index) => (
                <li
                  key={index}
                  className="flex h-[50px] cursor-pointer items-center justify-center whitespace-nowrap text-base font-semibold text-[#666666] hover:bg-[#F5F5F5]"
                  onClick={() => {
                    // 급여계산기, 주휴수당계산기는 팝업으로 열기
                    const popupWidth = 400;
                    const popupHeight = 600;

                    window.open(
                      item.link,
                      "_blank",
                      `width=${popupWidth},height=${popupHeight}`,
                    );
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>

            {/* 고객지원 */}
            <ul className="flex w-40 flex-col py-2">
              {CUSTOMER_SUPPORT.map((item, index) => (
                <li
                  key={index}
                  className="flex h-[50px] cursor-pointer items-center justify-center whitespace-nowrap text-base font-semibold text-[#666666] hover:bg-[#F5F5F5]"
                  onClick={() => navigate(item.link)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainHeaderPC;
