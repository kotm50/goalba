import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainFooterPC from "../../components/MainFooterPC";
import { useEffect, useState } from "react";
import { jobsiteUserFindOne } from "../../api/user";
import { noticeFindAllList, NoticeFindAllListRequest } from "../../api/notice";
import { useNavigate } from "react-router-dom";
import {
  formMailAdSearchFocusList,
  JobSiteList,
  jobsiteUserFindBookmarkList,
  JobsiteUserFindBookmarkListRequest,
  jobsiteUserRecentViews,
} from "../../api/post";
import { useAuth } from "../../contexts/AuthContext";
import { checkAndReissueToken } from "../../api/baseUrl";
import AdvertisementBanner from "../../components/AdvertisementBanner";
import Slider from "react-slick";
import MainFooterMobile from "../../components/MainFooterMobile";
import ConfirmPopup from "../../components/ConfirmPopup";

function UserService() {
  const { state } = useAuth();
  const { isLoggedIn, user } = state;
  const navigate = useNavigate();

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [noticeTitle, setNoticeTitle] = useState<string>(); // 공지사항 제목

  const [focusList, setFocusList] = useState<JobSiteList[]>(); // 광고 배너 리스트
  const [focusTotalPage, setFocusTotalPage] = useState<number>(); // 광고 배너 총 페이지 수

  const [scrapeCount, setScrapeCount] = useState<number>(0); // 스크랩 수
  const [favoriteCount, setFavoriteCount] = useState<number>(0); // 좋아요 수
  const [recentJobCount, setRecentJobCount] = useState<number>(0); // 최근에 본 공고 수

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 오픈 여부

  // const [userInfo, setUserInfo] = useState<UserDto | null>(null); // 회원 정보

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    checkAndReissueToken(); // 토큰 체크

    // 공지사항 조회
    const noticeFindAllListRequest: NoticeFindAllListRequest = {
      page: 1,
      size: 1,
      type: "B01",
    };
    noticeFindAllList(noticeFindAllListRequest).then((response) => {
      setNoticeTitle(response?.noticeList[0].title);
    });

    // 광고 배너 조회
    const formMailAdSearchGradeListRequest = {
      page: 1,
      size: 1,
    };
    formMailAdSearchFocusList(formMailAdSearchGradeListRequest).then(
      (response) => {
        if (response?.jobSiteList) {
          setFocusTotalPage(response.totalPages);
        }
      },
    );

    // 회원 한명 정보 조회
    if (user?.userId) {
      jobsiteUserFindOne(user.userId).then((response) => {
        if (response) {
          // setUserInfo(response);
        }
      });
    } else {
      console.error("회원 정보 조회 실패");
      navigate("/login", { replace: true });
    }

    // 스크랩 개수 조회
    if (user?.userId) {
      const scrapeRequest: JobsiteUserFindBookmarkListRequest = {
        page: 1,
        size: 1000,
        userId: user.userId,
        type: "scrape",
      };

      jobsiteUserFindBookmarkList(scrapeRequest).then((response) => {
        if (response) {
          setScrapeCount(response.totalCount);
        }
      });
    }

    // 좋아요 개수 조회
    if (user?.userId) {
      const favoriteRequest: JobsiteUserFindBookmarkListRequest = {
        page: 1,
        size: 1000,
        userId: user.userId,
        type: "favorite",
      };

      jobsiteUserFindBookmarkList(favoriteRequest).then((response) => {
        if (response) {
          setFavoriteCount(response.totalCount);
        }
      });
    }

    // 최근에 본 공고 조회
    if (user?.userId) {
      jobsiteUserRecentViews(user.userId).then((response) => {
        if (response?.code === "C000") {
          setRecentJobCount(response.jobSiteList?.length || 0);
        } else {
          setRecentJobCount(0);
        }
      });
    }
  }, []);

  // 포커스 배너 조회
  useEffect(() => {
    if (focusTotalPage) {
      const focusReq = { page: 1, size: 1 * focusTotalPage }; // 1페이지당 1개씩 조회
      formMailAdSearchFocusList(focusReq).then((response) => {
        if (response?.jobSiteList) {
          setFocusList(response.jobSiteList);
        }
      });
    }
  }, [focusTotalPage]);

  // 로그인 되어있지 않으면 로그인 페이지로 이동
  useEffect(() => {
    if (!isLoggedIn) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인이 필요한 서비스입니다.");
      setIsConfirmPopupOpen(true);
    }
  }, [isLoggedIn]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"회원 서비스"} /> : <MainHeaderPC />}

      <div className="flex w-full flex-col px-[10px] pt-[11px] pc:mx-auto pc:w-[480px] pc:gap-5 pc:px-0 pc:pb-[328px] pc:pt-[52px]">
        {/* 모바일 버전 공지 */}
        <div className="flex items-center gap-[5px] pc:hidden">
          <img
            src="/assets/images/icons/svg/bell.svg"
            alt="Bell"
            className="w-3"
          />
          <span className="text-sm font-medium">공지</span>
          <span className="text-sm text-[#666666]">{noticeTitle}</span>
        </div>

        {/* PC 버전 타이틀 */}
        <div className="hidden w-full items-center justify-between pc:flex">
          <h2 className="text-[32px] font-semibold">회원정보</h2>
        </div>

        {/* 회원정보 */}
        {isMobileScreen || (
          <div className="mt-[15px] flex w-full flex-col gap-2.5 rounded-[10px] bg-white p-5 pc:mt-0 pc:gap-5">
            <h2 className="text-sm font-semibold pc:hidden">회원정보</h2>
            <div className="flex w-full flex-col items-center gap-2.5 pc:gap-5">
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  이름
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.userName}
                </span>
              </div>
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  연락처
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.phone}
                </span>
              </div>
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  이메일
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.email}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex h-9 min-h-9 items-center justify-center rounded bg-[#DC143C] text-sm font-semibold text-white"
              onClick={() => navigate("/edit")}
            >
              개인정보수정
            </button>
          </div>
        )}

        {/* 로그인 되어있을 때만 광고 배너 노출 */}
        {isLoggedIn && isMobileScreen && (
          <div className="mb-[25px] mt-[11px] w-full">
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
        )}
      </div>

      {isMobileScreen && (
        <>
          {/* 활동 */}
          <div className="flex w-full flex-col gap-2">
            <h3 className="ml-[10px] text-base">활동</h3>
            <ul className="flex w-full flex-col gap-[30px] border-y border-solid border-normal bg-white py-[11px]">
              {/* 스크랩 */}
              <li
                className="flex w-full cursor-pointer items-center justify-between px-[10px]"
                onClick={() => navigate("/scrape")}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/star.svg"
                    alt="Scrape"
                    className="w-5"
                  />
                  <span className="text-base">스크랩</span>
                </div>
                <div className="flex items-center gap-[23px]">
                  <span className="text-base">{scrapeCount || 0}건</span>
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </div>
              </li>
              {/* 좋아요 */}
              <li
                className="flex w-full cursor-pointer items-center justify-between px-[10px]"
                onClick={() => navigate("/favorite")}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/heart.svg"
                    alt="Like"
                    className="w-5"
                  />
                  <span className="text-base">좋아요</span>
                </div>
                <div className="flex items-center gap-[23px]">
                  <span className="text-base">{favoriteCount || 0}건</span>
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </div>
              </li>
              {/* 최근에 본 공고 */}
              <li
                className="flex w-full cursor-pointer items-center justify-between px-[10px]"
                onClick={() => navigate("/recent")}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/recent.svg"
                    alt="Recent"
                    className="w-[18px]"
                  />
                  <span className="text-base">최근 열람 공고</span>
                </div>
                <div className="flex items-center gap-[23px]">
                  <span className="text-base">{recentJobCount}건</span>
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </div>
              </li>
            </ul>
          </div>

          {/* 개인 회원 */}
          <div className="mt-[50px] flex w-full flex-col gap-2">
            <h3 className="ml-[10px] text-base">개인 회원</h3>
            <ul className="flex w-full flex-col gap-[30px] border-y border-solid border-normal bg-white py-[11px]">
              {/* 지원 현황 */}
              <li className="hidden w-full cursor-pointer items-center justify-between px-[10px]">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/apply_black.svg"
                    alt="Apply"
                    className="w-[21px]"
                  />
                  <span className="text-base">지원 현황</span>
                </div>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
              {/* 관심 기업 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <div className="hidden items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/interested.svg"
                    alt="Interested"
                    className="w-5"
                  />
                  <span className="text-base">관심 기업</span>
                </div>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
              {/* 문의 내역 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/icons/svg/inquirement.svg"
                    alt="Inquirement"
                    className="w-5"
                  />
                  <span className="text-base">문의 내역</span>
                </div>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
            </ul>
          </div>

          {/* 기업 회원 */}
          <div className="mt-[50px] flex hidden w-full flex-col gap-2">
            <h3 className="ml-[10px] text-base">기업 회원</h3>
            <ul className="flex w-full flex-col gap-[30px] border-y border-solid border-normal bg-white py-[11px]">
              {/* 공고관리 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <span className="text-base">공고관리</span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
              {/* 공고등록 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <span className="text-base">공고등록</span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
              {/* 공고등록상품 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <span className="text-base">공고등록상품</span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
              {/* 유료결제내역 */}
              <li className="flex w-full cursor-pointer items-center justify-between px-[10px]">
                <span className="text-base">유료결제내역</span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <img
                    src="/assets/images/icons/svg/right_arrow_bold.svg"
                    alt="Arrow"
                    className="w-2"
                  />
                </button>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* PC 버전 푸터 */}
      {isMobileScreen || <MainFooterPC />}

      {/* 모바일 버전 푸터 */}
      {isMobileScreen && <MainFooterMobile />}

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
    </div>
  );
}

export default UserService;
