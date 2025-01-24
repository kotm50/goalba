import { useMediaQuery } from "@react-hook/media-query";
import JobListPC from "../JobListPC";
import MainFooterPC from "../MainFooterPC";
import Pagination from "../Pagination";
import { useEffect, useState } from "react";

function CustomContent() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 맨 위로 이동 버튼 표시 여부

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

  return (
    <div className="flex w-full flex-col px-[10px] pt-[18px] pc:px-0 pc:pt-0">
      {/* PC 버전 타이틀 */}
      <div className="mx-auto hidden w-full max-w-[1240px] px-5 py-3 pc:flex">
        <h2 className="text-[32px] font-semibold">맞춤 채용공고</h2>
      </div>

      {/* PC 버전 드롭다운 */}
      <div className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between bg-white px-5 py-2.5">
          <span className="text-base">
            총 <span className="font-bold">9999999</span>건
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

      {/* PC 버전 맞춤 공고리스트 */}
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-2.5 p-2.5">
        {Array.from({ length: 20 }).map((_, index) => (
          <JobListPC key={index} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mx-auto flex w-full pb-[143px] pt-[30px]">
        <Pagination />
      </div>

      {/* 푸터 */}
      <MainFooterPC />

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

export default CustomContent;
