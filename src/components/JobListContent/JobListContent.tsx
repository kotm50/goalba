import { useMediaQuery } from "@react-hook/media-query";
import Filter from "../Filter";
import JobPost from "../JobPost";
import MainFooterMobile from "../MainFooterMobile";
import Pagination from "../Pagination";
// import PlatinumPost from "../PlatinumPost";
import MainFooterPC from "../MainFooterPC";
import { useEffect, useState } from "react";
import { formMailAdSelectByRegionsSort, JobSiteList } from "../../api/post";
import { useLocation, useSearchParams } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";

const REGISTER_OPTIONS = [
  "등록일 전체",
  "오늘 등록",
  "3일이내 등록",
  "7일이내 등록",
];

const SORT_OPTIONS = [
  "정렬조건",
  "최근등록순",
  "거리순",
  "시급높은순",
  "일급높은순",
  "주급높은순",
  "월급높은순",
  "연봉높은순",
];

function JobListContent() {
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword"); // params에서 keyword 추출
  const sido = searchParams.get("sido"); // params에서 sido 추출
  const sigungu = searchParams.get("sigungu"); // params에서 sigungu 추출

  let adType: string; // 광고 타입

  if (location.pathname.includes("/short")) {
    adType = "단기";
  } else if (location.pathname.includes("/urgent")) {
    adType = "급구";
  } else if (location.pathname.includes("/recommend")) {
    adType = "추천";
  }

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [jobList, setJobList] = useState<JobSiteList[]>([]); // 채용공고 리스트 배열

  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지
  const [totalCount, setTotalCount] = useState<number>(0); // 전체 개수

  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false); // 등록일 드롭다운
  const [selectedRegisterText, setSelectedRegisterText] =
    useState("등록일 전체"); // 선택된 등록일 텍스트

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false); // 정렬조건 드롭다운
  const [selectedSortText, setSelectedSortText] = useState("정렬조건"); // 선택된 정렬조건 텍스트

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 확인 팝업 표시 여부

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 맨 위로 이동 버튼 표시 여부

  // 등록일 옵션 클릭 이벤트 핸들러
  const handleRegisterOptionClick = (text: string) => {
    setSelectedRegisterText(text); // 선택된 등록일 텍스트 변경
    setIsRegisterDropdownOpen(false); // 드롭다운 닫기
  };

  // 정렬조건 옵션 클릭 이벤트 핸들러
  const handleSortOptionClick = (text: string) => {
    setSelectedSortText(text); // 선택된 정렬조건 텍스트 변경
    setIsSortDropdownOpen(false); // 드롭다운 닫기
  };

  // 채용공고 리스트 데이터 요청
  const fetchJobList = async (page: number) => {
    // regions 배열 조건부 구성
    let regions;
    if (sido) {
      regions = [
        {
          sido: sido,
          ...(sigungu && sigungu !== "전체" && { sigungu: sigungu }), // sigungu가 "전체"가 아닐 때만 추가
        },
      ];
    }

    // 채용공고 리스트 데이터 요청 API Request
    const req = {
      page,
      size: 5,
      adType,
      ...(selectedRegisterText !== "등록일 전체" && {
        registerType: selectedRegisterText,
      }),
      ...(selectedSortText !== "정렬조건" && { sortType: selectedSortText }),
      ...(regions && { regions }), // regions가 있으면 추가
      ...(keyword && { keyword }), // keyword가 있으면 추가
    };

    // 채용공고 리스트 데이터 요청 API 호출
    formMailAdSelectByRegionsSort(req).then((response) => {
      if (response && response.code === "C000") {
        // 데이터가 있는 경우
        setJobList(response.jobSiteList);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        // 데이터가 없는 경우
        setConfirmTitle("알림");
        setConfirmMessage("조건에 맞는 데이터가 없습니다!");
        setIsConfirmOpen(true);
      }
    });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 현재 페이지 변경
    fetchJobList(page); // 새로운 페이지 데이터 요청
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 스크롤 감지를 위한 이벤트 리스너 추가
    const handleScroll = () => {
      // 스크롤 위치가 100 이상인 경우 맨 위로 이동 버튼 표시
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가

    return () => {
      // 스크롤 이벤트 리스너 해제
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 현재 페이지 변경 시 데이터 요청
  useEffect(() => {
    fetchJobList(currentPage);
  }, [currentPage]);

  // 등록일, 정렬조건 변경 시 데이터 요청
  useEffect(() => {
    fetchJobList(1); // 필터 변경 시 첫 페이지로 이동
  }, [selectedRegisterText, selectedSortText]);

  // param에 keyword, sido, sigungu가 있을 때 데이터 요청
  useEffect(() => {
    if (keyword || sido || sigungu) {
      fetchJobList(1);
    }
  }, [keyword, sido, sigungu]);

  return (
    <div className="flex w-full flex-col px-[10px] pt-[18px] pc:px-0 pc:pt-0">
      {isMobileScreen && <Filter />}

      {/* PC 버전 타이틀 */}
      <div className="mx-auto hidden w-full max-w-[1240px] px-5 py-3 pc:flex">
        <h2 className="text-[32px] font-semibold">전체 채용공고</h2>
      </div>

      {/* PC 버전 드롭다운 */}
      <div className="hidden w-full bg-white pc:block">
        <div className="mx-auto w-full max-w-[1240px] items-center justify-between bg-white px-5 py-2.5 pc:flex">
          <span className="text-base">
            총 <span className="font-bold">{totalCount}</span>건
          </span>
          <div className="flex items-center gap-1 pc:gap-0">
            <div className="flex h-[33px] min-w-28 items-center justify-between border border-solid border-normal bg-white px-3 py-2">
              <span className="text-sm">등록일 전체</span>
              <img
                src="/assets/images/icons/svg/down_arrow_bold.svg"
                alt="Open"
                className="w-3"
              />
            </div>
            <div className="flex h-[33px] min-w-28 items-center justify-between border border-solid border-normal bg-white px-3 py-2">
              <span className="text-sm">정렬조건</span>
              <img
                src="/assets/images/icons/svg/down_arrow_bold.svg"
                alt="Open"
                className="w-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PC 버전 헤드라인 채용공고 */}
      <div className="mx-auto hidden w-full max-w-[1240px] flex-col gap-5 px-5 pb-10 pt-5 pc:flex">
        <h3 className="text-xl font-semibold">헤드라인 채용공고</h3>
        <div className="flex gap-5">
          {/* {Array.from({ length: 4 }).map((_, index) => (
            <PlatinumPost key={index} />
          ))} */}
        </div>
      </div>

      {/* PC 버전 공고리스트 */}
      <div className="hidden w-full flex-col gap-2.5 bg-white pc:flex">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="w-full border-b border-solid border-normal bg-white"
          >
            <div className="mx-auto flex h-[83px] w-full max-w-[1240px] cursor-pointer items-center justify-between">
              <div className="flex items-center gap-[29px]">
                <img
                  src="/assets/images/sample/sample_logo1.png"
                  alt="Company Logo"
                  className="h-10 w-[100px] object-contain"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold leading-[22px]">
                    [면접비 2만] 반려동물 간편상담 | 첫달 400만원
                  </span>
                  <span className="text-sm leading-[17px] text-[#666666]">
                    서울 송파구
                  </span>
                </div>
              </div>
              <span className="text-lg">
                <span className="font-bold text-[#DC143C]">월급</span>{" "}
                4,000,000원
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 모바일 버전 공고리스트 */}
      <div className="mt-[37px] flex w-full flex-col gap-2 pc:hidden">
        {/* 공고리스트 드롭다운 */}
        <div className="flex w-full items-center justify-between">
          <span className="">총 {totalCount}건</span>
          <div className="flex items-center gap-1">
            <div
              className="relative flex h-[33px] min-w-32 max-w-32 cursor-pointer items-center justify-between whitespace-nowrap border border-solid border-normal bg-white px-4 py-2"
              onClick={() => {
                setIsRegisterDropdownOpen(!isRegisterDropdownOpen);
                setIsSortDropdownOpen(false);
              }}
            >
              <span className="text-sm">{selectedRegisterText}</span>
              <img
                src="/assets/images/icons/svg/down_arrow_bold.svg"
                alt="Open"
                className="w-3"
              />
              {/* 등록일 드롭다운 메뉴 */}
              {isRegisterDropdownOpen && (
                <ul className="absolute left-0 top-full z-10 mt-1 w-full border border-solid border-normal bg-white shadow-md">
                  {REGISTER_OPTIONS.map((option, index) => (
                    <li
                      key={index}
                      className="cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleRegisterOptionClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              className="relative flex h-[33px] min-w-32 max-w-32 cursor-pointer items-center justify-between whitespace-nowrap border border-solid border-normal bg-white px-4 py-2"
              onClick={() => {
                setIsSortDropdownOpen(!isSortDropdownOpen);
                setIsRegisterDropdownOpen(false);
              }}
            >
              <span className="text-sm">{selectedSortText}</span>
              <img
                src="/assets/images/icons/svg/down_arrow_bold.svg"
                alt="Open"
                className="w-3"
              />
              {/* 정렬조건 드롭다운 메뉴 */}
              {isSortDropdownOpen && (
                <ul className="absolute left-0 top-full z-10 mt-1 w-full border border-solid border-normal bg-white shadow-md">
                  {SORT_OPTIONS.map((option, index) => (
                    <li
                      key={index}
                      className="cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleSortOptionClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 공고리스트 포스트 */}
        {jobList.map((item, index) => (
          <JobPost key={index} jobPost={item} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mb-10 mt-[30px] flex w-full justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Footer */}
      {isMobileScreen ? <MainFooterMobile /> : <MainFooterPC />}

      {/* 확인 팝업 */}
      {isConfirmOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmOpen(false)}
        />
      )}

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

export default JobListContent;
