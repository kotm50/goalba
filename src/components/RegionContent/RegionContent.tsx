import { useEffect, useState } from "react";
// import JobListPC from "../JobListPC";
import MainFooterPC from "../MainFooterPC";
import Pagination from "../Pagination";
import {
  formMailAdSelectByRegionsSort,
  FormMailAdSelectByRegionsSortRequest,
  JobSiteList,
  Region,
} from "../../api/post";
import ConfirmPopup from "../ConfirmPopup";
import JobListPC from "../JobListPC";
import { useLocation } from "react-router-dom";
import {
  formMailAdDonEubMyunList,
  formMailAdSigunguList,
} from "../../api/region";
import { useMediaQuery } from "@react-hook/media-query";

export interface SelectedRegion {
  sido: string;
  sigungu: string;
  dongEubMyun: string;
}

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

/* prettier-ignore */
const SIDO_OPTIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

function RegionContent() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const location = useLocation();
  const sidoParam = new URLSearchParams(location.search).get("sido") || ""; // URL 파라미터에서 시도 정보 가져오기

  const [jobList, setJobList] = useState<JobSiteList[]>([]); // 채용공고 리스트

  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지
  const [totalCount, setTotalCount] = useState<number>(0); // 전체 개수

  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] =
    useState<boolean>(false); // 등록일 드롭다운
  const [selectedRegisterText, setSelectedRegisterText] =
    useState("등록일 전체"); // 선택된 등록일 텍스트

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false); // 정렬조건 드롭다운
  const [selectedSortText, setSelectedSortText] = useState("정렬조건"); // 선택된 정렬조건 텍스트

  const [depth1Checked, setDepth1Checked] = useState<number | null>(null); // 시도 체크 여부
  const [depth2Checked, setDepth2Checked] = useState<number | null>(null); // 시군구 체크 여부

  const [selectedSidoText, setSelectedSidoText] = useState<string>(""); // 선택된 시도 텍스트

  const [selectedSigunguText, setSelectedSigunguText] = useState<string>(""); // 선택된 시군구 텍스트
  const [sigunguOptions, setSigunguOptions] = useState<string[]>([]); // 시군구 옵션

  const [selectedDongEubMyunText, setSelectedDongEubMyunText] = useState<
    string[]
  >([]); // 선택된 동/읍/면 텍스트
  const [dongEubMyunOptions, setDongEubMyunOptions] = useState<string[]>([]); // 동/읍/면 옵션

  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>([]); // 선택된 지역

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 여부

  const [isRegionApplied, setIsRegionApplied] = useState<boolean>(false);

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 뒤로가기 여부를 확인하는 함수
  const isBackNavigation = () => {
    return location.key === sessionStorage.getItem("lastLocationKey");
  };

  // 시도 옵션 클릭 이벤트 핸들러
  const handleSidoOptionClick = (text: string) => {
    setSelectedRegions((prevRegions) => {
      // 현재 선택된 시도와 관련된 데이터는 유지하고, 다른 데이터도 보존
      const updatedRegions = [...prevRegions];
      return updatedRegions;
    });

    // 선택한 시도로 상태 초기화
    setSelectedSidoText(text);
    setSelectedSigunguText("");
    setDongEubMyunOptions([]);
    setSelectedDongEubMyunText([]);
    setDepth2Checked(null);
  };

  // 시군구 옵션 클릭 이벤트 핸들러
  const handleSigunguOptionClick = (text: string) => {
    if (text === "전체" || text === "전국 전체") {
      // "전체"가 이미 선택된 경우 제거
      if (
        selectedRegions.some(
          (region) =>
            region.sido === selectedSidoText && region.sigungu === "전체",
        )
      ) {
        setSelectedRegions((prevRegions) =>
          prevRegions.filter(
            (region) =>
              region.sido !== selectedSidoText || region.sigungu !== "전체",
          ),
        );
        setSelectedSigunguText(""); // 선택 초기화
        setDepth2Checked(null);
        return;
      }

      // "전체" 선택 처리
      setSelectedSigunguText("전체");
      setDongEubMyunOptions([]);
      setSelectedDongEubMyunText([]);
      setSelectedRegions((prevRegions) => {
        const filteredRegions = prevRegions.filter(
          (region) => region.sido !== selectedSidoText,
        );
        return [
          ...filteredRegions,
          { sido: selectedSidoText, sigungu: "전체", dongEubMyun: "전체" },
        ];
      });
      return;
    }

    // 다른 시군구 선택 시 "전체"가 이미 선택된 경우 처리
    if (
      selectedRegions.some(
        (region) =>
          region.sido === selectedSidoText && region.sigungu === "전체",
      )
    ) {
      setConfirmTitle("알림");
      setConfirmMessage("해당 시/도의 '전체'가 선택되어 있습니다.");
      setIsConfirmPopupOpen(true);
      setDepth2Checked(0);
      return;
    }

    setSelectedSigunguText(text);
    setDongEubMyunOptions([]);
    setSelectedDongEubMyunText([]);
  };

  // 동/읍/면 선택 이벤트 (중복 선택 가능)
  const handleDepth3Click = (text: string) => {
    setSelectedDongEubMyunText((prev) => {
      if (text === "전체") {
        // "전체"가 이미 선택되어 있는 경우 제거
        if (prev.includes("전체")) {
          setSelectedRegions((prevRegions) =>
            prevRegions.filter(
              (region) =>
                region.sido !== selectedSidoText ||
                region.sigungu !== selectedSigunguText ||
                region.dongEubMyun !== "전체",
            ),
          );
          return [];
        }

        // "전체"를 선택하면 기존 선택 초기화하고 "전체"만 추가
        setSelectedRegions((prevRegions) => {
          const filteredRegions = prevRegions.filter(
            (region) =>
              region.sido !== selectedSidoText ||
              region.sigungu !== selectedSigunguText,
          );
          return [
            ...filteredRegions,
            {
              sido: selectedSidoText,
              sigungu: selectedSigunguText,
              dongEubMyun: "전체",
            },
          ];
        });
        return ["전체"];
      }

      // "전체"가 선택되어 있는 경우 다른 항목 선택 불가
      if (prev.includes("전체")) {
        return prev;
      }

      // 이미 선택된 항목은 제거
      if (prev.includes(text)) {
        setSelectedRegions((prevRegions) =>
          prevRegions.filter(
            (region) =>
              region.sido !== selectedSidoText ||
              region.sigungu !== selectedSigunguText ||
              region.dongEubMyun !== text,
          ),
        );
        return prev.filter((region) => region !== text);
      }

      // 새로운 항목 추가 (최대 10개 제한)
      if (selectedRegions.length >= 5) {
        setConfirmTitle("알림");
        setConfirmMessage("최대 5개의 지역만 선택 가능합니다.");
        setIsConfirmPopupOpen(true);
        return prev;
      }

      // 새로운 항목 추가
      setSelectedRegions((prevRegions) => [
        ...prevRegions,
        {
          sido: selectedSidoText,
          sigungu: selectedSigunguText,
          dongEubMyun: text,
        },
      ]);
      return [...prev, text];
    });
  };

  // 선택 지역 표시 함수 (ex. 서울 전체, 서울 강남구 전체, 서울 강남구 역삼동)
  const getDisplayText = (region: SelectedRegion) => {
    if (region.dongEubMyun === "전체") {
      // 시/군/구 전체 선택
      if (region.sigungu === "전체") {
        return `${region.sido} 전체`;
      }
      // 동/읍/면 전체 선택
      return `${region.sido} ${region.sigungu} 전체`;
    }

    // 모두 반환
    return `${region.sido} ${region.sigungu} ${region.dongEubMyun}`;
  };

  // 초기화 버튼 클릭 이벤트
  const handleReset = () => {
    setDepth1Checked(null);
    setDepth2Checked(null);
    setSelectedSidoText("");
    setSelectedSigunguText("");
    setSigunguOptions([]);
    setDongEubMyunOptions([]);
    setSelectedDongEubMyunText([]);
    setSelectedRegions([]);
  };

  // 선택된 지역 제거
  const handleRemoveRegion = (targetRegion: SelectedRegion) => {
    // 동일한 시/군/구/동 정보를 가진 경우에만 제거하도록 처리
    setSelectedDongEubMyunText((prev) =>
      prev.filter((dong) => dong !== targetRegion.dongEubMyun),
    );

    // selectedRegions에서 제거
    setSelectedRegions((prevRegions) =>
      prevRegions.filter(
        (region) =>
          !(
            region.sido === targetRegion.sido &&
            region.sigungu === targetRegion.sigungu &&
            region.dongEubMyun === targetRegion.dongEubMyun
          ),
      ),
    );
  };

  // 선택 지역 적용 버튼 클릭 이벤트
  const handleSelectRegionButtonClick = () => {
    // 시/도가 선택되지 않은 경우
    if (!selectedSidoText) {
      setConfirmTitle("알림");
      setConfirmMessage("시/도를 선택해주세요!");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 시/도가 선택되었으나 시/군/구를 선택하지 않은 경우
    if (!selectedSigunguText) {
      setConfirmTitle("알림");
      setConfirmMessage("시/군/구를 선택해주세요!");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 시/군/구가 선택되었으나 동/읍/면을 선택하지 않은 경우
    if (
      selectedSigunguText !== "전체" &&
      selectedDongEubMyunText.length === 0 &&
      dongEubMyunOptions.length > 0 // 동/읍/면 옵션이 있는 경우에만 체크
    ) {
      setConfirmTitle("알림");
      setConfirmMessage("동/읍/면을 선택해주세요!");
      setIsConfirmPopupOpen(true);
      return;
    }

    setIsRegionApplied(true);
    fetchJobList(1); // 데이터 요청
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

  // 지역 데이터 요청
  const fetchJobList = async (page: number) => {
    const regions: Region[] = [];

    // 선택된 지역이 있을 경우 regions에 추가
    if (selectedRegions.length > 0) {
      selectedRegions.forEach(({ sido, sigungu, dongEubMyun }) => {
        regions.push({
          sido,
          sigungu: sigungu === "전체" ? undefined : sigungu,
          dongEubMyun: dongEubMyun === "전체" ? undefined : dongEubMyun,
        });
      });
    } else {
      if (sidoParam === "") {
        return;
      }

      // URL 파라미터가 있을 경우 시도 정보만 추가
      const regionData = {
        sido: sidoParam,
      };

      if (regionData.sido) {
        regions.push({ sido: regionData.sido });
      }
    }

    // 지역 데이터 요청 Request
    const req: FormMailAdSelectByRegionsSortRequest = {
      page,
      size: 20,
      ...(regions.length > 0 && { regions }), // regions가 있을 때만 추가
      ...(selectedRegisterText !== "등록일 전체" && {
        registerType: selectedRegisterText,
      }),
      ...(selectedSortText !== "정렬조건" && { sortType: selectedSortText }),
    };

    // 지역 데이터 요청 API 호출
    formMailAdSelectByRegionsSort(req).then((response) => {
      if (response && response.code === "C000") {
        // 응답 성공 시
        setJobList(response.jobSiteList);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
        window.scrollTo(0, 0); // 페이지 이동 시 스크롤 맨 위로 이동
      } else {
        // 응답 실패 시
        setConfirmTitle("알림");
        setConfirmMessage("조건에 맞는 데이터가 없습니다!");
        setIsConfirmPopupOpen(true);
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

  // 시도 변경 시 시군구 옵션 조회
  useEffect(() => {
    if (selectedSidoText === "") {
      setSigunguOptions([]);
      return;
    } else if (selectedSidoText === "전국") {
      setSigunguOptions(["전국 전체"]);
      return;
    }

    // 시군구 옵션 조회
    formMailAdSigunguList(selectedSidoText).then((response) => {
      if (response && response.code === "C000") {
        const options = Array.from(
          new Set(
            response.regionsList
              .map((region) => region.sigungu)
              .filter(
                (sigungu): sigungu is string =>
                  sigungu !== undefined && sigungu !== "전체",
              ),
          ),
        );

        // "전체" 옵션 추가
        setSigunguOptions(["전체", ...options]);
      } else {
        setSigunguOptions([]);
      }
    });
  }, [selectedSidoText]);

  // 시군구 변경 시 동/읍/면 옵션 조회
  useEffect(() => {
    if (selectedSigunguText === "전체" || selectedSigunguText === "전국 전체") {
      setDongEubMyunOptions([]); // 시군구가 "전체"일 때 동/읍/면 옵션 초기화
      return;
    }

    // 동/읍/면 옵션 조회
    if (selectedSidoText && selectedSigunguText) {
      formMailAdDonEubMyunList(selectedSidoText, selectedSigunguText).then(
        (response) => {
          if (response && response.code === "C000") {
            const options = Array.from(
              new Set(
                response.regionsList
                  .map((region) => region.dongEubMyun)
                  .filter(
                    (dongEubMyun): dongEubMyun is string =>
                      dongEubMyun !== undefined && dongEubMyun !== "전체",
                  ),
              ),
            );

            // "전체" 옵션 추가
            setDongEubMyunOptions(["전체", ...options]);
          }
        },
      );
    }
  }, [selectedSigunguText]);

  // 등록일, 정렬조건 변경 시 데이터 요청
  useEffect(() => {
    fetchJobList(1); // 필터 변경 시 첫 페이지로 이동
  }, [selectedRegisterText, selectedSortText]);

  // URL 파라미터가 있을 경우 시도 선택
  useEffect(() => {
    if (sidoParam) {
      setSelectedSidoText(sidoParam);
      setDepth1Checked(SIDO_OPTIONS.indexOf(sidoParam));
      setSelectedSigunguText("전체");
      setDepth2Checked(-1);
      setSelectedDongEubMyunText([""]);
    }
  }, [sidoParam]);

  // 뒤로가기 시 데이터 복원
  useEffect(() => {
    if (isBackNavigation()) {
      // 뒤로가기 시 세션스토리지에서 데이터 복원
      const storedRegions = sessionStorage.getItem("selectedRegions");
      const storedJobList = sessionStorage.getItem("jobList");

      // if (storedRegions) setSelectedRegions(JSON.parse(storedRegions));
      if (storedRegions) {
        const parsedRegions = JSON.parse(storedRegions);
        setSelectedRegions(parsedRegions);

        // 🔹 UI 반영: 시도, 시군구, 동/읍/면 상태 업데이트
        if (parsedRegions.length > 0) {
          const firstRegion = parsedRegions[0]; // 첫 번째 지역을 기준으로 선택 상태 설정
          setSelectedSidoText(firstRegion.sido);
          setDepth1Checked(SIDO_OPTIONS.indexOf(firstRegion.sido));

          if (firstRegion.sigungu) {
            setSelectedSigunguText(firstRegion.sigungu);
            setDepth2Checked(0); // 임의의 값 설정하여 선택 상태 반영
          }

          if (firstRegion.dongEubMyun && firstRegion.dongEubMyun !== "전체") {
            setSelectedDongEubMyunText([firstRegion.dongEubMyun]);
          }
        }
      }
      if (storedJobList) setJobList(JSON.parse(storedJobList));
      setIsRegionApplied(true);
    } else {
      // 새 방문이면 세션스토리지 초기화
      sessionStorage.removeItem("selectedRegions");
      sessionStorage.removeItem("jobList");
      setIsRegionApplied(false);
    }

    // 현재 위치 키 저장 (다음 방문과 비교)
    sessionStorage.setItem("lastLocationKey", location.key);
  }, [location.key]);

  // 지역 선택 적용 시 채용공고 리스트 요청
  useEffect(() => {
    if (isRegionApplied) {
      fetchJobList(1);
    }
  }, [isRegionApplied]);

  // 선택한 지역, 채용공고 리스트 세션스토리지 저장
  useEffect(() => {
    sessionStorage.setItem("selectedRegions", JSON.stringify(selectedRegions));
    sessionStorage.setItem("jobList", JSON.stringify(jobList));
  }, [selectedRegions, jobList]);

  return (
    <div className="flex w-full flex-col px-[10px] pt-[18px] pc:px-0 pc:pt-0">
      {/* PC 버전 타이틀 */}
      <div className="mx-auto hidden w-full max-w-[1240px] px-5 py-3 pc:flex">
        <h2 className="text-[32px] font-semibold">지역별 채용공고</h2>
      </div>

      {/* 지역 선택 */}
      <div className="mb-[30px] mt-[14px] w-full">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2.5">
          {/* 지역은 최대 5개까지 선택 가능합니다 */}
          <div className="flex w-full justify-end">
            <span className="text-sm text-[#666666]">
              지역은 최대 5개까지 선택 가능합니다
            </span>
          </div>

          <div className="flex w-full flex-col">
            {/* 지역 선택 */}
            <div className="flex h-[185px] max-h-[185px] w-full">
              {/* 시/도 */}
              <div className="flex h-full w-[200px] flex-col">
                <div className="flex h-[37px] w-full items-center justify-center border-r border-solid border-white bg-[#D9D9D9] text-sm font-semibold">
                  시/도
                </div>
                <div className="flex h-[148px] w-full">
                  <div className="grid h-full w-full grid-cols-2 overflow-y-auto bg-white">
                    {SIDO_OPTIONS.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`${depth1Checked === index ? "bg-[#FFD700]" : ""} h-[37px] w-full whitespace-nowrap text-sm font-semibold`}
                        onClick={() => {
                          setDepth1Checked(index);
                          handleSidoOptionClick(option);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                    <button
                      key={SIDO_OPTIONS.length}
                      type="button"
                      className={`${depth1Checked === SIDO_OPTIONS.length ? "bg-[#FFD700]" : ""} h-[37px] w-full whitespace-nowrap text-sm font-semibold`}
                      onClick={() => {
                        setDepth1Checked(SIDO_OPTIONS.length);
                        handleSidoOptionClick("전국");
                      }}
                    >
                      전국
                    </button>
                  </div>
                </div>
              </div>

              {/* 시/군/구 */}
              <div className="flex h-full w-[100px] flex-col">
                <div className="flex h-[37px] w-full items-center justify-center border-r border-solid border-white bg-[#D9D9D9] text-sm font-semibold">
                  시/군/구
                </div>
                <div className="flex h-[148px] w-full flex-col overflow-y-auto bg-white">
                  {sigunguOptions.length > 0 && (
                    <>
                      {sigunguOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`${
                            (option === "전체" &&
                              selectedRegions.some(
                                (region) =>
                                  region.sido === selectedSidoText &&
                                  region.sigungu === "전체",
                              )) ||
                            depth2Checked === index
                              ? "bg-[#FFD700]"
                              : ""
                          } ? "bg-[#FFD700]" : ""} flex h-[37px] min-h-[37px] w-full items-center justify-center whitespace-nowrap text-sm font-semibold`}
                          onClick={() => {
                            if (depth2Checked === index) {
                              setDepth2Checked(null);
                            } else {
                              setDepth2Checked(index);
                            }
                            handleSigunguOptionClick(option);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* 동/읍/면 */}
              <div className="flex h-full w-full flex-col">
                <div className="flex h-[37px] w-full items-center justify-center bg-[#D9D9D9] text-sm font-semibold">
                  동/읍/면
                </div>
                <div className="flex h-[148px] w-full flex-wrap gap-0 overflow-y-auto bg-white">
                  {dongEubMyunOptions.length > 0 && (
                    <>
                      {dongEubMyunOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`${
                            selectedRegions.some(
                              (region) =>
                                region.sido === selectedSidoText &&
                                region.sigungu === selectedSigunguText &&
                                region.dongEubMyun === option,
                            )
                              ? "bg-[#FFD700]"
                              : ""
                          } flex h-[37px] min-h-[37px] w-[90px] min-w-[90px] items-center justify-center whitespace-nowrap text-sm font-semibold`}
                          onClick={() => handleDepth3Click(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* 선택한 지역 */}
            <div className="flex h-[39px] w-full items-center gap-[30px] border-y border-solid border-normal bg-white px-5">
              <span className="text-xs font-semibold">선택하신 지역</span>
              <div className="flex items-center gap-2.5">
                {selectedRegions.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 rounded-[25px] bg-[#99CCFF] px-2.5 py-1"
                  >
                    <span className="text-xs font-semibold text-[#003399]">
                      {getDisplayText(region)}
                    </span>
                    <img
                      src="/assets/images/icons/svg/cancel.svg"
                      alt="Remove"
                      className="w-2 cursor-pointer"
                      onClick={() => handleRemoveRegion(region)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* 초기화/적용 */}
            <div className="flex h-[51px] w-full items-center justify-center gap-2.5 border-b border-solid border-normal bg-white">
              <button
                type="button"
                className="flex h-[35px] w-[74px] items-center justify-center rounded border border-solid border-normal bg-white text-xs font-semibold text-[#666666]"
                onClick={handleReset}
              >
                초기화
              </button>
              <button
                type="button"
                className="flex h-[35px] w-[113px] items-center justify-center rounded border border-solid border-normal bg-[#DC143C] text-xs font-semibold text-white"
                onClick={handleSelectRegionButtonClick}
              >
                선택 지역 적용
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PC 버전 드롭다운 */}
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between bg-white px-5 py-2.5">
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
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
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

export default RegionContent;
