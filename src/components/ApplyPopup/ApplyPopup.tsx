import { useEffect, useState } from "react";

interface ApplyPopupProps {
  onClose: () => void;
  link?: string;
  applyMethod?: string;
}

function ApplyPopup(props: ApplyPopupProps) {
  const { onClose, link, applyMethod } = props;

  const [applyMethods, setApplyMethods] = useState<string[]>([]); // 지원 방법

  // 팝업 닫기 버튼 클릭 이벤트
  const handleCloseClick = () => {
    onClose();
  };

  // applyMethod가 변경될 때마다 실행
  useEffect(() => {
    if (applyMethod) {
      setApplyMethods(applyMethod.split(","));
    }
  }, [applyMethod]);

  return (
    <>
      {/* 배경 어둡게 */}
      <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50"></div>

      {/* 팝업 */}
      <div className="fixed bottom-0 left-0 z-[1001] flex w-full flex-col items-center rounded-t-[10px] bg-white px-5 pb-6 pt-[18px] pc:left-1/2 pc:max-w-[600px] pc:-translate-x-1/2 pc:transform">
        <button
          type="button"
          className="absolute right-5 top-[18px]"
          onClick={handleCloseClick}
        >
          <img
            src="/assets/images/icons/svg/apply_close.svg"
            alt="Close"
            className="h-7 w-7"
          />
        </button>
        <div className="flex h-full w-full flex-col items-center justify-between">
          <h2 className="mb-[14px] text-base font-semibold">지원하기</h2>
          <div
            className={`${
              applyMethods.length === 1
                ? "flex items-center justify-center" // 1개일 때 중앙 정렬
                : "grid grid-cols-2 gap-2.5"
            } w-full border-t border-solid border-normal pt-[9px]`}
          >
            {applyMethods.map((method, index) => (
              <button
                key={index}
                type="button"
                className="flex h-12 min-h-12 flex-1 items-center justify-center border border-solid border-normal bg-[#FFFFCC] text-base font-semibold"
                onClick={() => {
                  if (method === "기업바로지원") {
                    window.open(link, "_blank");
                  }
                }}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyPopup;
