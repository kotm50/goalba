import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface LightPostProps {
  jobsite: JobSiteList;
}

function LightPost(lightPostProps: LightPostProps) {
  const { jobsite } = lightPostProps;

  const navigate = useNavigate();

  // 만원 단위로 변환하는 함수
  const formatSalary = (salary: number): string => {
    if (salary >= 10000) {
      const formatted = (salary / 10000).toFixed(1); // 소수점 첫째 자리까지
      return `${formatted.replace(/\.0$/, "")}만원`; // 소수점 0 제거
    }
    return `${salary}원`; // 10,000 미만일 경우 그대로 표시
  };

  // 공고 클릭 시 이벤트
  const handlePostClick = () => {
    // 공고 상세 페이지로 이동
    const aid = jobsite.aid;
    navigate(`/joblist/${aid}`);
  };

  return (
    <div
      className="flex min-h-20 w-full cursor-pointer flex-col items-start justify-between rounded-[10px] bg-white px-2.5 py-[9px] drop-shadow-post pc:h-[132px] pc:min-h-[132px] pc:rounded-2xl pc:border pc:border-solid pc:border-normal pc:py-5"
      onClick={handlePostClick}
    >
      <span className="text-xs pc:text-sm pc:leading-[17px]">
        {jobsite?.company}
      </span>
      <h2 className="line-clamp-1 text-sm font-semibold pc:line-clamp-2 pc:text-base pc:leading-[19px]">
        {jobsite?.title}
      </h2>
      <div className="flex items-center gap-2">
        <span className="text-xxs pc:text-sm pc:leading-[17px]">
          {jobsite?.sido} {jobsite?.sigungu}
        </span>
        <span className="text-xs pc:text-sm pc:leading-[17px]">
          <span className="font-semibold text-[#DC143C]">
            {jobsite?.salaryType}
          </span>{" "}
          {formatSalary(Number(jobsite?.salary))}
        </span>
      </div>
    </div>
  );
}

export default LightPost;
