import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import {
  formMailAdSelectByRegionsSort,
  FormMailAdSelectByRegionsSortRequest,
  JobSiteList,
  jobsiteUserDeleteBookmarkAll,
  JobsiteUserDeleteBookmarkAllRequest,
  jobsiteUserDeleteBookmarkOne,
  JobsiteUserDeleteBookmarkOneRequest,
  jobsiteUserFindBookmarkList,
  JobsiteUserFindBookmarkListRequest,
} from "../../api/post";
import { checkAndReissueToken } from "../../api/baseUrl";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import PlatinumPost from "../../components/PlatinumPost";
import MainFooterPC from "../../components/MainFooterPC";
import GoldPost from "../../components/GoldPost";
import Slider from "react-slick";

function Favorite() {
  const { state } = useAuth();
  const { isLoggedIn, user } = state;

  const navigate = useNavigate();

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [isAllShow, setIsAllShow] = useState<boolean>(true); // 전체 공고 / 진행 중 공고
  const [allChecked, setAllChecked] = useState<boolean>(false); // 전체 선택 체크박스
  const [checkedItems, setCheckedItems] = useState<string[]>([]); // 개별 체크박스

  const [scrapeList, setScrapeList] = useState<JobSiteList[]>([]); // 좋아요 목록
  const [scrapeTotalPage, setScrapeTotalPage] = useState<number>(); // 좋아요 총 페이지
  const [currentScrapePage, setCurrentScrapePage] = useState<number>(1); // 좋아요 현재 페이지

  const [recommendList, setRecommendList] = useState<JobSiteList[]>([]);
  const [recommendTotalPage, setRecommendTotalPage] = useState<number>(); // 추천 공고 총 페이지
  const [currentRecommendPage, setCurrentRecommendPage] = useState<number>(1); // 추천 공고 현재 페이지

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 로그인 되어있지 않으면 로그인 페이지로 이동
  if (!isLoggedIn) {
    navigate("/login", { replace: true });
  }

  const handleCheck = (aid: string) => {
    setCheckedItems((prev) =>
      prev.includes(aid) ? prev.filter((item) => item !== aid) : [...prev, aid],
    );
  };

  // 전체 선택/해제
  const handleAllCheckChange = () => {
    if (allChecked) {
      setCheckedItems([]); // 전체 해제
    } else {
      setCheckedItems(scrapeList.map((item) => item.aid)); // 전체 선택
    }
    setAllChecked(!allChecked);
  };

  // 선택 공고 삭제 버튼 클릭 이벤트
  const handleSelectedDeleteButtonClick = async () => {
    // 선택된 공고 삭제 API 호출
    if (user?.userId) {
      try {
        const deleteRequests = checkedItems.map((aid) => {
          const jobsiteUserDeleteBookmarkOneRequest: JobsiteUserDeleteBookmarkOneRequest =
            {
              userId: user.userId,
              aid,
              type: "favorite",
            };

          return jobsiteUserDeleteBookmarkOne(
            jobsiteUserDeleteBookmarkOneRequest,
          );
        });

        // 모든 삭제 요청이 완료될 때까지 기다림
        await Promise.all(deleteRequests);

        // 스크랩 목록 다시 불러오기
        const scrapeRequest: JobsiteUserFindBookmarkListRequest = {
          page: 1,
          size: 6,
          userId: user.userId,
          type: "favorite",
        };

        const response = await jobsiteUserFindBookmarkList(scrapeRequest);
        if (response) {
          setScrapeList(response.jobSiteList);
          setCheckedItems([]); // 체크박스 초기화
          setAllChecked(false); // 전체 체크 초기화
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 전체 공고 삭제 버튼 클릭 이벤트
  const handleAllDeleteButtonClick = () => {
    if (!user?.userId) return;

    const jobsiteUserDeleteBookmarkAllRequest: JobsiteUserDeleteBookmarkAllRequest =
      {
        userId: user.userId,
        type: "favorite",
      };

    // 전체 공고 삭제 API 호출
    jobsiteUserDeleteBookmarkAll(jobsiteUserDeleteBookmarkAllRequest).then(
      (response) => {
        if (response) {
          if (response.code === "C000") {
            // 스크랩 목록 다시 불러오기
            const scrapeRequest: JobsiteUserFindBookmarkListRequest = {
              page: 1,
              size: 6,
              userId: user.userId,
              type: "favorite",
            };

            jobsiteUserFindBookmarkList(scrapeRequest).then((response) => {
              if (response) {
                setScrapeList(response.jobSiteList);
                setCheckedItems([]); // 체크박스 초기화
                setAllChecked(false); // 전체 체크 초기화
              }
            });
          }
        }
      },
    );
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    checkAndReissueToken(); // 토큰 체크

    // 스크랩 조회 API 호출
    if (user?.userId) {
      const scrapeRequest: JobsiteUserFindBookmarkListRequest = {
        page: 1,
        size: 6,
        userId: user.userId,
        type: "favorite",
      };

      jobsiteUserFindBookmarkList(scrapeRequest).then((response) => {
        if (response?.totalPages) {
          setScrapeTotalPage(response.totalPages);
        }
      });
    }

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

  // 스크랩 공고 조회 시 실행
  useEffect(() => {
    if (scrapeTotalPage && user?.userId) {
      const scrapeReq: JobsiteUserFindBookmarkListRequest = {
        page: 1,
        size: 6 * scrapeTotalPage,
        userId: user?.userId,
        type: "favorite",
      };

      jobsiteUserFindBookmarkList(scrapeReq).then((response) => {
        if (response?.code === "C000") {
          setScrapeList(response.jobSiteList);
        }
      });
    }
  }, [scrapeTotalPage]);

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

  // 전체 선택 상태 변경 시 실행
  useEffect(() => {
    setAllChecked(
      checkedItems.length === scrapeList.length && scrapeList.length > 0,
    );
  }, [checkedItems, scrapeList]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"좋아요"} /> : <MainHeaderPC />}

      <div className="flex w-full flex-col items-center px-5 pt-[30px] pc:mx-auto pc:max-w-[1240px] pc:pt-3">
        {/* PC 버전 타이틀 */}
        <div className="hidden w-full flex-col gap-2 pb-[11px] pc:flex">
          <h2 className="text-[32px] font-semibold">좋아요</h2>
          <div className="flex flex-col">
            <p className="text-base leading-[30px] text-[#666666]">
              • 채용정보 상단의 하트 모양 버튼을 누르면 공고가 저장됩니다
            </p>
            <p className="text-base leading-[30px] text-[#666666]">
              • 공고를 클릭하시면 해당 공고의 내용을 보실 수 있습니다
            </p>
            <p className="text-base leading-[30px] text-[#666666]">
              • 좋아요한 채용정보는 등록일로부터 90일간 보관됩니다
            </p>
          </div>
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
        <div className="mt-5 flex w-full items-center justify-between">
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
        </div>

        {/* 모바일 버전 좋아요 공고 리스트 */}
        {isMobileScreen && (
          <div className="w-full">
            <div className="mt-3 flex w-full items-center justify-between">
              <h2 className="text-sm font-semibold">헤드라인 채용 공고</h2>
              {scrapeList && scrapeList.length > 0 && (
                <span className="text-sm font-semibold">
                  {currentScrapePage}/ {scrapeTotalPage}
                </span>
              )}
            </div>
            <Slider
              infinite={true}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              adaptiveHeight={true}
              beforeChange={(_, newIndex) => setCurrentScrapePage(newIndex + 1)}
            >
              {scrapeList &&
                Array.from(
                  {
                    length: Math.ceil(scrapeList.length / 6),
                  },
                  (_, pageIndex) => {
                    const start = pageIndex * 6; // 시작 인덱스
                    const end = start + 6; // 끝 인덱스
                    const chunk = scrapeList.slice(start, end); // 6개씩 슬라이스

                    return (
                      <div key={pageIndex} className="h-full w-full px-2">
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          {chunk.map((item, index) => (
                            <div key={index} className="relative">
                              <div
                                className={`${checkedItems.includes(item.aid) ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} absolute left-3 top-4 z-10 flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] pc:left-5 pc:top-5`}
                                onClick={() => handleCheck(item.aid)}
                              >
                                {checkedItems.includes(item.aid) ? (
                                  <img
                                    src="/assets/images/icons/svg/check_white.svg"
                                    alt="Checked"
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  <img
                                    src="/assets/images/icons/svg/check.svg"
                                    alt="Unchecked"
                                    className="h-4 w-4"
                                  />
                                )}
                              </div>
                              <PlatinumPost aid={item.aid} jobsite={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
            </Slider>
          </div>
        )}

        {/* PC 좋아요 공고 리스트 */}
        {!isMobileScreen && (
          <div className="mt-5 grid grid-cols-2 gap-3 pc:w-full pc:grid-cols-4 pc:gap-5 pc:pb-10">
            {scrapeList?.map((item, index) => (
              <div key={index} className="relative">
                <div
                  className={`${checkedItems.includes(item.aid) ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} absolute left-3 top-4 z-10 flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] pc:left-5 pc:top-5`}
                  onClick={() => handleCheck(item.aid)}
                >
                  {checkedItems.includes(item.aid) ? (
                    <img
                      src="/assets/images/icons/svg/check_white.svg"
                      alt="Checked"
                      className="h-4 w-4"
                    />
                  ) : (
                    <img
                      src="/assets/images/icons/svg/check.svg"
                      alt="Unchecked"
                      className="h-4 w-4"
                    />
                  )}
                </div>
                <PlatinumPost aid={item.aid} jobsite={item} />
              </div>
            ))}
          </div>
        )}

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

export default Favorite;
