import { jobsiteCommonReissuAccessToken } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

interface ExpirationModalProps {
  onClose: () => void;
}

function ExpirationFiveMinuteModal(props: ExpirationModalProps) {
  const { onClose } = props;
  const { dispatch } = useAuth();

  // 재로그인 버튼 클릭 이벤트
  const handleReLoginButtonClick = () => {
    jobsiteCommonReissuAccessToken().then((response) => {
      if (response?.code === "C000") {
        onClose();
        dispatch({ type: "RESET_FIVE_MINUTE_MODAL" }); // 5분 모달 초기화
      } else {
        // 토큰 재발급 실패 시 로그인 페이지로 이동
        onClose();
        window.location.href = "/login";
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* 어두운 배경 Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 팝업 내용 */}
      <div className="relative z-[1001] flex h-auto w-80 flex-col justify-between rounded-[10px] bg-white p-5">
        <div className="flex w-full flex-col gap-5">
          <span className="text-base font-bold text-[#333333]">알림</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm">로그인 만료까지 5분 남았습니다.</p>
            <p className="text-sm">로그인 연장하시겠습니까?</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-[5px]">
          <button
            type="button"
            className="mt-4 flex h-10 min-h-10 flex-1 items-center justify-center rounded bg-[#0099FF] px-2 text-sm text-white"
            onClick={handleReLoginButtonClick}
          >
            연장하기
          </button>
          <button
            type="button"
            className="mt-4 flex h-10 min-h-10 flex-1 items-center justify-center rounded bg-[#cccccc] px-2 text-sm text-[#333333]"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpirationFiveMinuteModal;
