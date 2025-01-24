import { useEffect, useState } from "react";
import AppBar from "../../components/AppBar";
import Pagination from "../../components/Pagination";
import { useMediaQuery } from "@react-hook/media-query";
import MainHeaderPC from "../../components/MainHeaderPC";
import MainFooterPC from "../../components/MainFooterPC";
import {
  FindOneNotice,
  noticeFindAllList,
  NoticeFindAllListRequest,
  noticeFindFaqCategory,
  NoticeFindFaqCategoryRequest,
  noticeFindOne,
  NoticeList,
} from "../../api/notice";
import ConfirmPopup from "../../components/ConfirmPopup";

const FAQ_CATEGORIES = ["전체", "개인 회원가입", "회원정보 수정", "채용 정보"];

function Faq() {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 검색 키워드

  const [openIndex, setOpenIndex] = useState<number | null>(null); // 현재 열려 있는 index 상태
  const [faqList, setFaqList] = useState<NoticeList[]>([]); // FAQ 리스트
  const [faqDetail, setFaqDetail] = useState<FindOneNotice>(); // FAQ 상세

  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지

  const [faqCategory, setFaqCategory] = useState<string>("전체"); // FAQ 카테고리

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 모달 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 모달 메시지
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 모달 오픈 여부

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 메시지를 \n 기준으로 분리해서 배열로 변환
  const faqContents = faqDetail?.content.split("\n");

  // 검색 버튼 클릭 이벤트
  const handleSearchButtonClick = () => {
    // FAQ 카테고리별 검색 API Request
    const searchReq: NoticeFindFaqCategoryRequest = {
      page: 1,
      size: 10,
      faqCategory: faqCategory === "전체" ? null : faqCategory,
      keyword: searchKeyword,
    };

    // FAQ 카테고리별 검색 API 호출
    noticeFindFaqCategory(searchReq).then((response) => {
      if (response && response.code === "C000") {
        // 응답 성공 시
        setFaqList(response.noticeList);
        setTotalPages(response.totalPages);
      } else {
        // 응답 실패 시
        setConfirmTitle("알림");
        setConfirmMessage("검색 결과가 없습니다.");
        setIsConfirmPopupOpen(true);
      }
    });
  };

  // 검색어 입력 이벤트
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 카테고리 선택 이벤트
  const handleCategorySelect = (category: string) => {
    setFaqCategory(category);
  };

  // FAQ 리스트 토클 이벤트
  const handleFaqToggle = (index: number, faqNum: number) => {
    // FAQ 상세 조회 API 호출
    noticeFindOne(faqNum).then((response) => {
      if (response && response.code === "C000") {
        setFaqDetail(response.findOneNotice);
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
      }
    });
  };

  // FAQ 전체 조회
  const fetchFaqList = async (page: number) => {
    const noticeFindAllListRequest: NoticeFindAllListRequest = {
      page,
      size: 10,
      type: "B02", // FAQ
    };

    // FAQ 전체 조회 API 호출
    noticeFindAllList(noticeFindAllListRequest).then((response) => {
      if (response && response.code === "C000") {
        setFaqList(response.noticeList);
        setTotalPages(response.totalPages);
      }
    });
  };

  // 카테고리별 FAQ 조회
  const fetchFaqCategory = async (page: number) => {
    // 카테고리별 FAQ 조회 API Request
    const req: NoticeFindFaqCategoryRequest = {
      page,
      size: 10,
      faqCategory,
    };

    // 카테고리별 FAQ 조회 API 호출
    noticeFindFaqCategory(req).then((response) => {
      if (response && response.code === "C000") {
        setFaqList(response.noticeList);
        setTotalPages(response.totalPages);
      }
    });
  };

  // 페이지 변경 이벤트
  const handlePageChange = (page: number) => {
    if (page === currentPage) return; // 현재 페이지와 같은 페이지일 경우 무시

    setCurrentPage(page); // 현재 페이지 변경
    if (faqCategory === "전체") {
      fetchFaqList(page);
    } else {
      fetchFaqCategory(page);
    }
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

  // 현재 페이지 변경 시 실행
  useEffect(() => {
    fetchFaqList(currentPage);
  }, [currentPage]);

  // FAQ 카테고리 변경 시 실행
  useEffect(() => {
    setOpenIndex(null); // FAQ 리스트 초기화

    // FAQ 카테고리가 "전체"일 경우 전체 조회
    if (faqCategory === "전체") {
      fetchFaqList(1);
      setSearchKeyword("");
      return;
    }

    fetchFaqCategory(1);
    setSearchKeyword("");
  }, [faqCategory]);

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"자주 묻는 질문"} /> : <MainHeaderPC />}

      <div className="w-full pc:mx-auto pc:max-w-[1240px] pc:px-5 pc:pt-[50px]">
        {/* PC 버전 검색바 */}
        <div className="hidden w-full items-end justify-between pc:flex">
          <div className="flex flex-col gap-5">
            <h2 className="text-[32px] font-semibold">자주 묻는 질문</h2>
            {/* 카테고리 선택 */}
            <div className="flex items-center gap-3">
              {FAQ_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${faqCategory === category ? "bg-gray-300" : "bg-white"} flex h-10 items-center justify-center rounded-md border border-solid border-normal px-3 text-sm`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-12 min-h-12 w-[480px] items-center justify-between bg-white px-2.5">
            <input
              type="text"
              placeholder="궁금한 점을 찾아보세요"
              className="h-full w-full text-base text-black placeholder:text-[#666666]"
              value={searchKeyword || ""}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchButtonClick();
                }
              }}
            />
            <img
              src="/assets/images/icons/svg/search.svg"
              alt="Search"
              className="w-5 min-w-5"
              onClick={handleSearchButtonClick}
            />
          </div>
        </div>

        {/* PC 버전 자주 묻는 질문 리스트 */}
        <table className="mt-[14px] hidden w-full flex-col bg-white pc:block">
          <thead className="h-12 min-h-12 border-y border-solid border-normal">
            <tr>
              <th className="w-[60px] min-w-[60px] text-base font-bold">
                번호
              </th>
              <th className="w-[180px] min-w-[180px] text-base font-bold">
                유형
              </th>
              <th className="w-full text-base font-bold">제목</th>
            </tr>
          </thead>
          <tbody>
            {faqList.map((faq, index) => (
              <>
                <tr
                  key={index}
                  className="h-12 min-h-12 border-b border-solid border-normal"
                >
                  <td className="w-[60px] text-center text-base font-semibold">
                    {index + 1}
                  </td>
                  <td className="w-[180px] text-center text-base text-[#666666]">
                    [{faq.faqCategory}]
                  </td>
                  <td className="flex h-12 w-full items-center justify-between pl-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-extrabold text-[#DC143C]">
                        Q
                      </span>
                      <span className="text-base text-[#666666]">
                        {faq.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="flex h-full w-10 items-center justify-center"
                      onClick={() => {
                        handleFaqToggle(index, faq.num);
                      }}
                    >
                      <img
                        src="/assets/images/icons/svg/down_arrow_bold.svg"
                        alt="Open"
                        className={`${openIndex === index ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </td>
                </tr>
                {openIndex === index && (
                  <tr className="h-[100px] bg-[#D9D9D9]">
                    <td colSpan={1}></td>
                    <td colSpan={1}></td>
                    <td colSpan={1} className="px-8 py-5 text-start">
                      <span className="text-sm text-black">
                        {faqContents?.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </span>
                    </td>
                  </tr>
                )}
              </>
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

        {/* 카테고리 선택 */}
        <div className="mb-3 flex w-full items-center gap-2 px-2 pc:hidden">
          {FAQ_CATEGORIES.map((category, index) => (
            <button
              key={index}
              type="button"
              className={`${faqCategory === category ? "bg-gray-300" : "bg-white"} flex h-8 items-center justify-center rounded-md border border-solid border-normal px-3 text-sm`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 모바일 버전 자주 묻는 질문 리스트 */}
        <div className="flex w-full flex-col bg-white pc:hidden">
          {faqList.map((faq, index) => (
            <div key={index}>
              <div className="flex h-[105px] min-h-[105px] w-full cursor-pointer items-center justify-between gap-9 border-b border-solid border-normal px-5">
                <div className="flex flex-col gap-[14px]">
                  <h2 className="line-clamp-2 text-base font-bold">
                    {faq.title}
                  </h2>
                  <span className="text-sm text-[#666666]">
                    [{faq.faqCategory}]
                  </span>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center"
                  onClick={() => {
                    handleFaqToggle(index, faq.num);
                  }}
                >
                  <img
                    src="/assets/images/icons/svg/down_arrow_bold_short.svg"
                    alt="Open"
                    draggable={false}
                    className={`${openIndex === index ? "rotate-180" : "rotate-0"} h-[10px] w-5 transform transition-transform duration-300`}
                  />
                </button>
              </div>

              {/* 상세 내용 */}
              {openIndex === index && (
                <div className="flex min-h-[57px] w-full flex-col items-start bg-[#D9D9D9] p-5">
                  {/* 각 줄을 <p> 태그로 렌더링 */}
                  {faqContents?.map((line, index) => (
                    <span key={index} className="text-sm">
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

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

      {/* 확인 모달 */}
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

export default Faq;
