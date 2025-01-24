import { useMediaQuery } from "@react-hook/media-query";
import JobPost from "../JobPost";
import MainFooterMobile from "../MainFooterMobile";
import Pagination from "../Pagination";
import MainFooterPC from "../MainFooterPC";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  formMailAdSelectByRegionsSort,
  FormMailAdSelectByRegionsSortRequest,
  JobSiteList,
  Region,
} from "../../api/post";
import ConfirmPopup from "../ConfirmPopup";
import { SelectedRegion } from "../RegionMenuMobile/RegionMenuMobile";

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

function SearchResultContent() {
  const navigate = useNavigate();

  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get("keyword"); // params에서 검색어 가져오기
  const sidoParam = new URLSearchParams(location.search).get("sido"); // params에서 시도 가져오기
  const sigunguParam = new URLSearchParams(location.search).get("sigungu"); // params에서 시군구 가져오기
  const dongEubMyunParam = new URLSearchParams(location.search).get(
    "dongEubMyun",
  ); // params에서 동/읍/면 가져오기

  const selectedRegions: SelectedRegion[] =
    location.state?.selectedRegions || []; // 전달된 selectedRegions

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const imgUrl = import.meta.env.VITE_IMG_URL; // 이미지 URL 접두어

  const [searchList, setSearchList] = useState<JobSiteList[]>([]); // 검색결과 리스트

  const [searchInput, setSearchInput] = useState<string>(""); // 검색어 입력
  const [searchText, setSearchText] = useState<string | null>(searchKeyword); // 검색어

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

  // 검색어 변경 이벤트 핸들러
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // 등록일 옵션 클릭 이벤트 핸들러
  const handleRegisterOptionClick = (text: string) => {
    setSelectedRegisterText(text); // 선택된 등록일 텍스트 업데이트
    setIsRegisterDropdownOpen(false); // 드롭다운 닫기
  };

  // 정렬조건 옵션 클릭 이벤트 핸들러
  const handleSortOptionClick = (text: string) => {
    setSelectedSortText(text); // 선택된 정렬조건 텍스트 업데이트
    setIsSortDropdownOpen(false); // 드롭다운 닫기
  };

  const fetchSearchList = (page: number) => {
    // state와 params에서 값을 통합적으로 가져오기
    const regions: Region[] = [];

    if (selectedRegions.length > 0) {
      // location.state.selectedRegions가 있으면 이를 그대로 regions에 추가
      selectedRegions.forEach(({ sido, sigungu, dongEubMyun }) => {
        regions.push({
          sido,
          sigungu: sigungu === "전체" ? undefined : sigungu,
          dongEubMyun: dongEubMyun === "전체" ? undefined : dongEubMyun,
        });
      });
    } else {
      // selectedRegions가 없으면 URL 파라미터를 기반으로 regions 생성
      const regionData = {
        sido: sidoParam,
        sigungu: sigunguParam === "전체" ? undefined : sigunguParam,
        dongEubMyun: dongEubMyunParam === "전체" ? undefined : dongEubMyunParam,
      };

      if (regionData.dongEubMyun) {
        // dongEubMyun이 존재하면 각 동/읍/면 별로 객체 생성
        regions.push({
          sido: regionData.sido || undefined,
          sigungu: regionData.sigungu || undefined,
          dongEubMyun: regionData.dongEubMyun,
        });
      } else if (regionData.sigungu) {
        // sigungu만 있는 경우
        regions.push({
          sido: regionData.sido || undefined,
          sigungu: regionData.sigungu,
        });
      } else if (regionData.sido) {
        // sido만 있는 경우
        regions.push({ sido: regionData.sido });
      }
    }

    // 요청 객체 생성
    const formMailAdSelectByRegionsSortRequest: FormMailAdSelectByRegionsSortRequest =
      {
        page: page,
        size: 5,
        ...(regions.length > 0 && { regions }), // regions가 존재하면 추가
        ...(selectedRegisterText !== "등록일 전체" && {
          registerType: selectedRegisterText,
        }),
        ...(selectedSortText !== "정렬조건" && { sortType: selectedSortText }),
        ...(searchText && { keyword: searchText }), // 검색어 반영
      };

    // 검색 API 호출
    formMailAdSelectByRegionsSort(formMailAdSelectByRegionsSortRequest).then(
      (response) => {
        if (response && response.code === "C000") {
          setSearchList(response.jobSiteList);
          setTotalPages(response.totalPages);
          setTotalCount(response.totalCount);
          window.scrollTo(0, 0); // 페이지 이동 시 스크롤 맨 위로 이동
        } else {
          setConfirmTitle("알림");
          setConfirmMessage("조건에 맞는 데이터가 없습니다!");
          setIsConfirmOpen(true);
          setSearchList([]); // 데이터 없을 시 빈 배열로 초기화
          setTotalPages(1);
          setTotalCount(0);
          window.scrollTo(0, 0); // 페이지 이동 시 스크롤 맨 위로 이동
        }
      },
    );
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 현재 페이지 업데이트
    fetchSearchList(page); // 새로운 페이지 데이터 요청
  };

  // 검색 버튼 클릭 이벤트 핸들러
  const handleSearchButtonClick = () => {
    // 검색어 없을 시 알림
    if (!searchInput) {
      setConfirmTitle("검색어 입력");
      setConfirmMessage("검색어를 입력해주세요.");
      setIsConfirmOpen(true);
      return;
    }

    // URL 업데이트
    const params = new URLSearchParams();
    if (searchText) params.append("keyword", searchText); // 검색어
    if (sidoParam) params.append("sido", sidoParam); // 시도
    if (sigunguParam) params.append("sigungu", sigunguParam); // 시군구
    if (dongEubMyunParam) params.append("dongEubMyun", dongEubMyunParam); // 동/읍/면

    // URL 업데이트
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${params.toString()}`,
    );

    setSearchText(searchInput); // 검색어 상태 업데이트
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

  // 현재 페이지가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchSearchList(currentPage);
  }, [currentPage]);

  // 등록일, 정렬조건 변경 시 데이터 요청
  useEffect(() => {
    fetchSearchList(1); // 필터 변경 시 첫 페이지로 이동
  }, [selectedRegisterText, selectedSortText]);

  // 검색어 변경 시 검색어 반영
  useEffect(() => {
    if (searchKeyword) {
      setSearchText(searchKeyword); // 상태 동기화
    }
  }, [searchKeyword]);

  // 검색어 변경 시 데이터 요청
  useEffect(() => {
    if (searchText) {
      fetchSearchList(1); // 검색어 변경 시 첫 페이지로 이동
    }
  }, [searchText]);

  return (
    <div className="flex w-full flex-col px-[10px] pt-[18px] pc:px-0 pc:pt-3">
      {/* 모바일 버전 검색 필터링 */}
      <div className="px-[10px] pc:hidden">
        <div className="flex h-12 w-full items-center justify-between gap-4 rounded-[4px] bg-white px-[10px]">
          <input
            type="text"
            className="h-full w-full text-sm text-black placeholder:text-[#666666]"
            placeholder="검색키워드"
            value={searchInput || ""}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchButtonClick();
              }
            }}
          />
          <img
            src="/assets/images/icons/svg/search.svg"
            alt="Search"
            className="h-5 w-5"
            onClick={handleSearchButtonClick}
          />
        </div>
      </div>

      {/* 공고리스트 */}
      <div className="mt-[37px] flex w-full flex-col gap-2 pc:mt-0">
        {/* 검색결과 텍스트 */}
        {searchText && (
          <div className="flex w-full justify-start pc:mx-auto pc:max-w-[1240px] pc:px-5 pc:py-3">
            <span className="text-lg pc:text-xl">
              '<span className="font-bold text-[#0099FF]">{searchText}</span>
              '에 대한 검색결과입니다.
            </span>
          </div>
        )}

        {/* 공고리스트 드롭다운 */}
        <div className="flex w-full items-center justify-between pc:mx-auto pc:max-w-[1240px] pc:px-5">
          <span className="whitespace-nowrap text-sm pc:hidden">
            총 {totalCount.toLocaleString()}건
          </span>
          <span className="hidden text-sm pc:block">
            채용정보 검색결과{" "}
            <span className="font-bold text-[#0099FF]">
              {totalCount.toLocaleString()}
            </span>{" "}
            건
          </span>
          <div className="flex items-center gap-1 pc:gap-0">
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
        {isMobileScreen ? (
          searchList.map((item, index) => (
            <JobPost key={index} jobPost={item} />
          ))
        ) : (
          <div className="flex w-full flex-col gap-2.5 bg-white">
            {searchList.map((item, index) => (
              <div
                className="w-full border-b border-solid border-normal bg-white"
                onClick={() => {
                  navigate(`/joblist/${item?.aid}`);
                }}
              >
                <div
                  key={index}
                  className="mx-auto flex h-[83px] w-full max-w-[1240px] cursor-pointer items-center justify-between px-5"
                >
                  <div className="flex items-center gap-[29px]">
                    <img
                      src={`${imgUrl}${item?.logoImg}`}
                      alt="Company Logo"
                      className="h-10 w-[100px] object-contain"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold leading-[22px]">
                        {item?.title}
                      </span>
                      <span className="text-sm leading-[17px] text-[#666666]">
                        {item?.sido} {item?.sigungu}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg">
                    <span className="font-bold text-[#DC143C]">
                      {item?.salaryType}
                    </span>{" "}
                    {Number(item?.salary).toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-[27px] flex w-full justify-center pc:mb-[38px] pc:mt-[90px]">
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

export default SearchResultContent;
