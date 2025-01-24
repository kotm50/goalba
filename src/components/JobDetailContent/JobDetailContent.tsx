import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useRef, useState } from "react";
import MainFooterPC from "../MainFooterPC";
import { useParams } from "react-router-dom";
import {
  formMailAdFindNearInfo,
  formMailAdFindOneJobsite,
  jobsiteDupBookmarkCheck,
  JobsiteDupBookmarkCheckRequest,
  JobSiteList,
  jobsiteUserAddBookmark,
  JobsiteUserAddBookmarkRequest,
  jobsiteUserDeleteBookmarkOne,
  JobsiteUserDeleteBookmarkOneRequest,
  NearInfo,
  saveRecentJob,
} from "../../api/post";
import NaverMap from "../NaverMap/NaverMap";
import ApplyPopup from "../ApplyPopup";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmPopup from "../ConfirmPopup";
import Slider from "react-slick";

function JobDetailContent() {
  const { state } = useAuth();
  const user = state.user;

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const imgUrl = import.meta.env.VITE_IMG_URL; // 이미지 URL 접두어

  const param = useParams();
  const aid = param.id || ""; // params에서 공고 ID 가져오기

  const [jobPost, setJobPost] = useState<JobSiteList>(); // 공고 상세 정보 데이터
  const [currentTab, setCurrentTab] = useState("근무조건"); // 현재 탭
  const [nearInfo, setNearInfo] = useState<NearInfo[]>(); // 주변 역 정보

  const [photoList, setPhotoList] = useState<string[]>([]); // 공고 이미지 리스트

  const [isApplyPopupOpen, setIsApplyPopupOpen] = useState<boolean>(false); // 지원하기 팝업 오픈 여부

  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 오픈 여부
  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지

  const [canScraped, setCanScraped] = useState<boolean>(false); // 스크랩 할 수 있는지 여부
  const [canFavorite, setCanFavorite] = useState<boolean>(false); // 좋아요 할 수 있는지 여부

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  const conditionRef = useRef<HTMLDivElement>(null); // 근무조건 ref
  const detailRef = useRef<HTMLDivElement>(null); // 상세요강 ref
  const companyRef = useRef<HTMLDivElement>(null); // 기업정보 ref

  //전각 특수기호를 반각 특수기호로 변환하는 함수
  const unescapeHTML = (text: string): string => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

  // 날짜 포맷 변경 (ex. "2022. 12. 31(월)")
  const formatDateWithDay = (dateString: string): string => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = days[date.getDay()];

    return `${year}.${month}.${day}(${dayOfWeek})`;
  };

  // 연속된 요일을 포맷팅하는 함수 (ex. "월~금요일")
  const formatWorkDays = (workDays: string | null): string => {
    // 숫자를 요일로 매핑하는 배열 (월~일 순서)
    const daysMap = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];

    // null 값 처리
    if (!workDays) {
      return "요일협의";
    }

    // workDays를 숫자 배열로 변환 후 정렬 (월요일(1)부터 시작하도록 조정)
    const dayNumbers = workDays
      .split(",")
      .map((day) => Number(day.trim()))
      .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b)); // 일요일(0)을 7로 변환하여 정렬

    // 요일 배열로 변환
    const dayList = dayNumbers.map((num) => daysMap[num === 0 ? 6 : num - 1]);

    // 연속된 요일인지 확인
    const isConsecutive = dayNumbers.every((num, idx, arr) => {
      if (idx === 0) return true;
      return num === arr[idx - 1] + 1;
    });

    // 연속된 경우 "시작요일 ~ 끝요일" 형식으로 반환
    if (isConsecutive && dayList.length > 1) {
      return `${dayList[0]} ~ ${dayList[dayList.length - 1]}`;
    }

    // 불연속적인 요일 처리 (마지막 요일만 "요일" 포함)
    const formattedDays = dayList.map((day, idx, arr) =>
      idx === arr.length - 1 ? day : day.replace("요일", ""),
    );

    return formattedDays.join(", ");
  };

  // endDate 포맷 변경 (ex. "2022. 12. 31")
  const formatEndDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${year}. ${month}. ${day}`;
  };

  // 날짜 포맷팅 "마감 X일 전" 계산
  const formatUntilEndDate = (endDate: string): string => {
    const today = new Date(); // 오늘 날짜
    const deadline = new Date(endDate); // 마감 날짜

    // 시간 차이를 일 단위로 계산
    const timeDifference = deadline.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // 일 단위로 변환

    return `마감 ${daysRemaining}일 전`;
  };

  // 주소 복사
  const copyAddress = () => {
    const addressText = jobPost?.address?.trim();

    if (!addressText) return; // 주소가 없는 경우
    navigator.clipboard.writeText(addressText);
  };

  // 지원하기 버튼 클릭 이벤트
  const handleApplyButtonClick = () => {
    // 로그인 안된 경우
    if (!state.isLoggedIn) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인 후 이용 가능합니다.");
      setIsConfirmPopupOpen(true);
      return;
    }
    setIsApplyPopupOpen(true);
  };

  // 좋아요 추가 버튼 클릭 이벤트
  const handleFavoriteButtonClick = () => {
    // 로그인 안된 경우
    if (!user) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인 후 이용 가능합니다.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 좋아요 추가 API Request
    const jobsiteUserAddBookmarkRequest: JobsiteUserAddBookmarkRequest = {
      userId: user.userId,
      aid: aid,
      type: "favorite",
    };

    // 좋아요 추가 API 호출
    jobsiteUserAddBookmark(jobsiteUserAddBookmarkRequest).then((response) => {
      if (response && response.code === "C000") {
        // 좋아요 추가 성공 시
        setCanFavorite(false);
        setConfirmTitle("알림");
        setConfirmMessage("좋아요에 추가되었습니다.");
        setIsConfirmPopupOpen(true);
      }
    });
  };

  // 좋아요 삭제 버튼 클릭 이벤트
  const handleFavoriteDeleteButtonClick = () => {
    // 로그인 안된 경우
    if (!user) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인 후 이용 가능합니다.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 좋아요 삭제 API Request
    const jobsiteUserDeleteBookmarkOneRequest: JobsiteUserDeleteBookmarkOneRequest =
      {
        userId: user.userId,
        aid: aid,
        type: "favorite",
      };

    // 좋아요 삭제 API 호출
    jobsiteUserDeleteBookmarkOne(jobsiteUserDeleteBookmarkOneRequest).then(
      (response) => {
        if (response && response.code === "C000") {
          // 좋아요 삭제 성공 시
          setCanFavorite(true);
          setConfirmTitle("알림");
          setConfirmMessage("좋아요가 취소되었습니다.");
          setIsConfirmPopupOpen(true);
        }
      },
    );
  };

  // 스크랩 추가 클릭 이벤트
  const handleScrapeButtonClick = () => {
    // 로그인 안된 경우
    if (!user) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인 후 이용 가능합니다.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 스크랩 추가 API Request
    const jobsiteUserAddBookmarkRequest: JobsiteUserAddBookmarkRequest = {
      userId: user.userId,
      aid: aid,
      type: "scrape",
    };

    // 스크랩 추가 API 호출
    jobsiteUserAddBookmark(jobsiteUserAddBookmarkRequest).then((response) => {
      if (response && response.code === "C000") {
        // 스크랩 추가 성공 시
        setCanScraped(false);
        setConfirmTitle("알림");
        setConfirmMessage("스크랩에 추가되었습니다.");
        setIsConfirmPopupOpen(true);
      }
    });
  };

  // 스크랩 삭제 클릭 이벤트
  const handleScrapeDeleteButtonClick = () => {
    // 로그인 안된 경우
    if (!user) {
      setConfirmTitle("알림");
      setConfirmMessage("로그인 후 이용 가능합니다.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 스크랩 삭제 API Request
    const jobsiteUserDeleteBookmarkOneRequest: JobsiteUserDeleteBookmarkOneRequest =
      {
        userId: user.userId,
        aid: aid,
        type: "scrape",
      };

    // 스크랩 삭제 API 호출
    jobsiteUserDeleteBookmarkOne(jobsiteUserDeleteBookmarkOneRequest).then(
      (response) => {
        if (response && response.code === "C000") {
          // 스크랩 삭제 성공 시
          setCanScraped(true);
          setConfirmTitle("알림");
          setConfirmMessage("스크랩이 취소되었습니다.");
          setIsConfirmPopupOpen(true);
        }
      },
    );
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 상단으로 이동

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id; // ref에 설정된 id 가져오기
            setCurrentTab(id); // 현재 보이는 섹션으로 업데이트
          }
        });
      },
      { threshold: 0.2 }, // 화면에 20% 이상 보이면 감지
    );

    const sections = [
      conditionRef.current,
      detailRef.current,
      companyRef.current,
    ];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    // 스크롤이 500 이상이면 맨 위로 이동 버튼 표시
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가

    return () => {
      // 관찰 해제
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });

      // 스크롤 이벤트 리스너 해제
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // aid가 있을 때 공고 상세 조회 API 호출
  useEffect(() => {
    if (aid) {
      // 공고 상세 조회 API 호출
      formMailAdFindOneJobsite(aid).then((response) => {
        setJobPost(response); // 공고 상세 정보 저장
        setPhotoList(
          response?.photoList && response?.photoList?.length > 0
            ? response?.photoList?.split(",")
            : [],
        );
      });

      // 로그인 상태일 때 최근 본 공고 저장
      if (user && user.userId) {
        saveRecentJob(aid, user.userId); // 최근 본 공고 저장
      }

      // 주변 역 정보 조회 API 호출
      formMailAdFindNearInfo(aid).then((response) => {
        if (response && response.code === "C000") {
          setNearInfo(response.nearInfoList);
        }
      });

      // 스크랩, 좋아요 여부 확인
      if (user && user.userId) {
        // 스크랩 API Request
        const scrapeReq: JobsiteDupBookmarkCheckRequest = {
          userId: user.userId,
          aid,
          type: "scrape",
        };

        // 좋아요 API Request
        const favoriteReq: JobsiteDupBookmarkCheckRequest = {
          userId: user.userId,
          aid,
          type: "favorite",
        };

        // 스크랩 여부 확인 API 호출
        jobsiteDupBookmarkCheck(scrapeReq).then((response) => {
          if (response && response.code === "C000") {
            setCanScraped(true);
          }
        });

        // 좋아요 여부 확인 API 호출
        jobsiteDupBookmarkCheck(favoriteReq).then((response) => {
          if (response && response.code === "C000") {
            setCanFavorite(true);
          }
        });
      }
    }
  }, [aid]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col pc:px-[50px] pc:pt-[15px]">
        {/* 모바일 버전 공고 */}
        {isMobileScreen && (
          <>
            {/* 공고 이미지 */}
            {photoList.length > 0 && (
              <div className="flex h-[150px] max-h-[150px] min-h-[150px] w-full overflow-hidden pc:hidden">
                <Slider
                  infinite={false}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={false}
                  className="h-full w-full"
                >
                  {photoList.map((photo, index) => (
                    <img
                      key={index}
                      src={`${imgUrl}${photo}`}
                      alt="Job Image"
                      className="w-full object-cover"
                    />
                  ))}
                </Slider>
              </div>
            )}

            {/* 공고 게시일 */}
            <div className="flex w-full justify-end bg-white px-5 py-2">
              <span className="text-sm text-[#666666]">{jobPost?.updated}</span>
            </div>

            {/* 제목 / 회사명 */}
            <div className="flex w-full flex-col gap-5 bg-white px-5 pb-5">
              <h2 className="text-xl font-semibold">
                {jobPost?.title}
                <span className="text-sm text-[#666666]">
                  &nbsp;/ ~{" "}
                  {jobPost?.endDate && formatDateWithDay(jobPost.endDate)}
                </span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-[52px] max-h-[52px] w-20 min-w-20 items-center justify-center rounded border border-solid border-light">
                  <img
                    src={`${imgUrl}${jobPost?.logoImg}`}
                    alt="Company Logo"
                    className="w-full object-contain"
                  />
                </div>
                <span className="text-base text-[#666666]">
                  {jobPost?.company}
                </span>
              </div>
            </div>

            {/* 근무 정보 요약 */}
            <div className="flex w-full flex-col gap-2.5 px-[21px] pb-[18px] pt-[10px]">
              <div className="grid w-full grid-cols-2 grid-rows-2 border border-solid border-normal bg-white">
                {/* 월급 */}
                <div className="flex h-[54px] max-h-[54px] items-center gap-2.5 border-b border-l-0 border-r border-t-0 border-solid border-normal px-5 py-[10px]">
                  <img
                    src="/assets/images/icons/svg/salary.svg"
                    alt="Salary"
                    className="h-5"
                  />
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-xxs text-[#DC143C]">
                      {jobPost?.salaryType}
                    </span>
                    <span className="line-clamp-1 text-sm">
                      {jobPost?.salary &&
                        parseInt(jobPost.salary).toLocaleString()}
                      원
                    </span>
                  </div>
                </div>

                {/* 근무기간 */}
                <div className="flex h-[54px] max-h-[54px] items-center gap-2.5 border-b border-l-0 border-r-0 border-t-0 border-solid border-normal px-5 py-[10px]">
                  <img
                    src="/assets/images/icons/svg/calendar.svg"
                    alt="Period"
                    className="h-5"
                  />
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-xxs text-[#DC143C]">근무기간</span>
                    <span className="line-clamp-1 text-sm">
                      {jobPost?.workPeriod}
                    </span>
                  </div>
                </div>

                {/* 근무요일 */}
                <div className="flex h-[54px] max-h-[54px] items-center gap-2.5 border-b-0 border-l-0 border-r border-t-0 border-solid border-normal px-5 py-[10px]">
                  <img
                    src="/assets/images/icons/svg/day.svg"
                    alt="Day"
                    className="h-5"
                  />
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-xxs text-[#DC143C]">근무요일</span>
                    <span className="line-clamp-1 text-sm">
                      {jobPost?.workDate && jobPost?.workDays
                        ? formatWorkDays(jobPost?.workDays)
                        : "요일협의"}
                    </span>
                  </div>
                </div>

                {/* 근무시간 */}
                <div className="flex h-[54px] max-h-[54px] items-center gap-2.5 px-5 py-[10px]">
                  <img
                    src="/assets/images/icons/svg/work_time.svg"
                    alt="Work Time"
                    className="h-5"
                  />
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-xxs text-[#DC143C]">근무시간</span>
                    <span className="line-clamp-1 text-sm">
                      {jobPost?.workTime
                        ? `${jobPost?.workStart} ~ ${jobPost?.workEnd}`
                        : "시간협의"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 공고 키워드 */}
              <div className="flex flex-wrap items-center gap-[5px]">
                {/* endDate가 3일 이하로 남았을 경우 급구 및 마감 추가 */}
                {jobPost?.endDate &&
                  (() => {
                    const today = new Date();
                    const deadline = new Date(jobPost.endDate);
                    const daysRemaining = Math.ceil(
                      (deadline.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24),
                    );

                    return (
                      <>
                        {daysRemaining <= 3 && (
                          <>
                            <div className="flex h-4 max-h-4 items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]">
                              급구
                            </div>
                            <div className="flex h-4 max-h-4 items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]">
                              마감임박
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}

                {jobPost?.etcConditions &&
                  jobPost?.etcConditions?.split(",").map((condition, index) => (
                    <div
                      key={index}
                      className="flex h-4 max-h-4 items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]"
                    >
                      {condition.trim().includes("친구와 함께")
                        ? "친구와 함께"
                        : condition.trim()}
                    </div>
                  ))}
              </div>
            </div>

            {/* 공고 설명 */}
            <div className="flex w-full flex-col bg-white">
              <div className="sticky top-0 z-[1000] flex h-9 min-h-9 w-full items-center justify-between border-y border-solid border-normal bg-white px-5">
                <button
                  type="button"
                  className={`${currentTab !== "근무조건" && "text-[#666666]"} relative h-full text-sm`}
                  onClick={() => {
                    setCurrentTab("근무조건");
                    conditionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  근무조건
                  {currentTab === "근무조건" && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-[100px] -translate-x-1/2 transform bg-[#0099FF]" />
                  )}
                </button>
                <button
                  type="button"
                  className={`${currentTab !== "상세요강" && "text-[#666666]"} relative h-full text-sm`}
                  onClick={() => {
                    setCurrentTab("상세요강");
                    detailRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  상세요강
                  {currentTab === "상세요강" && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-[100px] -translate-x-1/2 transform bg-[#0099FF]" />
                  )}
                </button>
                <button
                  type="button"
                  className={`${currentTab !== "기업정보" && "text-[#666666]"} relative h-full text-sm`}
                  onClick={() => {
                    setCurrentTab("기업정보");
                    companyRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  기업정보
                  {currentTab === "기업정보" && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-[100px] -translate-x-1/2 transform bg-[#0099FF]" />
                  )}
                </button>
              </div>

              {/* 근무조건 */}
              <div
                id="근무조건"
                ref={conditionRef}
                className="flex w-full flex-col gap-10 bg-white px-5 pb-[30px] pt-10"
              >
                {/* 모집조건 */}
                <div className="flex w-full flex-col gap-[30px]">
                  <h3 className="text-base font-semibold">모집조건</h3>
                  <div className="flex items-center gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      모집기간
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.startDate && formatEndDate(jobPost.startDate)} ~{" "}
                      {jobPost?.endDate !== null
                        ? jobPost?.endDate
                          ? formatEndDate(jobPost.endDate)
                          : "상시모집"
                        : "상시모집"}{" "}
                      {jobPost?.endDate !== null && (
                        <span className="text-[#DC143C]">
                          {jobPost?.endDate &&
                            formatUntilEndDate(jobPost.endDate)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      학력
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.education}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      모집인원
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.recruitCount}
                    </span>
                  </div>

                  <hr className="border-t border-solid border-[#D9D9D9]" />

                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      우대조건
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.preConditions}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      기타조건
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.etcConditions}
                    </span>
                  </div>
                </div>

                {/* 근무조건 */}
                <div className="flex w-full flex-col gap-[30px]">
                  <h3 className="text-base font-semibold">근무조건</h3>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      급여
                    </h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <div className="flex h-[25px] w-[46px] items-center justify-center whitespace-nowrap rounded-full bg-[#DC143C] text-sm font-semibold text-white">
                          {jobPost?.salaryType}
                        </div>
                        <span className="text-base font-semibold">
                          {jobPost?.salary &&
                            parseInt(jobPost.salary).toLocaleString()}
                          원
                        </span>
                      </div>
                      <span className="text-xxs font-semibold text-[#666666]">
                        2025년 최저시급 10,030원
                      </span>
                      <button
                        type="button"
                        className="flex h-6 w-24 items-center gap-2.5 rounded border border-solid border-normal px-2.5"
                      >
                        <img
                          src="/assets/images/icons/svg/calculator_color.svg"
                          alt="Calculator"
                          className="h-4"
                        />
                        <span
                          className="whitespace-nowrap text-xs font-semibold text-[#333333]"
                          onClick={() => {
                            window.open("/salary", "_blank");
                          }}
                        >
                          급여계산기
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      근무기간
                    </h4>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        {jobPost?.workPeriod}
                      </span>
                      <div className="flex items-center gap-1">
                        {jobPost?.probation && (
                          <span className="text-xs text-[#666666]">
                            (기간협의가능)
                          </span>
                        )}
                        {jobPost?.periodDiscussion && (
                          <span className="text-xs text-[#666666]">
                            (수습기간있음)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      근무요일
                    </h4>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        {jobPost?.workDate && jobPost?.workDays
                          ? formatWorkDays(jobPost?.workDays)
                          : "요일협의"}
                        {/* {jobPost?.probation && (
                          <span className="text-[#666666]">(협의가능)</span>
                        )} */}
                      </span>
                      {jobPost?.workDateDetail && (
                        <span className="text-xs text-[#666666]">
                          ({jobPost?.workDateDetail})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      근무시간
                    </h4>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        {jobPost?.workTime
                          ? `${jobPost?.workStart} ~ ${jobPost?.workEnd}`
                          : "시간협의"}
                      </span>
                      {jobPost?.workTimeDetail && (
                        <span className="text-xs text-[#666666]">
                          ({jobPost?.workTimeDetail})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      모집직종
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.jobType}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      고용형태
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.employmentType}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      복리후생
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.welfare}
                    </span>
                  </div>
                </div>

                {/* 근무지 정보 */}
                <div className="flex w-full flex-col gap-[30px]">
                  <h3 className="text-base font-semibold">근무지 정보</h3>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{jobPost?.address}</span>
                      <button
                        type="button"
                        className="flex w-4 items-center"
                        onClick={copyAddress}
                      >
                        <img
                          src="/assets/images/icons/svg/copy.svg"
                          alt="Copy"
                          className="w-[12.67px]"
                        />
                      </button>
                    </div>

                    {/* 지도 */}
                    <div className="h-[200px] w-full border border-solid border-normal">
                      {jobPost?.x && jobPost?.y && (
                        <NaverMap
                          latitude={jobPost?.x}
                          longitude={jobPost?.y}
                        />
                      )}
                    </div>

                    {/* 교통편 */}
                    {nearInfo?.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs text-white"
                          style={{
                            backgroundColor: info.subwayColor
                              ? info.subwayColor
                              : "#333333",
                          }}
                        >
                          {info.line}
                        </div>
                        <span className="text-sm font-semibold">
                          {info.nearStation} {info.durationTime}
                        </span>
                      </div>
                    ))}

                    <hr className="border-t border-solid border-[#D9D9D9]" />

                    {/* 주변대학 */}
                    {jobPost?.nearUniversity && (
                      <div className="flex items-center gap-5">
                        <span className="whitespace-nowrap text-sm text-[#666666]">
                          주변대학
                        </span>
                        <span className="text-sm font-semibold">
                          {jobPost?.nearUniversity}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 상세요강 */}
              <div
                id="상세요강"
                ref={detailRef}
                className="flex w-full flex-col gap-10 bg-white px-5 pb-[30px] pt-10"
              >
                {/* 상세모집요강 */}
                <div className="flex w-full flex-col gap-[30px]">
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-base font-semibold">상세모집요강</h3>
                    <div className="flex cursor-pointer items-center gap-1">
                      <span className="text-sm font-semibold text-[#666666]">
                        확대하기
                      </span>
                      <img
                        src="/assets/images/icons/svg/zoom.svg"
                        alt="Zoom"
                        className="w-[14px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-auto items-center justify-center bg-[#D9D9D9] text-sm font-semibold">
                    {/* <img
                      src={`${imgUrl}${jobPost?.adImg}`}
                      alt="Ad Image"
                      className="w-full"
                    /> */}
                    {/* {jobPost?.detailContent &&
                      unescapeHTML(jobPost?.detailContent)} */}
                    <div
                      className="flex w-full flex-col bg-white"
                      dangerouslySetInnerHTML={{
                        __html: unescapeHTML(jobPost?.detailContent || ""),
                      }}
                    ></div>
                  </div>
                </div>

                {/* 지원방법 */}
                {jobPost?.applyMethod && (
                  <div className="flex w-full flex-col gap-[30px]">
                    <h3 className="text-base font-semibold">지원방법</h3>
                    <div className="grid w-full grid-cols-2 gap-[1px] border border-solid border-normal bg-[#cccccc]">
                      {jobPost?.applyMethod &&
                        jobPost?.applyMethod.split(",").map((method, index) => {
                          // 아이콘 매핑
                          const iconMap: { [key: string]: string } = {
                            기업바로지원:
                              "/assets/images/icons/svg/online_apply.svg",
                            문자지원:
                              "/assets/images/icons/svg/message_apply.svg",
                            간편입사지원:
                              "/assets/images/icons/svg/easy_apply.svg",
                            "전화 후 방문":
                              "/assets/images/icons/svg/call_apply.svg",
                          };

                          return (
                            <div
                              key={index}
                              className="flex h-[41px] max-h-[41px] items-center gap-2.5 bg-white px-5 py-[10px]"
                            >
                              {iconMap[method.trim()] ? (
                                <>
                                  <img
                                    src={iconMap[method.trim()]}
                                    alt={method.trim()}
                                    className="h-5"
                                  />
                                  <span className="text-sm">
                                    {method.trim()}
                                  </span>
                                </>
                              ) : (
                                // 이미지가 없는 경우
                                <span className="text-sm">{method.trim()}</span>
                              )}
                            </div>
                          );
                        })}

                      {/* 요소가 홀수일 경우 빈 요소 추가 */}
                      {jobPost?.applyMethod &&
                        jobPost?.applyMethod.split(",").length % 2 !== 0 && (
                          <div className="bg-white"></div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* 기업정보 */}
              <div
                id="기업정보"
                ref={companyRef}
                className="flex w-full flex-col"
              >
                <div className="flex w-full flex-col bg-white px-5 pb-[30px] pt-10">
                  <div className="flex w-full flex-col gap-[30px]">
                    <h3 className="text-base font-semibold">기업정보</h3>
                    <div className="flex w-full flex-col gap-2.5 rounded-[10px] border border-solid border-normal p-5">
                      <div className="flex w-full items-start justify-between">
                        <div className="flex h-[52px] w-20 items-center justify-center rounded border border-solid border-normal">
                          <img
                            src="/assets/images/sample/sample_logo2.png"
                            alt="Company Logo"
                            className="w-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          className="flex h-[27px] items-center gap-1 rounded-full border border-solid border-normal px-2.5"
                          onClick={
                            canFavorite
                              ? handleFavoriteButtonClick
                              : handleFavoriteDeleteButtonClick
                          }
                        >
                          <img
                            src="/assets/images/icons/svg/interested_add.svg"
                            alt="Interested Add"
                            className="w-[14px]"
                          />
                          <span className="text-xs">관심기업</span>
                        </button>
                      </div>
                      <h4 className="text-sm font-semibold">
                        {/* {jobPost?.company} */}
                        (주)코리아티엠
                      </h4>
                      <span className="text-xs text-[#666666]">
                        {/* {jobPost?.jobType} */}
                        광고대행 서비스업
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden h-[100px] items-center justify-center border-y border-solid border-normal bg-main">
                  기업이력 요약
                </div>

                <div className="flex w-full flex-col gap-10 bg-white px-5 pb-[94px] pt-10">
                  <div className="flex flex-col gap-5">
                    {/* <div className="flex items-start gap-5">
                        <h4 className="w-[52px] max-w-[52px] text-sm text-[#666666]">
                          대표자명
                        </h4>
                        <span className="text-sm font-semibold">홍길동</span>
                      </div> */}
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] text-sm text-[#666666]">
                        담당자
                      </h4>
                      <span className="text-sm font-semibold">
                        {jobPost?.managerName}
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] text-sm text-[#666666]">
                        연락처
                      </h4>
                      <span className="cursor-pointer text-sm font-semibold">
                        <span
                          className="text-[#0099FF] underline"
                          onClick={() =>
                            (window.location.href = `tel:${jobPost?.managerPhone}`)
                          }
                        >
                          전화하기
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col rounded-[10px] border border-solid border-normal px-[10px] py-5">
                    <span className="text-xs">
                      본 정보는 <b>(주)코리아티엠</b>에서 제공한 자료입니다.
                      <br />
                      <br />
                      당사의 동의없이 재배포 할 수 없으며 채용기업과 담당자
                      정보는 구직활동 이외의 용도로 활용 할 수 없습니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 지원하기 */}
            <div className="fixed bottom-0 left-0 flex h-16 min-h-16 w-full items-center gap-3 border-t border-solid border-normal bg-white px-5">
              <button
                className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded border border-solid border-normal"
                onClick={
                  canScraped
                    ? handleScrapeButtonClick
                    : handleScrapeDeleteButtonClick
                }
              >
                {canScraped && user && (
                  <img
                    src="/assets/images/icons/svg/star_empty.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
                {!canScraped && user && (
                  <img
                    src="/assets/images/icons/svg/star_color.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
                {!user && (
                  <img
                    src="/assets/images/icons/svg/star_empty.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
              </button>
              <button
                className="flex h-12 w-full items-center justify-center rounded bg-[#DC143C] text-base font-semibold text-white"
                onClick={handleApplyButtonClick}
              >
                지원하기
              </button>
            </div>

            {/* 맨 위로 이동 */}
            {showScrollButton && (
              <button
                type="button"
                className="fixed bottom-20 right-4 flex items-center justify-center"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img
                  src="/assets/images/icons/svg/move_to_top.svg"
                  alt="Move to Top"
                  className="h-8 w-8"
                />
              </button>
            )}
          </>
        )}

        {/* PC 버전 공고 */}
        {isMobileScreen || (
          <div className="mb-[143px] hidden w-full flex-col gap-5 overflow-hidden rounded-[10px] border border-solid border-normal bg-white p-5 pc:flex">
            {/* 공고 게시일 / 스크랩 / 좋아요 */}
            <div className="flex h-12 min-h-12 w-full items-center justify-end gap-2.5">
              <span className="text-base">{jobPost?.updated}</span>
              <button
                type="button"
                className="flex size-12 items-center justify-center border border-solid border-normal"
                onClick={
                  canScraped
                    ? handleScrapeButtonClick
                    : handleScrapeDeleteButtonClick
                }
              >
                {canScraped && user && (
                  <img
                    src="/assets/images/icons/svg/star_empty.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
                {!canScraped && user && (
                  <img
                    src="/assets/images/icons/svg/star_color.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
                {!user && (
                  <img
                    src="/assets/images/icons/svg/star_empty.svg"
                    alt="Star"
                    className="h-6"
                  />
                )}
              </button>
              <button
                type="button"
                className="flex size-12 items-center justify-center border border-solid border-normal"
                onClick={
                  canFavorite
                    ? handleFavoriteButtonClick
                    : handleFavoriteDeleteButtonClick
                }
              >
                {canFavorite && user && (
                  <img
                    src="/assets/images/icons/svg/heart_empty.svg"
                    alt="Favorite"
                    className="h-6"
                  />
                )}
                {!canFavorite && user && (
                  <img
                    src="/assets/images/icons/svg/heart.svg"
                    alt="Favorite"
                    className="h-6"
                  />
                )}
                {!user && (
                  <img
                    src="/assets/images/icons/svg/heart_empty.svg"
                    alt="Favorite"
                    className="h-6"
                  />
                )}
              </button>
            </div>

            <hr className="w-full border-t border-solid border-[#D9D9D9]" />

            {/* 공고 제목 / 회사 이미지 */}
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-2.5">
                <span className="text-base leading-[19px] text-[#666666]">
                  {jobPost?.company}
                </span>
                <h2 className="text-[32px] font-semibold leading-[39px]">
                  {jobPost?.title}
                </h2>
              </div>
              <img
                src={`${imgUrl}${jobPost?.logoImg}`}
                alt="Company Logo"
                className="h-10 w-[100px] object-contain"
              />
            </div>

            {/* 공고 키워드 */}
            <div className="flex items-center gap-[5px]">
              {/* endDate가 3일 이하로 남았을 경우 급구 및 마감 추가 */}
              {jobPost?.endDate &&
                (() => {
                  const today = new Date();
                  const deadline = new Date(jobPost.endDate);
                  const daysRemaining = Math.ceil(
                    (deadline.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );

                  return (
                    <>
                      {daysRemaining <= 3 && (
                        <>
                          <div className="flex items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 py-[2px] text-xs leading-[15px] text-[#006699]">
                            급구
                          </div>
                          <div className="flex items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 py-[2px] text-xs leading-[15px] text-[#006699]">
                            마감임박
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}

              {jobPost?.etcConditions &&
                jobPost?.etcConditions?.split(",").map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center rounded-[5px] bg-[#BBDDFF] px-2 py-[2px] text-xs leading-[15px] text-[#006699]"
                  >
                    {condition.trim().includes("친구와 함께")
                      ? "친구와 함께"
                      : condition.trim()}
                  </div>
                ))}
            </div>

            {/* 공고 요약 */}
            <div className="flex w-full items-center justify-between gap-5">
              {/* 월급 */}
              <div className="flex h-[54px] max-h-[54px] flex-1 items-center gap-2.5 rounded border border-solid border-normal px-5 py-[10px] pc:gap-5">
                <img
                  src="/assets/images/icons/svg/salary.svg"
                  alt="Salary"
                  className="h-5"
                />
                <div className="flex h-full flex-col gap-[5px]">
                  <span className="text-xxs leading-3 text-[#DC143C]">
                    {jobPost?.salaryType}
                  </span>
                  <span className="text-sm leading-[17px]">
                    {jobPost?.salary &&
                      parseInt(jobPost.salary).toLocaleString()}
                    원
                  </span>
                </div>
              </div>

              {/* 근무기간 */}
              <div className="flex h-[54px] max-h-[54px] flex-1 items-center gap-2.5 rounded border border-solid border-normal px-5 py-[10px] pc:gap-5">
                <img
                  src="/assets/images/icons/svg/calendar.svg"
                  alt="Period"
                  className="h-5"
                />
                <div className="flex h-full flex-col gap-[5px]">
                  <span className="text-xxs leading-3 text-[#DC143C]">
                    근무기간
                  </span>
                  <span className="text-sm leading-[17px]">
                    {jobPost?.workPeriod}
                  </span>
                </div>
              </div>

              {/* 근무요일 */}
              <div className="flex h-[54px] max-h-[54px] flex-1 items-center gap-2.5 rounded border border-solid border-normal px-5 py-[10px] pc:gap-5">
                <img
                  src="/assets/images/icons/svg/day.svg"
                  alt="Day"
                  className="h-5"
                />
                <div className="flex h-full flex-col gap-[5px]">
                  <span className="text-xxs leading-3 text-[#DC143C]">
                    근무요일
                  </span>
                  <span className="text-sm leading-[17px]">
                    {jobPost?.workDate && jobPost?.workDays
                      ? formatWorkDays(jobPost?.workDays)
                      : "요일협의"}
                  </span>
                </div>
              </div>

              {/* 근무시간 */}
              <div className="flex h-[54px] max-h-[54px] flex-1 items-center gap-2.5 rounded border border-solid border-normal px-5 py-[10px] pc:gap-5">
                <img
                  src="/assets/images/icons/svg/work_time.svg"
                  alt="Work Time"
                  className="h-5"
                />
                <div className="flex h-full flex-col gap-[5px]">
                  <span className="text-xxs leading-3 text-[#DC143C]">
                    근무시간
                  </span>
                  <span className="text-sm leading-[17px]">
                    {jobPost?.workTime
                      ? `${jobPost?.workStart} ~ ${jobPost?.workEnd}`
                      : "시간협의"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-10">
              {/* 모집조건 */}
              <div className="flex w-full flex-col gap-[30px]">
                <h3 className="text-base font-semibold pc:text-lg">모집조건</h3>
                <div className="grid grid-cols-2 gap-[30px]">
                  <div className="flex items-center gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      모집기간
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.startDate && formatEndDate(jobPost.startDate)} ~{" "}
                      {jobPost?.endDate !== null
                        ? jobPost?.endDate
                          ? formatEndDate(jobPost.endDate)
                          : "상시모집"
                        : "상시모집"}{" "}
                      {jobPost?.endDate !== null && (
                        <span className="text-[#DC143C]">
                          {jobPost?.endDate &&
                            formatUntilEndDate(jobPost.endDate)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      학력
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.education}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      모집인원
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.recruitCount}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      우대조건
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.preConditions}
                    </span>
                  </div>
                  <div className="flex items-start gap-5">
                    <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                      기타조건
                    </h4>
                    <span className="text-sm font-semibold">
                      {jobPost?.etcConditions}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-t border-solid border-[#D9D9D9]" />

              {/* 근무조건 */}
              <div className="flex w-full flex-col gap-[30px]">
                <h3 className="text-base font-semibold pc:text-lg">근무조건</h3>
                <div className="flex w-full gap-[30px]">
                  <div className="flex flex-1 flex-col gap-[30px]">
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] text-sm text-[#666666]">
                        급여
                      </h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <div className="flex h-[25px] w-[46px] items-center justify-center rounded-full bg-[#DC143C] text-sm font-semibold text-white">
                            {jobPost?.salaryType}
                          </div>
                          <span className="text-base font-semibold">
                            {jobPost?.salary &&
                              parseInt(jobPost.salary).toLocaleString()}
                            원
                          </span>
                        </div>
                        <span className="text-xxs font-semibold text-[#666666]">
                          2025년 최저시급 10,030원
                        </span>
                        <button
                          type="button"
                          className="flex h-6 w-24 items-center gap-2.5 rounded border border-solid border-normal px-2.5"
                        >
                          <img
                            src="/assets/images/icons/svg/calculator_color.svg"
                            alt="Calculator"
                            className="h-4"
                          />
                          <span
                            className="whitespace-nowrap text-xs font-semibold text-[#333333]"
                            onClick={() => {
                              window.open(
                                "/salary",
                                "_blank",
                                "width=400,height=600",
                              );
                            }}
                          >
                            급여계산기
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        근무기간
                      </h4>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          {jobPost?.workPeriod}
                        </span>
                        <div className="flex items-center gap-1">
                          {jobPost?.probation && (
                            <span className="text-xs text-[#666666]">
                              (기간협의가능)
                            </span>
                          )}
                          {jobPost?.periodDiscussion && (
                            <span className="text-xs text-[#666666]">
                              (수습기간있음)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        근무시간
                      </h4>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          {jobPost?.workTime
                            ? `${jobPost?.workStart} ~ ${jobPost?.workEnd}`
                            : "시간협의"}
                        </span>
                        {jobPost?.workTimeDetail && (
                          <span className="text-xs text-[#666666]">
                            ({jobPost?.workTimeDetail})
                          </span>
                        )}
                        {jobPost?.restTime && (
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 items-center justify-center rounded bg-red-50 px-1 text-xs text-[#DC143C]">
                              휴게시간
                            </div>
                            <span className="text-xs text-[#666666]">
                              {jobPost?.restTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-[30px]">
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        모집직종
                      </h4>
                      <span className="text-sm font-semibold">
                        {jobPost?.jobType}
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        근무요일
                      </h4>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          {jobPost?.workDate && jobPost?.workDays
                            ? formatWorkDays(jobPost.workDays)
                            : "요일협의"}
                          {/* {jobPost?.probation && (
                            <span className="text-[#666666]">(협의가능)</span>
                          )} */}
                        </span>
                        {jobPost?.workDateDetail && (
                          <span className="text-xs text-[#666666]">
                            ({jobPost?.workDateDetail})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        고용형태
                      </h4>
                      <span className="text-sm font-semibold">
                        {jobPost?.employmentType}
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[52px] max-w-[52px] whitespace-nowrap text-sm text-[#666666]">
                        복리후생
                      </h4>
                      <span className="text-sm font-semibold">
                        {jobPost?.welfare}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-t border-solid border-[#D9D9D9]" />

              {/* 근무지 정보 */}
              <div className="flex w-full flex-col gap-5">
                <h3 className="text-base font-semibold pc:text-lg">
                  근무지 정보
                </h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm pc:text-base">
                          {jobPost?.address}
                        </span>
                        <button type="button" className="flex w-4 items-center">
                          <img
                            src="/assets/images/icons/svg/copy.svg"
                            alt="Copy"
                            className="w-[12.67px]"
                            onClick={copyAddress}
                          />
                        </button>
                      </div>
                      {/* 동정보 */}
                      <div className="flex items-center gap-5">
                        <span className="w-[72px] text-sm text-[#666666]">
                          동정보
                        </span>
                        <span className="text-sm font-semibold">
                          {jobPost?.sido} {jobPost?.sigungu}{" "}
                          {jobPost?.dongEubMyun}
                        </span>
                      </div>
                      {/* 교통편 */}
                      {nearInfo && nearInfo?.length > 0 && (
                        <div className="flex items-center gap-5">
                          <span className="w-[72px] whitespace-nowrap text-sm text-[#666666]">
                            인근전철역
                          </span>
                          {nearInfo?.map((info, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="flex h-4 min-w-4 items-center justify-center whitespace-nowrap rounded-full px-1 text-xs text-white"
                                style={{
                                  backgroundColor: info.subwayColor
                                    ? info.subwayColor
                                    : "#333333",
                                }}
                              >
                                {info.line}
                              </div>
                              <span className="whitespace-nowrap text-sm font-semibold">
                                {info.nearStation} {info.durationTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* 주변대학 */}
                    {jobPost?.nearUniversity && (
                      <div className="flex flex-1 items-center gap-5">
                        <span className="text-sm text-[#666666]">주변대학</span>
                        <span className="text-sm font-semibold">
                          {jobPost?.nearUniversity}
                        </span>
                      </div>
                    )}
                  </div>

                  <hr className="border-t border-solid border-[#D9D9D9]" />

                  {/* 지도 */}
                  <div className="h-[600px] w-full border border-solid border-normal">
                    {jobPost?.x && jobPost?.y && (
                      <NaverMap latitude={jobPost?.x} longitude={jobPost?.y} />
                    )}
                  </div>
                </div>
              </div>

              {/* 상세모집요강 */}
              <div className="flex w-full flex-col gap-2.5">
                <h3 className="text-base font-semibold pc:text-lg">
                  상세모집요강
                </h3>
                <div className="flex h-auto items-center justify-center bg-[#D9D9D9] text-lg font-semibold">
                  {/* <img
                    src={`${imgUrl}${jobPost?.adImg}`}
                    alt="Ad Image"
                    className="w-full"
                  /> */}
                  {/* {jobPost?.detailContent &&
                    unescapeHTML(jobPost?.detailContent)} */}
                  <div
                    className="flex w-full flex-col bg-white"
                    dangerouslySetInnerHTML={{
                      __html: unescapeHTML(jobPost?.detailContent || ""),
                    }}
                  ></div>
                </div>
              </div>

              {/* 지원방법 */}
              {jobPost?.applyMethod && (
                <div className="flex w-full flex-col gap-[30px]">
                  <h3 className="text-base font-semibold pc:text-lg">
                    지원방법
                  </h3>
                  <div className="flex w-full flex-wrap items-center justify-start gap-5">
                    {jobPost?.applyMethod && (
                      <>
                        {jobPost?.applyMethod
                          .split(",")
                          .map((method, index) => {
                            const iconMap: { [key: string]: string } = {
                              기업바로지원:
                                "/assets/images/icons/svg/online_apply.svg",
                              문자지원:
                                "/assets/images/icons/svg/message_apply.svg",
                              간편입사지원:
                                "/assets/images/icons/svg/easy_apply.svg",
                              "전화 후 방문":
                                "/assets/images/icons/svg/call_apply.svg",
                            };
                            return (
                              <div
                                key={index}
                                className="flex h-[41px] max-h-[41px] w-[calc(25%-1.25rem)] items-center gap-2.5 rounded border border-solid border-normal px-5 py-[10px] pc:gap-5"
                              >
                                {iconMap[method.trim()] ? (
                                  <>
                                    <img
                                      src={iconMap[method.trim()]}
                                      alt={method.trim()}
                                      className="h-5"
                                    />
                                    <span className="text-sm">
                                      {method.trim()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm">
                                    {method.trim()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 기업정보 */}
              <div className="flex w-full flex-col pb-[30px]">
                <div className="flex w-full flex-col gap-[30px]">
                  <h3 className="text-base font-semibold">기업정보</h3>
                  <div className="relative flex w-full flex-col gap-2.5 rounded-[10px] border border-solid border-normal p-5">
                    <div className="flex w-full items-center gap-5">
                      <div className="flex h-[52px] w-20 items-center justify-center rounded border border-solid border-normal">
                        <img
                          src="/assets/images/sample/sample_logo2.png"
                          alt="Company Logo"
                          className="w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <h4 className="text-sm font-semibold leading-[17px]">
                          {/* {jobPost?.company} */}
                          (주)코리아티엠
                        </h4>
                        <span className="text-xs leading-[15px] text-[#666666]">
                          {/* {jobPost?.jobType} */}
                          광고대행 서비스업
                        </span>
                      </div>
                    </div>
                    <div className="hidden h-[100px] items-center justify-center border-y border-solid border-normal bg-main">
                      기업이력 요약
                    </div>
                    <button
                      type="button"
                      className="absolute right-5 top-[32.5px] flex h-[27px] items-center gap-1 rounded-full border border-solid border-normal px-2.5"
                      onClick={
                        canFavorite
                          ? handleFavoriteButtonClick
                          : handleFavoriteDeleteButtonClick
                      }
                    >
                      <img
                        src="/assets/images/icons/svg/interested_add.svg"
                        alt="Interested Add"
                        className="w-[14px]"
                      />
                      <span className="text-xs">관심기업</span>
                    </button>
                  </div>
                </div>

                <div className="mt-[30px] flex w-full gap-[60px]">
                  <div className="flex flex-1 flex-col gap-5">
                    <div className="hidden items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        대표자명
                      </h4>
                      <span className="text-sm font-semibold">홍길동</span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        담당자
                      </h4>
                      <span className="text-sm font-semibold">
                        {jobPost?.managerName}
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        연락처
                      </h4>
                      <span className="text-sm font-semibold">
                        <span
                          className="cursor-pointer text-[#0099FF] underline"
                          onClick={() =>
                            (window.location.href = `tel:${jobPost?.managerPhone}`)
                          }
                        >
                          전화하기
                        </span>
                      </span>
                    </div>
                    {jobPost?.managerEmail && (
                      <div className="flex items-start gap-5">
                        <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                          이메일
                        </h4>
                        <span className="text-sm font-semibold">
                          {jobPost?.managerEmail}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-5">
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        사업내용
                      </h4>
                      <span className="text-sm font-semibold">
                        {/* {jobPost?.jobType} */}
                        광고대행 서비스업
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        직원수
                      </h4>
                      <span className="text-sm font-semibold">20명</span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        회사주소
                      </h4>
                      <span className="text-sm font-semibold">
                        {/* {jobPost?.address} */}
                        서울특별시 중구 다산로38길 66-47
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <h4 className="w-[60px] max-w-[60px] text-sm text-[#666666]">
                        홈페이지
                      </h4>
                      <span
                        className="cursor-pointer text-sm font-semibold"
                        onClick={() =>
                          window.open("https://ikoreatm.com", "_blank")
                        }
                      >
                        https://ikoreatm.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지원하기 */}
              <div className="fixed bottom-0 left-0 w-full border-t border-solid border-normal bg-white">
                <div className="mx-auto flex h-16 min-h-16 w-full max-w-[340px] items-center gap-3 bg-white px-5">
                  <button
                    className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded border border-solid border-normal"
                    onClick={
                      canScraped
                        ? handleScrapeButtonClick
                        : handleScrapeDeleteButtonClick
                    }
                  >
                    {canScraped && user && (
                      <img
                        src="/assets/images/icons/svg/star_empty.svg"
                        alt="Star"
                        className="h-6"
                      />
                    )}
                    {!canScraped && user && (
                      <img
                        src="/assets/images/icons/svg/star_color.svg"
                        alt="Star"
                        className="h-6"
                      />
                    )}
                    {!user && (
                      <img
                        src="/assets/images/icons/svg/star_empty.svg"
                        alt="Star"
                        className="h-6"
                      />
                    )}
                  </button>
                  <button
                    className="flex h-12 w-full items-center justify-center rounded bg-[#DC143C] text-base font-semibold text-white"
                    onClick={handleApplyButtonClick}
                  >
                    지원하기
                  </button>
                </div>
              </div>
            </div>

            {/* 맨 위로 이동 */}
            {showScrollButton && (
              <button
                type="button"
                className="fixed bottom-28 right-20 flex items-center justify-center"
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
        )}
      </div>

      {/* PC 버전 푸터 */}
      {isMobileScreen || (
        <div className="w-full pb-16">
          <MainFooterPC />
        </div>
      )}

      {/* 지원하기 팝업 */}
      {isApplyPopupOpen && (
        <ApplyPopup
          onClose={() => setIsApplyPopupOpen(false)}
          link={jobPost?.applyUrl}
          applyMethod={jobPost?.applyMethod}
        />
      )}

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )}
    </>
  );
}

export default JobDetailContent;
