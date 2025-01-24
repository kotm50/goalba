interface ConfirmPopupProps {
  title: string;
  message: string;
  onClose: () => void;
  isLogin?: boolean;
}

function ConfirmPopup(props: ConfirmPopupProps) {
  const { title, message, onClose, isLogin } = props;

  // 확인 버튼 클릭 시
  const handlePopupCloseButtonClick = () => {
    onClose();
  };

  // 메시지를 \n 기준으로 분리해서 배열로 변환
  const messageLines = message.split("\n");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* 어두운 배경 Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 팝업 내용 */}
      <div className="relative z-[1001] flex h-auto w-80 flex-col justify-between rounded-[10px] bg-white p-5">
        <div className="flex w-full flex-col gap-5">
          <span className="text-base font-bold text-[#333333]">{title}</span>
          <div className="flex flex-col gap-1">
            {/* 각 줄을 <p> 태그로 렌더링 */}
            {!isLogin &&
              messageLines.map((line, index) => (
                <p key={index} className="text-sm text-[#666666]">
                  {line}
                </p>
              ))}
            {isLogin && (
              <>
                <p className="text-lg font-semibold">{message}</p>
                <p className="text-sm text-[#666666]">
                  회원이 아니시거나 아이디 또는 비밀번호가 일치하지 않습니다.
                </p>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex h-10 min-h-10 w-full items-center justify-center rounded bg-[#0099FF] text-sm text-white"
          onClick={handlePopupCloseButtonClick}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default ConfirmPopup;
