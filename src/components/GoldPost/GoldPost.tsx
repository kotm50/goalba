import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface GoldPostProps {
  aid?: string;
  jobsite?: JobSiteList;
}

function GoldPost(goldPostProps: GoldPostProps) {
  const { jobsite } = goldPostProps;

  const navigate = useNavigate();
  const imgUrl = import.meta.env.VITE_IMG_URL; // 이미지 URL 접두어

  // 만원 단위로 변환하는 함수 (ex. 10000 -> 1만원, 7000 -> 7000원)
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
      className="flex h-[120px] min-h-[120px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white p-2.5 drop-shadow-post pc:h-[222px] pc:min-h-[222px] pc:flex-col pc:gap-2.5 pc:rounded-3xl pc:border pc:border-solid pc:border-normal pc:px-2.5 pc:py-5"
      onClick={handlePostClick}
    >
      <div className="flex min-w-[100px] max-w-[100px] items-center justify-center">
        <img
          src={`${imgUrl}${jobsite?.logoImg}`}
          alt="Logo"
          className="w-full object-contain pc:h-12 pc:min-h-12"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start justify-between">
        <span className="text-xs pc:text-sm pc:leading-[17px]">
          {jobsite?.company}
        </span>
        <h2 className="line-clamp-2 text-sm font-semibold pc:text-base pc:leading-[19px]">
          {jobsite?.title}
        </h2>
        <div className="flex items-center gap-2 pc:flex-col pc:items-start pc:gap-2.5">
          <span className="text-xxs pc:text-sm pc:leading-[17px]">
            {jobsite?.sido} {jobsite?.sigungu}
          </span>
          <span className="text-xs pc:text-lg">
            <span className="font-semibold text-[#DC143C]">
              {jobsite?.salaryType}
            </span>{" "}
            {formatSalary(Number(jobsite?.salary))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoldPost;
