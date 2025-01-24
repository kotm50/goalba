import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  formMailAdSelectByRegionsSort,
  FormMailAdSelectByRegionsSortRequest,
} from "../../api/post";

/* prettier-ignore */
const REGION = [
  "서울", "경기", "인천", "부산", "대구", "대전",
  "경남", "전남", "충남", "광주", "울산", "경북",
  "전북", "충북", "강원", "제주", "세종", "전국"
];

function MainTopPC() {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  const [counts, setCounts] = useState<number[]>(Array(4).fill(0)); // 급구! 마감 임박! 게시글 수

  // 요일 배열
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜 계산 함수 (오늘 날짜부터 4일까지)
  const getDatesWithDays = () => {
    const today = new Date(); // 오늘 날짜
    return Array.from({ length: 4 }, (_, i) => {
      const date = new Date(today); // 새로운 Date 객체 생성
      date.setDate(today.getDate() + i); // 오늘 날짜 + i
      const day = days[date.getDay()]; // 요일 계산
      return { date: date.getDate(), fullDate: date, day }; // 날짜와 요일 반환
    });
  };

  const dates = getDatesWithDays();

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 급구! 게시글 수 조회 Request
    const req: FormMailAdSelectByRegionsSortRequest = {
      page: 1,
      size: 10000,
      adType: "급구",
    };

    // 급구! 게시글 수 조회
    formMailAdSelectByRegionsSort(req).then((response) => {
      const posts = response?.jobSiteList || []; // 게시글 목록
      const newCounts = dates.map(({ fullDate }) => {
        const dateString = new Date(fullDate).toLocaleDateString("ko-KR"); // YYYY-MM-DD 형식으로 변환
        return posts.filter((post) => {
          const postDate = post.endDate
            ? new Date(post.endDate).toLocaleDateString("ko-KR")
            : "";
          return postDate === dateString;
        }).length;
      });
      setCounts(newCounts); // 상태 업데이트
    });
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-center gap-5 bg-white pb-10 pt-8">
        {/* 지역별 */}
        <div className="flex h-[180px] min-h-[180px] w-80 min-w-80 flex-col items-start justify-center gap-2.5 rounded-2xl bg-main p-5">
          <h3 className="text-base font-semibold text-black">지역별</h3>
          <div className="grid grid-cols-6 grid-rows-3 gap-5">
            {REGION.map((region, index) => (
              <button
                key={index}
                type="button"
                className="cursor-pointer whitespace-nowrap text-base text-black"
                onClick={() => navigate(`/region?sido=${region}`)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* 급구! 마감 임박! */}
        <div
          className="flex h-[180px] min-h-[180px] w-80 min-w-80 cursor-pointer flex-col items-center justify-center gap-[30px] rounded-2xl bg-main p-5"
          onClick={() => {
            navigate("/urgent");
          }}
        >
          <h3 className="text-base font-semibold">
            <span className="text-[#DC143C]">급구!</span> 마감 임박!
          </h3>
          <div className="flex h-[90px] w-full items-center justify-between gap-5 px-1">
            {dates.map((item, index) => (
              <div
                key={index}
                className="flex h-full flex-col items-center justify-between"
              >
                <div className="flex flex-col items-center">
                  <h4
                    className={`text-lg font-bold leading-[22px] ${
                      index === 0 ? "text-[#DC143C]" : "text-black"
                    }`}
                  >
                    {item.date}일
                  </h4>
                  <p
                    className={`text-base leading-[19px] ${
                      index === 0 ? "text-[#DC143C]" : "text-black"
                    }`}
                  >
                    ({item.day})
                  </p>
                </div>
                <span
                  className={`text-lg font-bold ${
                    index === 0 ? "text-[#DC143C]" : "text-black"
                  }`}
                >
                  {counts[index]}건
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 단기 알바 */}
        <div
          className="flex size-[180px] cursor-pointer flex-col items-center justify-between rounded-2xl border border-solid border-normal px-5 py-2"
          onClick={() => navigate("/short")}
        >
          <img
            src="/assets/images/short_part.png"
            alt="short_part"
            className="h-[100px] min-h-[100px] w-[100px] min-w-[100px]"
          />
          <div className="flex flex-col items-center gap-1">
            <p className="whitespace-nowrap text-sm leading-[17px] text-black">
              짧고 굵게 일해요!
            </p>
            <h3 className="text-lg font-semibold leading-[22px] text-[#0099FF]">
              단기알바
            </h3>
          </div>
        </div>

        {/* 회원정보 or 로그인 / 회원가입 */}
        {state.isLoggedIn ? (
          <div className="mt-[15px] flex w-full flex-col gap-2.5 rounded-[10px] border border-solid border-normal bg-white p-5 pc:mt-0 pc:gap-5">
            <h2 className="text-sm font-semibold pc:hidden">회원정보</h2>
            <div className="flex w-full flex-col items-center gap-2.5 pc:gap-5">
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  이름
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.userName}
                </span>
              </div>
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  연락처
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.phone}
                </span>
              </div>
              <div className="flex w-full items-center gap-2.5">
                <span className="w-[50px] text-sm pc:w-20 pc:text-base">
                  이메일
                </span>
                <span className="text-sm font-semibold pc:text-base">
                  {user?.email}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex h-9 min-h-9 items-center justify-center rounded bg-[#DC143C] text-sm font-semibold text-white"
              onClick={() => navigate("/edit")}
            >
              개인정보수정
            </button>
          </div>
        ) : (
          <div className="flex h-[180px] min-h-[180px] w-80 min-w-80 flex-col items-center justify-between gap-[15px] rounded-2xl border border-solid border-normal p-5">
            <h3 className="text-base font-semibold text-black">로그인</h3>
            <div className="flex w-full flex-col items-center gap-2.5">
              <div className="flex w-full flex-col gap-2.5">
                <button
                  type="button"
                  className="flex h-9 min-h-9 w-full items-center justify-center gap-2.5 rounded bg-[#FFD700]"
                  onClick={() => navigate("/login")}
                >
                  <img
                    src="/assets/images/icons/svg/login.svg"
                    alt="login"
                    className="size-[18px]"
                  />
                  <span className="text-base font-semibold text-[#666666]">
                    로그인하기
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-9 min-h-9 w-full items-center justify-center gap-2.5 rounded bg-[#DC143C]"
                  onClick={() => navigate("/signup")}
                >
                  <img
                    src="/assets/images/icons/svg/signup.svg"
                    alt="signup"
                    className="h-4 w-[22px]"
                  />
                  <span className="text-base font-semibold text-white">
                    회원가입하기
                  </span>
                </button>
              </div>

              <div className="flex w-full items-center justify-center gap-9">
                <button
                  type="button"
                  className="text-sm font-semibold text-[#999999]"
                  onClick={() => navigate("/help/find/id")}
                >
                  아이디 찾기
                </button>
                <span className="text-xs font-semibold text-[#999999]">|</span>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#999999]"
                  onClick={() => navigate("/help/find/pwd")}
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainTopPC;
