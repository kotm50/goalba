import { useEffect, useState } from "react";
import ModalPopup from "../../pages/ModalPopup";
import {
  noticeFindAllList,
  NoticeFindAllListRequest,
  NoticeList,
} from "../../api/notice";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function MainFooterPC() {
  const navigate = useNavigate();

  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState<boolean>(false); // 이용약관 팝업
  const [isPrivacyPopupOpen, setIsPrivacyPopupOpen] = useState<boolean>(false); // 개인정보보호 팝업

  const [noticeList, setNoticeList] = useState<NoticeList[]>([]);

  // 이용약관 버튼 클릭 이벤트
  const handleTermsOfServiceButtonClick = () => {
    setIsTermsPopupOpen(true);
  };

  // 개인정보보호방침 버튼 클릭 이벤트
  const hanlePrivacyPolicyButtonClick = () => {
    setIsPrivacyPopupOpen(true);
  };

  // 회사소개 버튼 클릭 이벤트
  const handleCompanyIntroductionButtonClick = () => {
    window.open("https://ikoreatm.com/", "_blank"); // 새 창 열기
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 공지사항 조회 Request
    const noticeReq: NoticeFindAllListRequest = {
      page: 1,
      size: 3,
      type: "B01", // 공지사항
    };

    // 공지사항 조회 API 호출
    noticeFindAllList(noticeReq).then((response) => {
      if (response?.code === "C000") {
        setNoticeList(response.noticeList); // 공지사항 목록 저장
      }
    });
  }, []);

  return (
    <div className="flex w-full flex-col gap-[37px] bg-white py-[34px]">
      <div className="mx-auto flex w-[1240px] items-center justify-between">
        {/* 회사 정보 */}
        <div className="flex flex-col gap-3">
          <span className="text-base font-semibold leading-[19px]">
            고객센터
          </span>
          <p className="text-[32px] font-semibold leading-[39px]">1644-4223</p>
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-[19px] text-[#666666]">
              운영시간
            </span>
            <span className="text-base leading-[19px]">
              09:00 ~ 18:00 (주말, 공휴일 휴무)
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-[19px] text-[#666666]">
              E-Mail
            </span>
            <span className="text-base leading-[19px]">
              koreatm.help@gmail.com
            </span>
          </div>
        </div>

        {/* 공지 사항 */}
        <div className="flex w-[780px] max-w-[780px] flex-col gap-5">
          <h3 className="text-base font-semibold leading-[19px]">공지사항</h3>
          <div className="flex w-full flex-col gap-2.5">
            {noticeList.map((notice, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between"
                onClick={() => {
                  navigate(`/notice/${notice.num}`, {
                    state: { noticeNum: notice.num }, // 공지사항 번호 전달
                  });
                }}
              >
                <span className="cursor-pointer text-base font-semibold leading-[19px]">
                  {notice.title}
                </span>
                <span className="text-base leading-[19px] text-[#666666]">
                  {notice.created.split("T")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 회사소개, 이용약관, 개인정보취급방침, 이메일무단수집거부 */}
      <div className="flex h-[72px] min-h-[72px] w-full border-y border-solid border-normal py-6">
        <div className="mx-auto flex w-[1240px] max-w-[1240px] items-center gap-10">
          <button
            type="button"
            className="text-sm"
            onClick={handleCompanyIntroductionButtonClick}
          >
            회사소개
          </button>
          <button
            type="button"
            className="text-sm"
            onClick={handleTermsOfServiceButtonClick}
          >
            이용약관
          </button>
          <button
            type="button"
            className="text-sm"
            onClick={hanlePrivacyPolicyButtonClick}
          >
            개인정보취급방침
          </button>
          <button type="button" className="text-sm">
            이메일무단수집거부
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto flex h-[90px] min-h-[90px] w-[1240px] max-w-[1240px] items-center gap-[50px]">
          {/* 로고 이미지 */}
          <h1 className="py-2 text-[32px] text-[#DC143C]">
            <img src={logo} alt="고알바" className="h-[36px]" />
          </h1>

          {/* 회사 정보 */}
          <div className="flex h-full flex-col items-start justify-between">
            <h4 className="text-sm font-semibold leading-[17px]">코리아티엠</h4>
            <div className="flex items-center gap-5">
              <span className="text-sm leading-[17px] text-[#666666]">
                서울특별시 중구 다산로38길 66-47
              </span>
              <span className="text-xxs">|</span>
              <span className="text-sm leading-[17px] text-[#666666]">
                개인정보관리책임자 : 이태준
              </span>
              <span className="text-xxs">|</span>
              <span className="text-sm leading-[17px] text-[#666666]">
                고객센터 : 1644-4223
              </span>
              <span className="text-xxs">|</span>
              <span className="text-sm leading-[17px] text-[#666666]">
                사업자등록번호 : 789-81-02395
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-sm leading-[17px] text-[#666666]">
                통신판매업신고 : 제2022-서울중구-1101호
              </span>
              <span className="text-xxs">|</span>
              <span className="text-sm leading-[17px] text-[#666666]">
                직업소개사업 신고번호 : 제2021-3010165-14-5-0003호 
              </span>
            </div>
            <p className="text-sm leading-[17px] text-[#666666]">
              Copyright ⓒ Recruiting Lab All right reserved
            </p>
          </div>
        </div>
      </div>

      {/* 이용약관 팝업 */}
      {isTermsPopupOpen && (
        <ModalPopup closeModal={() => setIsTermsPopupOpen(false)} isTerms />
      )}

      {/* 개인정보보호 팝업 */}
      {isPrivacyPopupOpen && (
        <ModalPopup closeModal={() => setIsPrivacyPopupOpen(false)} isPrivacy />
      )}
    </div>
  );
}

export default MainFooterPC;
