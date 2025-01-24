import { useEffect, useState } from "react";
import AdvertisementBanner from "../AdvertisementBanner";
import AppBar from "../AppBar";
import { useNavigate } from "react-router-dom";
import { formMailAdSearchFocusList, JobSiteList } from "../../api/post";
import Slider from "react-slick";
import { useAuth } from "../../contexts/AuthContext";
import { noticeFindAllList, NoticeFindAllListRequest } from "../../api/notice";
import RegionMenuMobile from "../RegionMenuMobile";

interface MenuMobileProps {
  isOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function MenuMobile(menuMobileProps: MenuMobileProps) {
  const navigate = useNavigate();
  const { state } = useAuth();

  const { isOpen, setIsMenuOpen } = menuMobileProps;

  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState<boolean>(false); // 지역 메뉴 오픈 여부

  const [currentMenu, setCurrentMenu] = useState<string>("채용정보"); // 현재 선택 메뉴

  const [noticeTitle, setNoticeTitle] = useState<string>(); // 공지사항 제목

  const [focusList, setFocusList] = useState<JobSiteList[]>(); // 광고 배너 리스트
  const [focusTotalPage, setFocusTotalPage] = useState<number>(); // 광고 배너 총 페이지 수

  // 뒤로가기 버튼 클릭 이벤트
  const handleBackButtonClick = () => {
    setIsMenuOpen(false);
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 공지사항 조회
    const noticeFindAllListRequest: NoticeFindAllListRequest = {
      page: 1,
      size: 1,
      type: "B01", // 공지사항
    };

    noticeFindAllList(noticeFindAllListRequest).then((response) => {
      setNoticeTitle(response?.noticeList[0].title); // 공지사항 첫번째 제목 설정
    });

    // 포커스 배너 조회
    const formMailAdSearchGradeListRequest = {
      page: 1,
      size: 1,
    };

    formMailAdSearchFocusList(formMailAdSearchGradeListRequest).then(
      (response) => {
        if (response?.jobSiteList) {
          setFocusTotalPage(response.totalPages); // 포커스 배너 총 페이지 수 설정
        }
      },
    );
  }, []);

  // 포커스 배너 전체 페이지 변경 시 실행 (슬라이더 설정)
  useEffect(() => {
    if (focusTotalPage) {
      const focusReq = { page: 1, size: 1 * focusTotalPage }; // 포커스 배너 조회 Request (페이지당 1개)

      formMailAdSearchFocusList(focusReq).then((response) => {
        if (response?.jobSiteList) {
          setFocusList(response.jobSiteList); // 포커스 배너 리스트 설정
        }
      });
    }
  }, [focusTotalPage]);

  // 메뉴가 열렸을 때 body의 스크롤을 막음
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 메뉴가 열렸을 때 스크롤 막음
    } else {
      document.body.style.overflow = ""; // 메뉴가 닫혔을 때 스크롤 허용
    }

    return () => {
      document.body.style.overflow = ""; // 컴포넌트 언마운트 시 스크롤 허용
    };
  }, [isOpen]);

  if (!isOpen) return null; // 메뉴가 닫혔을 때 null 반환

  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-full flex-col overflow-y-auto">
      <div className="absolute left-0 top-0 h-full w-full overflow-y-auto bg-white">
        <AppBar title={"메뉴"} handleBackButtonClick={handleBackButtonClick} />

        {/* 공지 / 로그인 버튼 / 포커스 배너 */}
        <div className="flex w-full flex-col items-start bg-main px-[10px] pt-[10px]">
          <div className="flex items-center gap-[5px]">
            <img
              src="/assets/images/icons/svg/bell.svg"
              alt="Bell"
              className="w-3"
            />
            <span className="text-sm font-medium">공지</span>
            <span className="text-sm text-[#666666]">{noticeTitle}</span>
          </div>

          {/* 로그인 상태가 아닐 때 로그인 버튼 노출 */}
          {!state.isLoggedIn && (
            <div className="mt-[14px] flex h-40 w-full flex-col items-center justify-between bg-white px-[65px] py-[30px]">
              <span className="text-center text-sm">
                회원이 되셔서
                <br />
                다양한 혜택들을 누려보세요!
              </span>
              <div className="flex min-h-9 items-center justify-center gap-2.5">
                <button
                  type="button"
                  className="h-full min-w-[100px] border border-solid border-normal bg-[#DC143C] text-sm font-semibold text-white"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </button>
                <button
                  type="button"
                  className="h-full min-w-[100px] border border-solid border-normal bg-[#FFD700] text-sm font-semibold text-[#666666]"
                  onClick={() => navigate("/signup")}
                >
                  회원가입
                </button>
              </div>
            </div>
          )}

          {/* 포커스 배너 슬라이더 */}
          <div className="my-5 w-full">
            <Slider
              infinite={false}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
            >
              {focusList?.map((item, index) => (
                <AdvertisementBanner key={index} jobsite={item} />
              ))}
            </Slider>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex h-full w-full bg-main">
          {/* Depth 1 */}
          <ul className="bg flex h-full min-w-[140px] flex-col">
            <li
              className={`${currentMenu === "채용정보" && "bg-white"} flex h-16 w-full cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
              onClick={() => setCurrentMenu("채용정보")}
            >
              채용정보
            </li>
            <li
              className={`${currentMenu === "회원서비스" && "bg-white"} flex h-16 w-full cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
              onClick={() => {
                setCurrentMenu("회원서비스");
                navigate("/service");
              }}
            >
              회원서비스
            </li>
            <li
              className={`${currentMenu === "부가서비스" && "bg-white"} flex h-16 w-full cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
              onClick={() => setCurrentMenu("부가서비스")}
            >
              부가서비스
            </li>
            <li
              className={`${currentMenu === "고객지원" && "bg-white"} flex h-16 w-full cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
              onClick={() => setCurrentMenu("고객지원")}
            >
              고객지원
            </li>
          </ul>

          {/* Depth 2 */}
          <ul className="flex w-full flex-col bg-white py-[5px]">
            {/* 채용정보 */}
            {currentMenu === "채용정보" && (
              <>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/recommend")}
                >
                  코티잡 추천!
                </li>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => {
                    setIsRegionMenuOpen(!isRegionMenuOpen);
                  }}
                >
                  지역!
                </li>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/short")}
                >
                  단기!
                </li>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/urgent")}
                >
                  급구!
                </li>
              </>
            )}

            {/* 부가서비스 */}
            {currentMenu === "부가서비스" && (
              <>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/salary")}
                >
                  급여계산기
                </li>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/weekly")}
                >
                  주휴수당계산기
                </li>
              </>
            )}

            {currentMenu === "고객지원" && (
              <>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/notice")}
                >
                  공지사항
                </li>
                <li
                  className="w-full cursor-pointer px-[10px] py-[15px] text-sm"
                  onClick={() => navigate("/faq")}
                >
                  자주 묻는 질문 FAQ
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* 지역 선택 메뉴 */}
      {isRegionMenuOpen && (
        <RegionMenuMobile
          isOpen={isRegionMenuOpen}
          setIsRegionMenuOpen={setIsRegionMenuOpen}
        />
      )}
    </div>
  );
}

export default MenuMobile;
