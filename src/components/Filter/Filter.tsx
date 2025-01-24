import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formMailAdSigunguList } from "../../api/region";
import ConfirmPopup from "../ConfirmPopup";

/* prettier-ignore */
const SIDO_OPTIONS = ["선택" ,"서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

function FilterMobile() {
  const navigate = useNavigate();

  const [isSidoDropdownOpen, setIsSidoDropdownOpen] = useState<boolean>(false); // 시도 드롭다운
  const [selectedSidoText, setSelectedSidoText] = useState("선택"); // 선택된 시도 텍스트

  const [sigunguOptions, setSigunguOptions] = useState<string[]>([]); // 시군구 옵션
  const [isSigunguDropdownOpen, setIsSigunguDropdownOpen] =
    useState<boolean>(false); // 시군구 드롭다운
  const [selectedSigunguText, setSelectedSigunguText] = useState("선택"); // 선택된 시군구 텍스트

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 확인 팝업

  // 시도 옵션 클릭 이벤트 핸들러
  const handleRegionOptionClick = (text: string) => {
    setSelectedSidoText(text);
    setIsSidoDropdownOpen(false); // 드롭다운 닫기
  };

  // 시군구 옵션 클릭 이벤트 핸들러
  const handleSigunguOptionClick = (text: string) => {
    setSelectedSigunguText(text);
    setIsSigunguDropdownOpen(false); // 드롭다운 닫기
  };

  // 검색 키워드 변경 이벤트 핸들러
  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 버튼 클릭 이벤트 핸들러
  const handleSearchButtonClick = () => {
    // 조건 체크
    if (selectedSidoText !== "선택" && selectedSigunguText === "선택") {
      // 시도만 선택된 경우
      setConfirmTitle("알림");
      setConfirmMessage("시군구를 선택해주세요.");
      setIsConfirmOpen(true);
      return;
    }
    if (selectedSidoText === "선택" && searchKeyword.trim() === "") {
      // 시도와 검색어가 입력되지 않은 경우
      setConfirmTitle("알림");
      setConfirmMessage("검색어를 입력하거나, 시도와 시군구를 선택해주세요.");
      setIsConfirmOpen(true);
      return;
    }

    if (location.pathname.includes("/short")) {
      // 단기 공고 페이지로 이동
      navigate(
        `/short?keyword=${searchKeyword.trim()}` +
          `&sido=${selectedSidoText !== "선택" ? selectedSidoText : ""}` +
          `&sigungu=${selectedSigunguText !== "선택" ? selectedSigunguText : ""}`,
      );
    } else if (location.pathname.includes("/urgent")) {
      // 급구 공고 페이지로 이동
      navigate(
        `/urgent?keyword=${searchKeyword.trim()}` +
          `&sido=${selectedSidoText !== "선택" ? selectedSidoText : ""}` +
          `&sigungu=${selectedSigunguText !== "선택" ? selectedSigunguText : ""}`,
      );
    } else if (location.pathname.includes("/recommend")) {
      // 추천 공고 페이지로 이동
      navigate(
        `/recommend?keyword=${searchKeyword.trim()}` +
          `&sido=${selectedSidoText !== "선택" ? selectedSidoText : ""}` +
          `&sigungu=${selectedSigunguText !== "선택" ? selectedSigunguText : ""}`,
      );
    } else {
      // 검색 결과 페이지로 이동
      navigate(
        `/search?keyword=${searchKeyword.trim()}` +
          `&sido=${selectedSidoText !== "선택" ? selectedSidoText : ""}` +
          `&sigungu=${selectedSigunguText !== "선택" ? selectedSigunguText : ""}`,
      );
    }
  };

  // 시도 변경 시 시군구 옵션 조회
  useEffect(() => {
    // 시도가 선택되지 않은 경우 시군구 옵션 초기화
    if (selectedSidoText === "선택") {
      setSelectedSigunguText("선택");
      setSigunguOptions([]);
      return;
    }

    // 시군구 옵션 조회
    formMailAdSigunguList(selectedSidoText).then((response) => {
      if (response && response.code === "C000") {
        setSigunguOptions(
          Array.from(
            new Set(
              response.regionsList
                .map((region) => region.sigungu)
                .filter(
                  (sigungu): sigungu is string =>
                    sigungu !== undefined && sigungu !== "전체",
                ),
            ),
          ),
        );
        setSelectedSigunguText("선택");
      }
    });
  }, [selectedSidoText]);

  return (
    <div className="flex w-full flex-col gap-[2px]">
      {/* 드롭다운 필터링 */}
      <div className="flex h-12 w-full items-center justify-between rounded-[4px] bg-white px-[10px]">
        <div
          className="relative flex h-full w-[100px] cursor-pointer items-center justify-between"
          onClick={() => {
            setIsSidoDropdownOpen(!isSidoDropdownOpen);
            setIsSigunguDropdownOpen(false); // 시군구 드롭다운 닫기
          }}
        >
          <span className="text-xs text-black">{selectedSidoText}</span>
          <img
            src="/assets/images/icons/svg/down_arrow_bold.svg"
            alt="Down Arrow"
            className={`${isSidoDropdownOpen && "rotate-180"} h-3 w-3`}
          />
          {/* 시도 드롭다운 메뉴 */}
          {isSidoDropdownOpen && (
            <ul className="absolute left-0 top-full z-10 mt-1 w-full border border-solid border-normal bg-white shadow-md">
              {SIDO_OPTIONS.map((option, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleRegionOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="h-4 w-[1px] bg-black"></div>
        <div
          className="relative flex h-full w-[100px] items-center justify-between"
          onClick={() => {
            setIsSigunguDropdownOpen(!isSigunguDropdownOpen);
            setIsSidoDropdownOpen(false); // 시도 드롭다운 닫기
          }}
        >
          <span className="text-xs text-black">{selectedSigunguText}</span>
          <img
            src="/assets/images/icons/svg/down_arrow_bold.svg"
            alt="Down Arrow"
            className="h-3 w-3"
          />
          {/* 시군구 드롭다운 메뉴 */}
          {isSigunguDropdownOpen && sigunguOptions.length > 0 && (
            <ul className="trnasform absolute left-1/2 top-full z-10 mt-1 w-auto -translate-x-1/2 border border-solid border-normal bg-white shadow-md">
              <li
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => handleSigunguOptionClick("전체")}
              >
                전체
              </li>
              {sigunguOptions.map((option, index) => (
                <li
                  key={index}
                  className="cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSigunguOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* 검색 필터링 */}
      <div className="flex h-12 w-full items-center justify-between gap-4 rounded-[4px] bg-white px-[10px]">
        <input
          type="text"
          className="h-full w-full text-xs text-black"
          value={searchKeyword}
          onChange={handleSearchKeywordChange}
        />
        <img
          src="/assets/images/icons/svg/search.svg"
          alt="Search"
          className="h-5 w-5"
          onClick={handleSearchButtonClick}
        />
      </div>

      {/* 확인 팝업 */}
      {isConfirmOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}

export default FilterMobile;
