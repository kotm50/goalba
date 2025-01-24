import { useEffect, useRef, useState } from "react";
import AppBar from "../AppBar";
import { useNavigate } from "react-router-dom";
import {
  formMailAdDonEubMyunList,
  formMailAdSigunguList,
} from "../../api/region";
import ConfirmPopup from "../ConfirmPopup";

interface RegionMenuMobileProps {
  isOpen: boolean;
  setIsRegionMenuOpen: (isOpen: boolean) => void;
}

export interface SelectedRegion {
  sido: string;
  sigungu: string;
  dongEubMyun: string;
}

/* prettier-ignore */
const SIDO_OPTIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

function RegionMenuMobile(regionMenuMobileProps: RegionMenuMobileProps) {
  const { isOpen, setIsRegionMenuOpen } = regionMenuMobileProps;

  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState<boolean>(false); // 옆 동 묶기 체크 여부

  const [depth1Checked, setDepth1Checked] = useState<number | null>(null); // 시도 체크 여부
  const [depth2Checked, setDepth2Checked] = useState<number | null>(null); // 시군구 체크 여부

  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(true); // 선택된 지역 펼치기 여부

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

  const [stickyHeight, setStickyHeight] = useState<number>(0); // sticky 높이
  const stickyRef = useRef<HTMLDivElement | null>(null); // 초기화/검색 버튼 sticky ref

  // 뒤로가기 버튼 클릭 시 메뉴 닫기
  const handleBackButtonClick = () => {
    setIsRegionMenuOpen(false);
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

      // "전체"가 10개 이상 선택된 경우
      if (selectedRegions.length >= 10) {
        setConfirmTitle("알림");
        setConfirmMessage("최대 10개의 지역만 선택 가능합니다.");
        setIsConfirmPopupOpen(true);
        return;
      }

      // "전체" 선택 시 기존 선택 초기화하고 "전체"만 추가
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

        // "전체"가 10개 이상 선택된 경우
        if (selectedRegions.length >= 10) {
          setConfirmTitle("알림");
          setConfirmMessage("최대 10개의 지역만 선택 가능합니다.");
          setIsConfirmPopupOpen(true);
          return prev; // 선택을 막음
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
      if (selectedRegions.length >= 10) {
        setConfirmTitle("알림");
        setConfirmMessage("최대 10개의 지역만 선택 가능합니다.");
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

  // 선택 지역 표시 함수
  const getDisplayText = (region: SelectedRegion) => {
    if (region.dongEubMyun === "전체") {
      // 시/군/구 전체 선택
      if (region.sigungu === "전체") {
        return `${region.sido} 전체`;
      }
      // 동/읍/면 전체 선택
      return `${region.sido} ${region.sigungu} 전체`;
    }

    // 동/읍/면만 반환
    return region.dongEubMyun;
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

  // 시도 변경 시 시군구 옵션 조회
  useEffect(() => {
    if (selectedSidoText === "") {
      setSigunguOptions([]); // 시도가 선택되지 않은 경우 시군구 옵션 초기화
      return;
    } else if (selectedSidoText === "전국") {
      setSigunguOptions(["전국 전체"]); // "전국 전체" 옵션 추가
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

        // 시군구 옵션 맨 앞에 "전체" 옵션 추가
        setSigunguOptions(["전체", ...options]);
      } else {
        setSigunguOptions([]);
      }
    });
  }, [selectedSidoText]);

  // 시군구 변경 시 동/읍/면 옵션 조회
  useEffect(() => {
    if (selectedSigunguText === "전체" || selectedSigunguText === "전국 전체") {
      setDongEubMyunOptions([]); // 시군구가 "전체" or "전국 전체"인 경우 동/읍/면 옵션 초기화
      return;
    }

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

            // 동/읍/면 옵션 맨 앞에 "전체" 옵션 추가
            setDongEubMyunOptions(["전체", ...options]);
          }
        },
      );
    }
  }, [selectedSigunguText]);

  // 메뉴가 열렸을 때 body의 스크롤을 막음
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 메뉴가 열렸을 때 body 스크롤 막음
    } else {
      document.body.style.overflow = ""; // 메뉴가 닫혔을 때 body 스크롤 허용
    }

    return () => {
      document.body.style.overflow = ""; // 컴포넌트가 언마운트될 때 body 스크롤 허용
    };
  }, [isOpen]);

  if (!isOpen) return null; // 메뉴가 닫혔을 때 null 반환

  // stickyRef가 변경될 때마다 높이 재조정
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (stickyRef.current) {
        setStickyHeight(stickyRef.current.offsetHeight); // sticky 높이 재조정
      }
    });

    // stickyRef가 존재하면 observer 등록
    if (stickyRef.current) {
      observer.observe(stickyRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      setStickyHeight(stickyRef.current.offsetHeight); // 초기 높이 설정
    }

    return () => observer.disconnect(); // 컴포넌트가 언마운트될 때 observer 해제
  }, []);

  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-full flex-col">
      <AppBar
        title={"지역보기"}
        handleBackButtonClick={handleBackButtonClick}
      />

      <div
        className="flex w-full flex-col items-start bg-main pt-[30px]"
        style={{
          height: `calc(100dvh - 48px - ${stickyHeight}px)`,
        }}
      >
        {/* 검색 필터링 */}
        <div className="flex w-full items-center justify-center px-[20px]">
          <div className="flex h-12 w-full items-center justify-between gap-4 rounded-[4px] bg-white px-[10px]">
            <input type="text" className="h-full w-full text-xs text-black" />
            <img
              src="/assets/images/icons/svg/search.svg"
              alt="Search"
              className="h-5 w-5"
            />
          </div>
        </div>

        {/* 옆 동 묶기 선택 */}
        <div className="mt-[25px] flex w-full items-center justify-end pr-[10px]">
          <div
            className={`${isChecked ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
            onClick={() => {
              setIsChecked(!isChecked);
              // TODO: 옆 동 묶기 기능 추가
            }}
          >
            {isChecked ? (
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
          <span className="ml-[5px] text-sm">옆 동 묶기</span>
          <img
            src="/assets/images/icons/svg/question.svg"
            alt="Question"
            className="ml-[7px] h-6 min-h-6 w-6 min-w-6 cursor-pointer"
          />
        </div>

        {/* 지역 선택 */}
        <div
          className="flex w-full flex-col"
          style={{ height: "calc(100% - 48px - 49px" }}
        >
          <div className="mt-[11px] flex h-[30px] min-h-[30px] w-full border-y border-solid border-normal bg-white">
            <div className="flex h-full w-[100px] min-w-[100px] items-center justify-center border-r border-solid border-normal text-sm">
              시/도
            </div>
            <div className="flex h-full w-full items-center justify-center border-r border-solid border-normal text-sm">
              시/군/구
            </div>
            <div className="flex h-full w-full items-center justify-center text-sm">
              동/읍/면
            </div>
          </div>

          <div className="flex w-full" style={{ height: "calc(100% - 41px)" }}>
            {/* 시/도 */}
            <ul className="flex h-full w-[100px] min-w-[100px] flex-col overflow-y-auto">
              {SIDO_OPTIONS.map((option, index) => (
                <li
                  key={index}
                  className={`${depth1Checked === index ? "bg-white" : ""} flex h-12 min-h-12 cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
                  onClick={() => {
                    setDepth1Checked(index); // 시도 체크
                    handleSidoOptionClick(option); // 시도 옵션 클릭 이벤트 핸들러
                  }}
                >
                  {option}
                </li>
              ))}
              <li
                key={SIDO_OPTIONS.length}
                className={`${depth1Checked === SIDO_OPTIONS.length ? "bg-white" : ""} flex h-12 min-h-12 cursor-pointer items-center justify-center border-b border-solid border-normal text-sm`}
                onClick={() => {
                  setDepth1Checked(SIDO_OPTIONS.length); // 시도 체크
                  handleSidoOptionClick("전국"); // 시도 옵션 클릭 이벤트 핸들러
                }}
              >
                전국
              </li>
            </ul>

            {/* 시/군/구 */}
            <ul className="flex h-full w-full flex-col overflow-y-auto bg-white">
              {sigunguOptions.map((option, index) => (
                <li
                  key={index}
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
                  } flex h-12 min-h-12 cursor-pointer items-center justify-center text-sm`}
                  onClick={() => {
                    if (
                      depth2Checked === index ||
                      (selectedRegions.length >= 10 &&
                        (option === "전체" || option === "전국 전체"))
                    ) {
                      setDepth2Checked(null);
                    } else {
                      setDepth2Checked(index);
                    }
                    handleSigunguOptionClick(option);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>

            {/* 동/읍/면 */}
            <ul className="flex h-full w-full flex-col overflow-y-auto bg-white">
              {dongEubMyunOptions.length > 0 && (
                <>
                  {dongEubMyunOptions.map((option, index) => (
                    <li
                      key={index}
                      className={`${
                        selectedRegions.some(
                          (region) =>
                            region.sido === selectedSidoText &&
                            region.sigungu === selectedSigunguText &&
                            region.dongEubMyun === option,
                        )
                          ? "bg-[#FFD700]"
                          : ""
                      } flex h-12 min-h-12 cursor-pointer items-center justify-center text-sm`}
                      onClick={() => handleDepth3Click(option)}
                    >
                      {option}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 초기화 / 검색 버튼 */}
      <div
        ref={stickyRef} // sticky ref
        className="sticky bottom-0 left-0 flex w-full flex-col bg-white"
      >
        {/* 선택 가능 지역 */}
        <div className="flex w-full flex-col items-center gap-5 border-y border-solid border-normal p-2.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">선택 가능 지역</span>
              <span className="text-sm text-[#0099FF]">
                최대 10개 ({selectedRegions.length}/10)
              </span>
            </div>
            {selectedDongEubMyunText.length > 0 && (
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span className="text-sm">
                  {isSelectOpen ? "접기" : "펼치기"}
                </span>
                <img
                  src="/assets/images/icons/svg/down_arrow_bold.svg"
                  alt="Arrow"
                  className={`h-3 w-3 transform ${
                    isSelectOpen ? "" : "rotate-180"
                  }`}
                />
              </div>
            )}
          </div>
          {isSelectOpen && selectedRegions.length > 0 && (
            <div className="flex w-full flex-col gap-2.5 overflow-x-auto">
              <div className="flex w-full gap-2.5">
                {selectedRegions.slice(0, 5).map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 whitespace-nowrap rounded bg-[#BBDDFF] px-2.5 py-[2.5px]"
                  >
                    <span className="whitespace-nowrap text-xs">
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

              <div className="flex w-full gap-2.5">
                {selectedRegions.slice(5, 10).map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 whitespace-nowrap rounded bg-[#BBDDFF] px-2.5 py-[2.5px]"
                  >
                    <span className="whitespace-nowrap text-xs">
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
          )}
        </div>

        {/* 초기화 / 검색 버튼 */}
        <div className="flex h-16 min-h-16 items-center justify-center gap-2.5 px-[10px]">
          <button
            type="button"
            className="flex h-12 w-[100px] min-w-[100px] items-center justify-center bg-[#D9D9D9] text-sm"
            onClick={handleReset}
          >
            초기화
          </button>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center bg-[#DC143C] text-sm text-white"
            onClick={() => {
              setIsRegionMenuOpen(false);
              navigate("/search", {
                state: {
                  selectedRegions,
                },
              });
            }}
          >
            선택 지역 검색
          </button>
        </div>
      </div>

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )}
    </div>
  );
}

export default RegionMenuMobile;
