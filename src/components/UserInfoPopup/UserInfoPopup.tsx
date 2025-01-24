import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface UserInfoPopupProps {
  onClose: () => void;
}

function UserInfoPopup(props: UserInfoPopupProps) {
  const { onClose } = props;
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 어두운 배경 Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* 팝업 내용 */}
      <div className="relative mt-[15px] flex w-full max-w-[340px] flex-col gap-2.5 rounded-[10px] bg-white p-5 pc:mt-0 pc:gap-5">
        <h2 className="text-sm font-semibold pc:hidden">회원정보</h2>
        <div className="flex w-full flex-col items-center gap-2.5 pc:gap-5">
          <div className="flex w-full items-center gap-2.5">
            <span className="w-[50px] text-sm pc:w-20 pc:text-base">이름</span>
            <span className="text-sm font-semibold pc:text-base">
              {user?.userName}
            </span>
          </div>
          <div className="flex w-full items-center gap-2.5">
            <span className="w-[50px] text-sm pc:w-20 pc:text-base">
              연락처
            </span>
            <span className="text-sm font-semibold pc:text-base">
              {user?.phone}
            </span>
          </div>
          <div className="flex w-full items-center gap-2.5">
            <span className="w-[50px] text-sm pc:w-20 pc:text-base">
              이메일
            </span>
            <span className="text-sm font-semibold pc:text-base">
              {user?.email}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="flex h-9 min-h-9 items-center justify-center rounded bg-[#DC143C] text-sm font-semibold text-white"
          onClick={() => navigate("/edit")}
        >
          개인정보수정
        </button>
      </div>
    </div>
  );
}

export default UserInfoPopup;
