import { useEffect, useState } from "react";
import JobListPC from "../JobListPC";
import MainFooterPC from "../MainFooterPC";
import Pagination from "../Pagination";
import { formMailAdSelectByRegionsSort, JobSiteList } from "../../api/post";
import ConfirmPopup from "../ConfirmPopup";
import { useMediaQuery } from "@react-hook/media-query";

// 등록일 옵션
const REGISTER_OPTIONS = [
  "등록일 전체",
  "오늘 등록",
  "3일이내 등록",
  "7일이내 등록",
];

// 정렬조건 옵션
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

function RecommendContent() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [jobList, setJobList] = useState<JobSiteList[]>([]); // 채용공고 리스트

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 확인 팝업 열림 여부

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

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

  // 채용공고 리스트 요청
  const fetchJobList = async (page: number) => {
    // 추천 채용공고 요청 Request
    const req = {
      page,
      size: 10,
      adType: "추천",
      ...(selectedRegisterText !== "등록일 전체" && {
        registerType: selectedRegisterText,
      }),
      ...(selectedSortText !== "정렬조건" && { sortType: selectedSortText }),
    };

    // 추천 채용공고 요청 API 호출
    formMailAdSelectByRegionsSort(req).then((response) => {
      if (response && response.code === "C000") {
        // 응답 성공 시
        setJobList(response.jobSiteList);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        // 응답 실패 시
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

  return (
    <div className="flex w-full flex-col px-[10px] pt-[18px] pc:px-0 pc:pt-0">
      {/* PC 버전 타이틀 */}
      <div className="mx-auto hidden w-full max-w-[1240px] px-5 py-3 pc:flex">
        <h2 className="text-[32px] font-semibold">추천 채용공고</h2>
      </div>

      {/* PC 버전 드롭다운 */}
      <div className="mx-auto flex w-full max-w-[1220px] items-center justify-between bg-white px-5 py-2.5">
        <span className="text-base">
          총 <span className="font-bold">{totalCount}</span>건
        </span>
        <div className="flex items-center gap-1 pc:gap-0">
          {/* 등록일 */}
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

          {/* 정렬조건 */}
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

      {/* PC 버전 추천 공고리스트 */}
      <div className="w-full">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-2.5 p-2.5">
          {jobList.map((item, index) => (
            <JobListPC key={index} jobPost={item} />
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mx-auto flex w-full pb-[143px] pt-[30px]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 푸터 */}
      <MainFooterPC />

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

export default RecommendContent;
