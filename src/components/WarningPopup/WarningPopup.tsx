import { useNavigate } from "react-router-dom";

interface WarningPopupProps {
  message: string;
  modalClose: () => void;
}

function WarningPopup(warningPopupProps: WarningPopupProps) {
  const { message, modalClose } = warningPopupProps;

  const navigate = useNavigate();

  // 경고창 확인 버튼 클릭 시 이벤트
  const handleConfirmClick = () => {
    modalClose(); // 경고
    navigate("/"); // 메인화면으로 이동
  };

  // 경고창 취소 버튼 클릭 시 이벤트
  const handleCancelClick = () => {
    modalClose(); // 경고창 닫힘
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 어두운 배경 Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 모달 팝업 */}
      <div className="relative z-10 flex h-[180px] w-80 flex-col justify-between rounded-[10px] bg-white p-5">
        <span className="text-base font-bold text-[#333333]">경고창</span>
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html:
              message ||
              "확인을 누르면 메인화면으로 이동합니다<br>취소를 누르면 창이 닫힙니다",
          }}
        />
        <div className="flex w-full items-center gap-[5px]">
          <button
            type="button"
            className="h-10 min-h-10 flex-1 rounded bg-[#0099FF] text-sm text-white"
            onClick={handleConfirmClick}
          >
            확인
          </button>
          <button
            type="button"
            className="h-10 min-h-10 flex-1 rounded bg-[#CCCCCC] text-sm text-[#333333]"
            onClick={handleCancelClick}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningPopup;
