import { useMediaQuery } from "@react-hook/media-query";
import AdvertisementBanner from "../AdvertisementBanner";
import Filter from "../Filter";
import GoldPost from "../GoldPost";
import LightPost from "../LightPost";
import PlatinumPost from "../PlatinumPost";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import {
  formMailAdSearchFocusList,
  formMailAdSearchGradeList,
  JobSiteList,
} from "../../api/post";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";

function MainContent() {
  const location = useLocation();
  const { title, popupMessage } = location.state || {}; // 회원가입 성공 메시지 받아오기
  const navigate = useNavigate();

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업창 열림 여부

  const [platinumList, setPlatinumList] = useState<JobSiteList[]>(); // 플래티넘 채용 공고
  const [platinumTotalPage, setPlatinumTotalPage] = useState<number>(); // 플래티넘 채용 공고 총 페이지 수
  const [currentPlatinumPage, setCurrentPlatinumPage] = useState<number>(1); // 플래티넘 채용 공고 현재 페이지

  const [goldList, setGoldList] = useState<JobSiteList[]>(); // 골드 채용 공고
  const [goldTotalPage, setGoldTotalPage] = useState<number>(); // 골드 채용 공고 총 페이지 수
  const [currentGoldPage, setCurrentGoldPage] = useState<number>(1); // 골드 채용 공고 현재 페이지

  const [lightList, setLightList] = useState<JobSiteList[]>(); // 라이트 채용 공고
  const [lightTotalPage, setLightTotalPage] = useState<number>(); // 라이트 채용 공고 총 페이지 수
  const [currentLightPage, setCurrentLightPage] = useState<number>(1); // 라이트 채용 공고 현재 페이지

  const [focusList, setFocusList] = useState<JobSiteList[]>(); // 광고 배너
  const [focusTotalPage, setFocusTotalPage] = useState<number>(); // 광고 배너 총 페이지 수

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    const platinumReq = { page: 1, size: 6, grade: 1 }; // 플래티넘 채용 공고 조회 Request
    const goldReq = { page: 1, size: 5, grade: 2 }; // 골드 채용 공고 조회 Request
    const lightReq = { page: 1, size: 5, grade: 3 }; // 라이트 채용 공고 조회 Request
    const focusReq = { page: 1, size: 1 }; // 포커스 배너 조회 Request

    // 플래티넘 채용 공고 조회
    formMailAdSearchGradeList(platinumReq).then((response) => {
      if (response?.totalPages) {
        setPlatinumTotalPage(response.totalPages); // 플래티넘 채용 공고 총 페이지 수 설정
      }
    });

    // 골드 채용 공고 조회
    formMailAdSearchGradeList(goldReq).then((response) => {
      if (response?.totalPages) {
        setGoldTotalPage(response.totalPages); // 골드 채용 공고 총 페이지 수 설정
      }
    });

    // 라이트 채용 공고 조회
    formMailAdSearchGradeList(lightReq).then((response) => {
      if (response?.totalPages) {
        setLightTotalPage(response.totalPages); // 라이트 채용 공고 총 페이지 수 설정
      }
    });

    // 포커스 배너 조회
    formMailAdSearchFocusList(focusReq).then((response) => {
      if (response?.jobSiteList) {
        setFocusTotalPage(response.totalPages); // 포커스 배너 총 페이지 수 설정
      }
    });

    // 스크롤 감지를 위한 이벤트 리스너 추가
    const handleScroll = () => {
      // 스크롤 위치가 500 이상이면 맨 위로 가기 버튼 표시
      if (window.scrollY > 500) {
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

  // 플래티넘, 골드, 라이트, 포커스 전체 페이지 수가 변경되면 실행 (슬라이더 렌더링)
  useEffect(() => {
    // 플래티넘 채용 공고 조회
    if (platinumTotalPage) {
      const platinumReq = { page: 1, size: 6 * platinumTotalPage, grade: 1 }; // 플래티넘 채용 공고 조회 Request (페이지당 6개)

      formMailAdSearchGradeList(platinumReq).then((response) => {
        if (response?.jobSiteList) {
          setPlatinumList(response.jobSiteList); // 플래티넘 채용 공고리스트 설정
        }
      });
    }

    // 골드 채용 공고 조회
    if (goldTotalPage) {
      const goldReq = { page: 1, size: 5 * goldTotalPage, grade: 2 }; // 골드 채용 공고 조회 Request (페이지당 5개)

      formMailAdSearchGradeList(goldReq).then((response) => {
        if (response?.jobSiteList) {
          setGoldList(response.jobSiteList); // 골드 채용 공고리스트 설정
        }
      });
    }

    // 라이트 채용 공고 조회
    if (lightTotalPage) {
      const lightReq = { page: 1, size: 5 * lightTotalPage, grade: 3 }; // 라이트 채용 공고 조회 Request (페이지당 5개)

      formMailAdSearchGradeList(lightReq).then((response) => {
        if (response?.jobSiteList) {
          setLightList(response.jobSiteList); // 라이트 채용 공고리스트 설정
        }
      });
    }

    // 포커스 배너 조회
    if (focusTotalPage) {
      const focusReq = { page: 1, size: 1 * focusTotalPage }; // 포커스 배너 조회 Request (페이지당 1개)

      formMailAdSearchFocusList(focusReq).then((response) => {
        if (response?.jobSiteList) {
          setFocusList(response.jobSiteList); // 포커스 배너리스트 설정
        }
      });
    }
  }, [platinumTotalPage, goldTotalPage, lightTotalPage, focusTotalPage]);

  // location state에 popupMessage가 있으면 실행
  useEffect(() => {
    if (popupMessage) {
      setIsConfirmPopupOpen(true); // 확인 팝업창 열림
    }
  }, [popupMessage]);

  return (
    <div className="flex w-full flex-col px-[10px] pt-4 pc:px-0 pc:pt-0">
      {isMobileScreen && <Filter />}

      {/* 플래티넘 채용 공고 */}
      <div className="flex w-full flex-col gap-3 pt-7 pc:gap-5 pc:px-5 pc:pb-10 pc:pt-5">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-sm font-semibold pc:mx-auto pc:w-[1240px] pc:text-lg">
            플래티넘 채용 공고
          </h2>
          {platinumList && platinumList?.length > 0 && (
            <span className="text-sm font-semibold pc:hidden">
              {currentPlatinumPage}/ {platinumTotalPage}
            </span>
          )}
        </div>
        {/* pc */}
        {!isMobileScreen && (
          <div className="w-full">
            <div className="mx-auto grid w-[1240px] grid-cols-4 !grid-rows-4 !gap-5">
              {/* 플래티넘 채용 공고 16개씩 렌더링 */}
              {platinumList
                ?.slice(0, 16)
                .map((item, index) => (
                  <PlatinumPost key={index} jobsite={item} />
                ))}
            </div>
          </div>
        )}

        {/* mobile (슬라이더) */}
        {isMobileScreen && (
          <Slider
            infinite={true}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            adaptiveHeight={true}
            beforeChange={(_, newIndex) => setCurrentPlatinumPage(newIndex + 1)} // 페이지 변경 시 현재 페이지 설정
          >
            {platinumList &&
              Array.from(
                {
                  length: Math.ceil(platinumList.length / 6), // 플래티넘 채용 공고를 6개씩 나눔
                },
                (_, pageIndex) => {
                  const start = pageIndex * 6; // 시작 인덱스
                  const end = start + 6; // 끝 인덱스
                  const chunk = platinumList.slice(start, end); // 6개씩 슬라이스

                  return (
                    <div key={pageIndex} className="h-full w-full px-[2px]">
                      <div className="!grid !grid-cols-2 !gap-3">
                        {chunk.map((item, index) => (
                          <PlatinumPost key={index} jobsite={item} />
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
          </Slider>
        )}
      </div>

      {/* 포커스 배너 (모바일) */}
      {isMobileScreen && (
        <div className="mt-7 w-full">
          <Slider
            infinite={false}
            slidesToShow={1}
            slidesToScroll={1}
            adaptiveHeight={true}
            arrows={false}
          >
            {focusList?.map((item, index) => (
              <AdvertisementBanner key={index} jobsite={item} />
            ))}
          </Slider>
        </div>
      )}

      {/* 골드 채용 공고 */}
      <div className="mt-7 flex w-full flex-col gap-3 pc:mt-0 pc:gap-2.5 pc:bg-white pc:p-5">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-sm font-semibold pc:mx-auto pc:w-[1240px] pc:text-lg">
            골드 채용 공고
          </h2>
          {goldList && goldList.length > 0 && (
            <span className="text-sm font-semibold pc:hidden">
              {currentGoldPage}/ {goldTotalPage}
            </span>
          )}
        </div>
        {/* 골드 채용 공고 (pc) */}
        {isMobileScreen || (
          <div className="w-full bg-white">
            <div className="mx-auto !grid !w-full max-w-[1240px] !grid-cols-5 !grid-rows-3 !flex-col !gap-5">
              {goldList
                ?.slice(0, 15) // 15개씩 렌더링
                .map((item, index) => <GoldPost key={index} jobsite={item} />)}
            </div>
          </div>
        )}

        {/* 골드 채용 공고 (모바일) */}
        {isMobileScreen && (
          <Slider
            infinite={true}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            adaptiveHeight={true}
            beforeChange={(_, newIndex) => {
              setCurrentGoldPage(newIndex + 1); // 페이지 변경 시 현재 페이지 설정
            }}
          >
            {/* 리스트를 5개씩 나눈 배열을 map으로 렌더링 */}
            {goldList &&
              Array.from(
                {
                  length: Math.ceil(goldList.length / 5), // 골드 채용 공고를 5개씩 나눔
                },
                (_, pageIndex) => {
                  const start = pageIndex * 5; // 시작 인덱스
                  const end = start + 5; // 끝 인덱스
                  const chunk = goldList.slice(start, end); // 5개씩 슬라이스

                  return (
                    <div
                      key={pageIndex}
                      className="!flex !w-full !flex-col !gap-2.5"
                    >
                      {chunk.map((item, index) => (
                        <div key={index} className="h-full w-full px-[2px]">
                          <GoldPost jobsite={item} />
                        </div>
                      ))}
                    </div>
                  );
                },
              )}
          </Slider>
        )}
      </div>

      {/* 라이트 채용 공고 */}
      <div className="mt-8 flex w-full flex-col gap-3 pc:mt-0 pc:gap-2.5 pc:p-5">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-sm font-semibold pc:mx-auto pc:w-[1240px] pc:text-lg">
            라이트 채용 공고
          </h2>
          {lightList && lightList.length > 0 && (
            <span className="text-sm font-semibold pc:hidden">
              {currentLightPage}/ {lightTotalPage}
            </span>
          )}
        </div>
        {/* 라이트 채용 공고 (pc) */}
        {isMobileScreen || (
          <div className="w-full">
            <div className="mx-auto !grid !w-full max-w-[1240px] grid-cols-4 !grid-rows-5 !flex-col !gap-5">
              {lightList
                ?.slice(0, 20)
                .map((item, index) => <LightPost key={index} jobsite={item} />)}
            </div>
          </div>
        )}

        {/* 라이트 채용 공고 (모바일) */}
        {isMobileScreen && (
          <Slider
            infinite={true}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            adaptiveHeight={true}
            beforeChange={(_, newIndex) => {
              setCurrentLightPage(newIndex + 1); // 페이지 변경 시 현재 페이지 설정
            }}
          >
            {/* 리스트를 5개씩 나눈 배열을 map으로 렌더링 */}
            {lightList &&
              Array.from(
                {
                  length: Math.ceil(lightList.length / 5), // 라이트 채용 공고를 5개씩 나눔
                },
                (_, pageIndex) => {
                  const start = pageIndex * 5; // 시작 인덱스
                  const end = start + 5; // 끝 인덱스
                  const chunk = lightList.slice(start, end); // 5개씩 슬라이스

                  return (
                    <div
                      key={pageIndex}
                      className="!flex !w-full !flex-col !gap-2.5"
                    >
                      {chunk.map((item, index) => (
                        <div key={index} className="h-full w-full px-[2px]">
                          <LightPost jobsite={item} />
                        </div>
                      ))}
                    </div>
                  );
                },
              )}
          </Slider>
        )}
      </div>

      {/* 확인 팝업창 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={title}
          message={popupMessage}
          onClose={() => {
            setIsConfirmPopupOpen(false);
            navigate(location.pathname, { replace: true }); // 현재 페이지로 이동 (페이지 이동 시 다시 뜨는 것 방지)
          }}
        />
      )}

      {/* 맨 위로 이동 버튼 */}
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

export default MainContent;
