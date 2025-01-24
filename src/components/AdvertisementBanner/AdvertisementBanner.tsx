import { useNavigate } from "react-router-dom";
import { JobSiteList } from "../../api/post";

interface AdvertisementBannerProps {
  jobsite: JobSiteList;
}

function AdvertisementBanner(
  advertisementBannerProps: AdvertisementBannerProps,
) {
  const { jobsite } = advertisementBannerProps;

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
    const aid = jobsite.aid;
    navigate(`/joblist/${aid}`);
  };

  return (
    <div className="w-full cursor-pointer px-[2px]" onClick={handlePostClick}>
      <div className="flex h-40 w-full items-center justify-start gap-7 rounded-2xl bg-banner px-3 py-4">
        {/* 로고 */}
        <div className="flex h-20 min-w-[120px] items-center justify-center rounded-[4px] bg-white">
          <img
            src={`${imgUrl}${jobsite?.logoImg}`}
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>

        {/* 공고 정보 */}
        <div className="flex h-full flex-col items-start justify-between">
          <span className="text-sm text-white">{jobsite?.company}</span>
          <h2 className="line-clamp-2 text-base font-semibold text-white">
            {jobsite?.title}
          </h2>
          <span className="text-xs text-white">
            {jobsite?.sido} {jobsite?.sigungu}
          </span>
          <span className="text-base font-bold text-white">
            {jobsite?.salaryType} {formatSalary(Number(jobsite?.salary))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdvertisementBanner;
