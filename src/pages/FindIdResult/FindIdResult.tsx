import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import TopBarPC from "../../components/TopBarPC";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JobsiteUser } from "../../api/user";

interface LocationState {
  userName: string;
  jobsiteUserList: JobsiteUser[];
  totalCount: number;
}

function FindIdResult() {
  const location = useLocation();
  const { userName, jobsiteUserList, totalCount } =
    (location.state as LocationState) || {}; // 이전 페이지에서 넘어온 데이터
  const navigate = useNavigate();

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [isInformationOpen, setIsInformationOpen] = useState<boolean>(false); // 회사정보 오픈 여부

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"아이디 찾기"} /> : <TopBarPC />}

      <div className="flex w-full flex-col gap-[50px] px-[10px] pt-8 pc:mx-auto pc:w-[600px] pc:gap-10 pc:px-0 pc:pt-[137px]">
        {/* 가입정보와 일치하는 아이디 */}
        <div className="w-full">
          <span className="text-lg font-medium">
            가입정보와 일치하는 아이디가 {totalCount}개 있습니다.
          </span>
        </div>
        {/* PC 버전 타이틀 */}
        <div className="hidden flex-col gap-[22px] pc:flex">
          <h2 className="text-[32px] font-semibold">아이디 찾기 결과</h2>
          <hr className="border-t border-solid border-normal" />
        </div>

        {/* PC 버전 찾은 아이디 정보 */}
        {jobsiteUserList && jobsiteUserList.length > 0 && (
          <div className="hidden w-full flex-col gap-5 pc:flex">
            {jobsiteUserList.map((user, index) => (
              <div
                key={index}
                className="hidden w-full flex-col items-start gap-5 bg-white p-5 pc:flex"
              >
                <div className="flex items-center gap-5">
                  <span className="w-[120px] text-base font-bold leading-[19px] text-[#666666]">
                    아이디
                  </span>
                  <span className="text-base font-bold leading-[19px] text-[#DC143C]">
                    {user.userId}
                  </span>
                </div>

                <hr className="w-full border-t border-solid border-normal" />

                <div className="flex items-center gap-5">
                  <span className="w-[120px] text-base font-bold leading-[19px] text-[#666666]">
                    가입일
                  </span>
                  <span className="text-base font-bold leading-[19px]">
                    {user.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 모바일 버전 찾은 아이디 정보 */}
        {jobsiteUserList && jobsiteUserList.length > 0 && (
          <div className="flex h-[88px] min-h-[88px] w-full flex-col items-center justify-center gap-2.5 bg-white pc:hidden">
            <span className="text-base font-bold">{userName}님의 아이디는</span>
            <span className="text-base">
              <span className="break-all font-bold text-[#DC143C]">
                {jobsiteUserList.map((user) => user.userId).join(", ")}
              </span>
              입니다
            </span>
          </div>
        )}

        {/* 로그인 하기 / 비밀번호 찾기 */}
        <div className="flex w-full flex-col gap-2.5">
          <button
            type="button"
            className="flex h-[35px] min-h-[35px] w-full items-center justify-center rounded bg-[#DC143C] text-base font-semibold text-white"
            onClick={() => navigate("/login")}
          >
            로그인 하기
          </button>
          <button
            type="button"
            className="flex h-[35px] min-h-[35px] w-full items-center justify-center rounded bg-[#0099FF] text-base font-semibold text-white"
            onClick={() => navigate("/help/find/pwd")}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      {/* 코리아티엠 정보 */}
      <div className="fixed bottom-24 left-1/2 hidden w-full -translate-x-1/2 transform flex-col items-center gap-5 pc:flex">
        <div
          className="flex cursor-pointer items-center justify-center gap-[11px]"
          onClick={() => setIsInformationOpen(!isInformationOpen)}
        >
          <span className="text-sm text-[#333333]">ⓒ Recruiting Lab</span>
          <img
            src="/assets/images/icons/svg/down_arrow_light.svg"
            alt="Open"
            className={`${isInformationOpen ? "rotate-180" : "rotate-0"} w-3 cursor-pointer`}
          />
        </div>

        {isInformationOpen && (
          <h4 className="absolute top-6 text-center text-xxs text-[#333333]">
            서울특별시 중구 다산로38길 66-47
            <br />
            개인정보관리책임자 : 이태준 | 고객센터 : 1644-4223
            <br />
            사업자등록번호 : 789-81-02395
            <br />
            통신판매업신고 : 제2022-서울중구-1101호
            <br />
            직업소개사업 신고번호 : 제2021-3010165-14-5-0003호 
          </h4>
        )}
      </div>
    </div>
  );
}

export default FindIdResult;
