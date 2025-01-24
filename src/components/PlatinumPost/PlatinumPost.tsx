import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface PlatinumPostProps {
  aid?: string;
  jobsite?: JobSiteList;
}

function PlatinumPost(platinumPostProps: PlatinumPostProps) {
  const { jobsite } = platinumPostProps;

  const navigate = useNavigate();
  const imgUrl = import.meta.env.VITE_IMG_URL;

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
    const aid = jobsite?.aid;
    navigate(`/joblist/${aid}`);
  };

  return (
    <div
      className="flex h-full w-full cursor-pointer flex-col items-start justify-between gap-[10.5px] rounded-3xl bg-white px-[10px] py-5 shadow-sm drop-shadow-post pc:gap-2.5"
      onClick={handlePostClick}
    >
      <div className="flex h-10 min-h-10 w-full justify-center pc:h-16 pc:min-h-16">
        <img
          src={`${imgUrl}${jobsite?.logoImg}`}
          alt="Logo"
          className="h-full"
        />
      </div>
      <span className="text-xs leading-[15px] pc:text-sm pc:leading-[17px]">
        {jobsite?.company}
      </span>
      <h3 className="line-clamp-2 text-sm font-semibold leading-[17px] pc:text-lg pc:leading-[22px]">
        {jobsite?.title}
      </h3>
      <span className="text-xxs leading-3 pc:text-sm pc:leading-[17px]">
        {jobsite?.sido} {jobsite?.sigungu}
      </span>
      <span className="whitespace-nowrap text-sm pc:text-lg">
        <span className="font-semibold leading-[17px] text-[#DC143C] pc:leading-[22px]">
          {jobsite?.salaryType}&nbsp;
        </span>
        {formatSalary(Number(jobsite?.salary))}
      </span>
    </div>
  );
}

export default PlatinumPost;
