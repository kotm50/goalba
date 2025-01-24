import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Pagination from "../../components/Pagination";
import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainFooterPC from "../../components/MainFooterPC";
import { useEffect, useState } from "react";
import {
  noticeFindAllList,
  NoticeFindAllListRequest,
  NoticeList,
} from "../../api/notice";

function Notice() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 검색 키워드

  const [noticeList, setNoticeList] = useState<NoticeList[]>([]); // 공지사항 리스트
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 맨 위로 이동 버튼 표시 여부

  // 검색어 입력 이벤트
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 공지사항 리스트 클릭 이벤트
  const handleNoticeClick = (noticeNum: number) => {
    navigate(`/notice/${noticeNum}`, { state: { noticeNum } }); // 공지사항 상세 페이지로 이동
  };

  // 공지사항 목록 요청
  const fetchNoticeList = async (page: number) => {
    // 공지사항 전체 조회 API Request
    const noticeFindAllListRequest: NoticeFindAllListRequest = {
      page,
      size: 10,
      type: "B01",
      keyword: searchKeyword ? searchKeyword : undefined,
    };

    // 공지사항 전체 조회 API 호출
    const response = await noticeFindAllList(noticeFindAllListRequest);
    if (response && response.code === "C000") {
      setNoticeList(response.noticeList); // 공지사항 리스트 설정
      setTotalPages(response.totalPages); // 총 페이지 수 설정
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 현재 페이지 변경
    fetchNoticeList(page); // 새로운 페이지 데이터 요청
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

  // 현재 페이지 변경
  useEffect(() => {
    fetchNoticeList(currentPage);
  }, [currentPage]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"공지사항"} /> : <MainHeaderPC />}

      <div className="w-full pc:px-5 pc:pt-[50px]">
        {/* PC 버전 타이틀/검색바 */}
        <div className="hidden w-full items-end justify-between pc:mx-auto pc:flex pc:max-w-[1240px]">
          <h2 className="text-[32px] font-semibold">공지사항</h2>
          <div className="flex h-12 min-h-12 w-[480px] items-center justify-between bg-white px-2.5">
            <input
              type="text"
              placeholder="궁금한 점을 찾아보세요"
              className="h-full w-full text-base text-black placeholder:text-[#666666]"
              value={searchKeyword || ""}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchNoticeList(1);
                }
              }}
            />
            <img
              src="/assets/images/icons/svg/search.svg"
              alt="Search"
              className="w-5 min-w-5"
              onClick={() => fetchNoticeList(1)}
            />
          </div>
        </div>

        {/* PC 버전 게시판 리스트 */}
        <table className="mx-auto mt-[14px] hidden w-full max-w-[1240px] flex-col bg-white pc:block">
          <thead className="h-12 min-h-12 border-y border-solid border-normal">
            <tr>
              <th className="w-[180px] min-w-[180px] text-base font-bold">
                등록일
              </th>
              <th className="w-full text-base font-bold">제목</th>
              <th className="w-[120px] min-w-[120px] text-base font-bold">
                조회수
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, index) => (
              <tr
                key={index}
                className="h-12 min-h-12 cursor-pointer border-b border-solid border-normal bg-[#FFF9EC]"
                onClick={() => navigate("/notice/1")}
              >
                <td className="w-[180px] text-center text-base text-[#666666]">
                  2024-12-01
                </td>
                <td className="flex h-12 w-full items-center justify-between px-2.5 text-base font-bold">
                  보이스피싱 전화금융사기 범죄 연루 관련 주의사항 안내  
                </td>
                <td className="w-[120px] text-center text-base text-[#666666]">
                  101
                </td>
              </tr>
            ))}
            {noticeList.map((notice, index) => (
              <tr
                key={index}
                className="h-12 min-h-12 cursor-pointer border-b border-solid border-normal"
                onClick={() => handleNoticeClick(notice.num)}
              >
                <td className="w-[180px] text-center text-base text-[#666666]">
                  {notice.created.split("T")[0]}
                </td>
                <td className="flex h-12 w-full items-center justify-between px-2.5 text-base font-bold">
                  {notice.title}
                </td>
                <td className="w-[120px] text-center text-base text-[#666666]">
                  {notice.viewCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 모바일 버전 검색바 */}
        <div className="flex w-full px-5 pb-[33px] pt-5 pc:hidden">
          <div className="flex h-12 min-h-12 w-full items-center justify-between gap-4 rounded-[4px] bg-white px-[10px]">
            <input
              type="text"
              className="h-full w-full text-xs text-black"
              value={searchKeyword || ""}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchNoticeList(1);
                }
              }}
            />
            <img
              src="/assets/images/icons/svg/search.svg"
              alt="Search"
              className="h-5 w-5"
              onClick={() => fetchNoticeList(1)}
            />
          </div>
        </div>

        {/* 모바일 버전 게시판 리스트 */}
        <ul className="flex w-full flex-col bg-white pc:hidden">
          {noticeList.map((notice, index) => (
            <li
              key={index}
              className="flex h-[90px] min-h-[90px] w-full cursor-pointer flex-col justify-between border-b border-solid border-normal p-5"
              onClick={() => handleNoticeClick(notice.num)}
            >
              <h2 className="line-clamp-1 text-base font-bold">
                {notice.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#666666]">
                  {notice.created.split("T")[0]}
                </span>
                <span className="text-xxs text-[#666666]">|</span>
                <span className="text-sm text-[#666666]">
                  조회 {notice.viewCount}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        <div className="w-full pb-5 pt-[17px] pc:pb-[62px] pc:pt-[50px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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

export default Notice;
