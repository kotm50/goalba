import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainFooterPC from "../../components/MainFooterPC";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FindOneNotice, noticeFindOne } from "../../api/notice";

function NoticeDetail() {
  const location = useLocation();
  const noticeNum = location.state.noticeNum;
  const navigate = useNavigate();

  const [notice, setNotice] = useState<FindOneNotice>(); // 공지사항 상세 정보

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 맨 위로 이동 버튼 표시 여부

  // 목록으로 버튼 클릭 이벤트
  const handleBackToListButtonClick = () => {
    navigate("/notice"); // 공지사항 목록 페이지로 이동
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

  // noticeNum이 변경될 때마다 실행
  useEffect(() => {
    // 공지사항 상세 조회 API 호출
    noticeFindOne(noticeNum).then((response) => {
      if (response && response.code === "C000") {
        setNotice(response.findOneNotice);
      }
    });
  }, [noticeNum]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"공지사항"} /> : <MainHeaderPC />}

      <div className="w-full pc:mx-auto pc:max-w-[1240px] pc:px-5 pc:pt-[50px]">
        {/* 공지사항 제목 */}
        <li className="flex h-[90px] min-h-[90px] w-full flex-col justify-between border-b border-solid border-normal bg-white p-5 pc:h-[60px] pc:min-h-[60px] pc:flex-row pc:items-center">
          <h2 className="line-clamp-1 text-base font-bold">{notice?.title}</h2>
          <div className="flex items-center gap-2 pc:gap-2.5">
            <span className="hidden text-sm font-semibold text-[#666666] pc:block">
              등록일
            </span>
            <span className="text-sm text-[#666666]">
              {notice?.created.split("T")[0]}
            </span>
            <span className="text-xxs text-[#666666] pc:hidden">|</span>
            <div className="hidden h-[14px] w-[1px] bg-[#D9D9D9] pc:block"></div>
            <span className="text-sm text-[#666666] pc:hidden">
              조회 {notice?.viewCount}
            </span>
            <span className="hidden text-sm font-semibold text-[#666666] pc:block">
              조회수
            </span>
            <span className="hidden text-sm text-[#666666] pc:block">
              {notice?.viewCount}
            </span>
          </div>
        </li>

        {/* 공지사항 내용 */}
        <div className="flex w-full flex-col gap-[17px] bg-white p-5 pc:min-h-[300px]">
          {notice?.content
            ?.split("\n") // \n을 기준으로 문자열 분리
            .map((line, index) => (
              <p key={index} className="text-sm">
                {line}
              </p>
            ))}
        </div>

        {/* PC 버전 목록으로 버튼 */}
        <div className="hidden w-full pb-[69px] pt-[50px] pc:flex">
          <button
            type="button"
            className="button mx-auto h-[41px] w-[85px] rounded border border-solid border-normal bg-white text-base"
            onClick={handleBackToListButtonClick}
          >
            목록으로
          </button>
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

export default NoticeDetail;
