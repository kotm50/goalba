import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface JobListPCProps {
  jobPost?: JobSiteList;
}

function JobListPC(props: JobListPCProps) {
  const navigate = useNavigate();
  const { jobPost } = props;

  const imgUrl = import.meta.env.VITE_IMG_URL; // 이미지 URL 접두어

  // 만원 단위로 변환하는 함수 (ex. 10000 -> 1만원, 7000 -> 7000원)
  const formatSalary = (salary: number): string => {
    if (salary >= 10000) {
      const formatted = (salary / 10000).toFixed(1); // 소수점 첫째 자리까지
      return `${formatted.replace(/\.0$/, "")}만원`; // 소수점 0 제거
    }
    return `${salary}원`; // 10,000 미만일 경우 그대로 표시
  };

  // 클릭 시 상세 페이지로 이동
  const handleClick = () => {
    navigate(`/joblist/${jobPost?.aid}`);
  };

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border border-solid border-normal bg-white p-5"
      onClick={handleClick}
    >
      <img
        src={`${imgUrl}${jobPost?.logoImg}`}
        alt="Company Logo"
        className="h-10 w-[100px] object-contain"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-[17px] text-[#666666]">
          {jobPost?.company}
        </p>
        <h3 className="line-clamp-1 text-lg font-semibold leading-[22px]">
          {jobPost?.title}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-sm leading-[17px] text-[#666666]">
            {jobPost?.sido} {jobPost?.sigungu}
          </span>
          <span className="text-sm leading-[17px] text-[#666666]">|</span>
          <span className="text-sm font-bold leading-[17px] text-[#DC143C]">
            {jobPost?.salaryType}
          </span>
          <span className="text-sm leading-[17px]">
            {formatSalary(Number(jobPost?.salary))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobListPC;
