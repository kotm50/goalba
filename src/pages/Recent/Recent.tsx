import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";
import {
  formMailAdSelectByRegionsSort,
  FormMailAdSelectByRegionsSortRequest,
  JobSiteList,
  jobsiteUserRecentViews,
} from "../../api/post";
import { checkAndReissueToken } from "../../api/baseUrl";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import PlatinumPost from "../../components/PlatinumPost";
import MainFooterPC from "../../components/MainFooterPC";
import GoldPost from "../../components/GoldPost";
import Slider from "react-slick";

function Recent() {
  const { state } = useAuth();
  const { isLoggedIn, user } = state;

  const navigate = useNavigate();

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [isAllShow, setIsAllShow] = useState<boolean>(true); // 전체 공고 / 진행 중 공고

  const [recentJobList, setRecentJobList] = useState<JobSiteList[]>([]); // 최근 본 공고 리스트

  const [recommendList, setRecommendList] = useState<JobSiteList[]>([]); // 추천 공고 리스트
  const [recommendTotalPage, setRecommendTotalPage] = useState<number>(); // 추천 공고 총 페이지
  const [currentRecommendPage, setCurrentRecommendPage] = useState<number>(1); // 추천 공고 현재 페이지

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 로그인 되어있지 않으면 로그인 페이지로 이동
  if (!isLoggedIn) {
    navigate("/login", { replace: true });
  }

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    checkAndReissueToken(); // 토큰 체크

    if (!user) return; // 로그인 정보가 없으면 실행하지 않음

    // const savedRecentAids = getRecentJobs(user.userId);
    // setRecentAids(savedRecentAids);

    // 최근 본 공고 조회 API 호출
    jobsiteUserRecentViews(user.userId).then((response) => {
      if (response?.code === "C000") {
        setRecentJobList(response.jobSiteList);
      }
    });

    // 추천 조회 API 호출
    const recommendReq: FormMailAdSelectByRegionsSortRequest = {
      page: 1,
      size: 5,
      adType: "추천",
    };

    // 추천 조회 API 호출
    formMailAdSelectByRegionsSort(recommendReq).then((response) => {
      if (response && response.code === "C000") {
        setRecommendTotalPage(response.totalPages);
      }
    });

    // 스크롤 감지를 위한 이벤트 리스너 추가
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // 스크롤 이벤트 리스너 해제
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 추천 공고 조회 시 실행
  useEffect(() => {
    if (recommendTotalPage) {
      const recommendReq: FormMailAdSelectByRegionsSortRequest = {
        page: 1,
        size: 5 * recommendTotalPage,
        adType: "추천",
      };

      formMailAdSelectByRegionsSort(recommendReq).then((response) => {
        if (response?.code === "C000" && response?.jobSiteList) {
          setRecommendList(response.jobSiteList);
        }
      });
    }
  }, [recommendTotalPage]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"최근 열람 공고"} /> : <MainHeaderPC />}

      <div className="flex w-full flex-col items-center px-5 pt-[30px] pc:mx-auto pc:max-w-[1240px] pc:pt-3">
        {/* PC 버전 타이틀 */}
        <div className="hidden w-full flex-col gap-2 pb-[11px] pc:flex">
          <h2 className="text-[32px] font-semibold">최근 열람 공고</h2>
          {/* <div className="flex flex-col">
            <p className="text-base leading-[30px] text-[#666666]">
              • 채용정보 상단의 하트 모양 버튼을 누르면 공고가 저장됩니다
            </p>
            <p className="text-base leading-[30px] text-[#666666]">
              • 공고를 클릭하시면 해당 공고의 내용을 보실 수 있습니다
            </p>
            <p className="text-base leading-[30px] text-[#666666]">
              • 스크랩한 채용정보는 등록일로부터 90일간 보관됩니다
            </p>
          </div> */}
        </div>

        {/* 모바일 버전 전체 공고 / 진행 중 공고 */}
        <div className="flex h-9 min-h-9 w-full pc:hidden">
          <button
            type="button"
            className={`${isAllShow ? "border border-solid border-black bg-white" : "border border-solid border-normal bg-main"} h-full flex-1 text-base font-bold`}
            onClick={() => setIsAllShow(true)}
          >
            전체 공고
          </button>
          <button
            type="button"
            className={`${isAllShow ? "border border-solid border-normal bg-main" : "border border-solid border-black bg-white"} h-full flex-1 text-base font-bold`}
            onClick={() => setIsAllShow(false)}
          >
            진행 중 공고
          </button>
        </div>

        {/* PC 버전 서브 타이틀 */}
        <h3 className="mt-5 hidden w-full justify-start text-xl font-semibold pc:flex">
          헤드라인 채용공고
        </h3>

        {/* 전체 선택 / 삭제 */}
        {/* <div className="mt-5 flex w-full items-center justify-between">
          <div className="flex items-center gap-[5px]">
            <div
              className={`${allChecked ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
              onClick={handleAllCheckChange}
            >
              {allChecked ? (
                <img
                  src="/assets/images/icons/svg/check_white.svg"
                  alt=""
                  className="h-4 w-4"
                />
              ) : (
                <img
                  src="/assets/images/icons/svg/check.svg"
                  alt=""
                  className="h-4 w-4"
                />
              )}
            </div>
            <span className="text-sm">전체 선택</span>
          </div>

          <div className="flex items-center gap-[5px] pc:gap-2.5">
            <button
              type="button"
              className="text-xs pc:text-sm"
              onClick={handleSelectedDeleteButtonClick}
            >
              선택 공고 삭제
            </button>
            <div className="h-3 w-[1px] bg-[#666666]"></div>
            <button
              type="button"
              className="text-xs pc:text-sm"
              onClick={handleAllDeleteButtonClick}
            >
              전체 공고 삭제
            </button>
          </div>
        </div> */}

        {/* 최근 본 공고 리스트 */}
        <div className="mt-5 grid grid-cols-2 gap-3 pc:w-full pc:grid-cols-4 pc:gap-5 pc:pb-10">
          {recentJobList?.map((item, index) => (
            <PlatinumPost key={index} jobsite={item} />
          ))}
        </div>

        {/* 모바일 버전 추천 공고 */}
        <div className="mt-7 flex w-full flex-col gap-[10px] pb-[31px] pc:hidden">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-sm font-semibold">
              회원님께 딱 알맞는 추천공고
            </h2>
            {recommendList && recommendList.length > 0 && (
              <span className="text-sm font-semibold">
                {currentRecommendPage}/ {recommendTotalPage}
              </span>
            )}
          </div>
          <Slider
            infinite={true}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            adaptiveHeight={true}
            beforeChange={(_, newIndex) =>
              setCurrentRecommendPage(newIndex + 1)
            }
          >
            {recommendList &&
              Array.from(
                {
                  length: Math.ceil(recommendList.length / 5),
                },
                (_, pageIndex) => {
                  const start = pageIndex * 5; // 시작 인덱스
                  const end = start + 5; // 끝 인덱스
                  const chunk = recommendList.slice(start, end); // 5개씩 슬라이스

                  return (
                    <div key={pageIndex} className="h-full w-full px-2">
                      <div className="flex w-full flex-col gap-2.5">
                        {chunk.map((item, index) => (
                          <GoldPost key={index} aid={item.aid} jobsite={item} />
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
          </Slider>
        </div>

        {/* 페이지네이션 */}
        {/* <div className="w-full pb-5 pt-[17px] pc:pb-[90px] pc:pt-[30px]">
          <Pagination />
        </div> */}
      </div>

      {/* PC 버전 푸터 */}
      {isMobileScreen || <MainFooterPC />}

      {/* 맨 위로 이동 */}
      {showScrollButton && (
        <button
          type="button"
          className={`${isMobileScreen ? "bottom-4 right-4" : "bottom-28 right-20"} fixed flex items-center justify-center`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/assets/images/icons/svg/move_to_top.svg"
            alt="Move to Top"
            className="h-8 w-8"
          />
        </button>
      )}
    </div>
  );
}

export default Recent;
