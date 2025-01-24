import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface JobPostProps {
  jobPost?: JobSiteList;
}

function JobPost(props: JobPostProps) {
  const { jobPost } = props;

  const navigate = useNavigate();

  const imgUrl = import.meta.env.VITE_IMG_URL;

  // 만원 단위로 변환하는 함수 (ex. 10000 -> 1만원, 7000 -> 7000원)
  const formatSalary = (salary: number): string => {
    if (salary >= 10000) {
      const formatted = (salary / 10000).toFixed(1); // 소수점 첫째 자리까지
      return `${formatted.replace(/\.0$/, "")}만원`; // 소수점 0 제거
    }
    return `${salary}원`; // 10,000 미만일 경우 그대로 표시
  };

  // 날짜를 MM/DD 형식으로 변환
  function formatDateToMMDD(dateString: string): string {
    const [_year, month, day] = dateString.split("-");
    return `${month}/${day}`; // MM/DD 형식으로 반환
  }

  // 연속된 요일을 포맷팅하는 함수 (ex. "월요일, 화요일, 수요일" -> "월 ~ 수요일")
  const formatWorkDays = (workDays: string | null): string => {
    // 숫자를 요일로 매핑하는 배열
    const daysMap = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];

    // null 값 처리
    if (!workDays) {
      return "요일협의";
    }

    // workDays를 숫자 배열로 분리하고 요일 배열로 변환
    const dayList = workDays
      .split(",")
      .map((day) => daysMap[Number(day.trim())]);

    // 연속된 요일인지 확인
    const isConsecutive = dayList.every((day, idx, arr) => {
      if (idx === 0) return true;
      const prevIndex = daysMap.indexOf(arr[idx - 1]);
      const currentIndex = daysMap.indexOf(day);
      return currentIndex === (prevIndex + 1) % 7; // 일요일(0)에서 월요일(1) 순환 처리
    });

    // 연속된 경우 "시작요일 ~ 끝요일" 형식으로 반환
    if (isConsecutive && dayList.length > 1) {
      return `${dayList[0]} ~ ${dayList[dayList.length - 1]}`;
    }

    // 불연속적인 요일 처리
    const formattedDays = dayList.map((day, idx, arr) => {
      if (idx === arr.length - 1) {
        return day; // 마지막 요일은 그대로 반환
      }
      return day.replace("요일", ""); // 중간 요일에서는 "요일" 제거
    });

    return formattedDays.join(", ");
  };

  // 클릭 시 상세 페이지로 이동
  const handleClick = () => {
    navigate(`/joblist/${jobPost?.aid}`);
  };

  return (
    <div
      className="flex h-[228px] w-full cursor-pointer flex-col justify-center gap-3 rounded-[10px] bg-white px-[10px] py-5"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-[60px] w-[100px] min-w-[100px] items-center justify-center overflow-hidden rounded border border-solid border-light">
          <img
            src={`${imgUrl}${jobPost?.logoImg}`}
            alt="Logo"
            className="w-full"
          />
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex w-full items-center justify-between">
            <span className="line-clamp-1 text-xs">{jobPost?.company}</span>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center"
            >
              <img
                src="/assets/images/icons/svg/star_empty.svg"
                alt="Star Empty"
                className="w-5"
              />
            </button>
          </div>
          <h2 className="line-clamp-2 text-sm font-semibold">
            {jobPost?.title}
          </h2>
        </div>
      </div>
      <div className="flex h-4 max-h-4 min-h-4 w-full items-center gap-[5px] overflow-hidden">
        {/* endDate가 3일 이하로 남았을 경우 급구 및 마감 추가 */}
        {jobPost?.endDate &&
          (() => {
            const today = new Date();
            const deadline = new Date(jobPost.endDate);
            const daysRemaining = Math.ceil(
              (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );

            return (
              <>
                {daysRemaining <= 3 && (
                  <>
                    <div className="flex h-4 max-h-4 items-center justify-center whitespace-nowrap rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]">
                      급구
                    </div>
                    <div className="flex h-4 max-h-4 items-center justify-center whitespace-nowrap rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]">
                      마감임박
                    </div>
                  </>
                )}
              </>
            );
          })()}
        {jobPost?.etcConditions &&
          jobPost?.etcConditions?.split(",").map((condition, index) => (
            <div
              key={index}
              className="h-4 max-h-4 whitespace-nowrap rounded-[5px] bg-[#BBDDFF] px-2 text-xxs text-[#006699]"
            >
              {condition.trim().includes("친구와 함께")
                ? "친구와 함께"
                : condition.trim()}
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <img
            src="/assets/images/icons/svg/location.svg"
            alt="Location"
            className="w-2"
          />
          <span className="text-xxs text-[#666666]">
            {jobPost?.sido} {jobPost?.sigungu} {jobPost?.dongEubMyun}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <img
            src="/assets/images/icons/svg/time.svg"
            alt="Time"
            className="w-2"
          />
          <span className="text-xxs text-[#666666]">
            {jobPost?.workDays ? formatWorkDays(jobPost.workDays) : "요일협의"}
          </span>
        </div>
      </div>
      <div className="flex min-h-10 w-full items-center justify-between">
        <div className="flex flex-col gap-[6px]">
          <span className="text-base">
            <span className="font-semibold text-[#DC143C]">
              {jobPost?.salaryType}
            </span>{" "}
            {formatSalary(Number(jobPost?.salary))}
          </span>
          <span className="text-xs font-bold text-[#0099FF]">
            {jobPost?.endDate
              ? `${formatDateToMMDD(jobPost.endDate)} 까지 채용`
              : "상시채용"}
          </span>
        </div>
        <button
          type="button"
          className="flex h-full w-[97px] items-center justify-center gap-2.5 rounded-full border border-solid border-normal"
        >
          <img
            src="/assets/images/icons/svg/apply.svg"
            alt="Apply"
            className="w-[21px]"
          />
          <span className="text-sm">지원</span>
        </button>
      </div>
    </div>
  );
}

export default JobPost;
