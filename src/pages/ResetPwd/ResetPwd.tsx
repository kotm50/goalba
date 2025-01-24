import { useMediaQuery } from "@react-hook/media-query";
import AppBar from "../../components/AppBar";
import TopBarPC from "../../components/TopBarPC";
import { useState } from "react";
import {
  jobsiteUserUpdatePwd,
  JobsiteUserUpdatePwdRequest,
} from "../../api/user";
import { useLocation } from "react-router-dom";
import ConfirmPopup from "../../components/ConfirmPopup";

function ResetPwd() {
  const location = useLocation();
  const { userName, userId, phone, email, isPhoneAuth } = location.state || {}; // 이전 페이지에서 전달받은 데이터

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  // const [isInformationOpen, setIsInformationOpen] = useState<boolean>(false);

  const [userPwd, setUserPwd] = useState<string>(""); // 비밀번호
  const [userPwdCheck, setUserPwdCheck] = useState<string>(""); // 비밀번호 확인
  const [pwdError, setPwdError] = useState<string>(""); // 비밀번호 에러 메시지
  const [pwdConfirmError, setPwdConfirmError] = useState<string>(""); // 비밀번호 확인 에러 메시지

  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 여부
  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지

  // 비밀번호 입력 이벤트
  const handleUserPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = e.target.value;

    if (inputPassword.length > 15) return;

    setUserPwd(inputPassword);

    const error = validatePassword(inputPassword);
    setPwdError(error);

    // 비밀번호 확인 입력 필드가 비어있을 경우 메시지 설정
    if (!userPwdCheck) {
      setPwdConfirmError("비밀번호를 다시 한번 입력해주세요.");
    } else if (inputPassword !== userPwdCheck) {
      setPwdConfirmError("비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
    } else {
      setPwdConfirmError("");
    }
  };

  // 비밀번호 확인 입력 이벤트
  const handleUserPwdCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPasswordConfirm = e.target.value;

    setUserPwdCheck(inputPasswordConfirm);

    if (!inputPasswordConfirm) {
      setPwdConfirmError("비밀번호를 다시 한번 입력해주세요.");
    } else if (userPwd && inputPasswordConfirm !== userPwd) {
      setPwdConfirmError("비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
    } else {
      setPwdConfirmError("");
    }
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string => {
    if (password.length < 8) return "8자리 이상 입력해 주세요.";
    if (password.length > 15) return "비밀번호는 최대 15자까지 가능합니다.";

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

    if (!regex.test(password)) {
      return "영문, 숫자, 특수문자를 조합하여 입력해 주세요.";
    }

    return ""; // 유효하면 에러 메시지 없음
  };

  // 비밀번호 재설정 버튼 클릭 이벤트
  const handleResetPwdButtonClick = () => {
    // 비밀번호 유효성 검사
    const passwordError = validatePassword(userPwd);
    if (passwordError) {
      setConfirmTitle("알림");
      setConfirmMessage("비밀번호 형식을 다시 확인해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 비밀번호 입력 되지 않았을 경우
    if (!userPwd) {
      setConfirmTitle("알림");
      setConfirmMessage("비밀번호를 입력해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 비밀번호 확인 입력 되지 않았을 경우
    if (!userPwdCheck) {
      setConfirmTitle("알림");
      setConfirmMessage("비밀번호 확인을 입력해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 비밀번호 확인
    if (userPwd !== userPwdCheck) {
      setConfirmTitle("알림");
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
      setIsConfirmPopupOpen(true);
      return;
    }

    const jobsiteUserUpdatePwdRequest: JobsiteUserUpdatePwdRequest = {
      userPwd,
      userId,
      phone: isPhoneAuth ? phone : undefined,
      email: !isPhoneAuth ? email : undefined,
      userName,
    };

    // 비밀번호 변경 API 호출
    jobsiteUserUpdatePwd(jobsiteUserUpdatePwdRequest).then((response) => {
      if (response && response.code === "C000") {
        setConfirmTitle("비밀번호 재설정 완료");
        setConfirmMessage("비밀번호가 재설정되었습니다.");
        setIsConfirmPopupOpen(true);
      } else {
        setConfirmTitle("알림");
        setConfirmMessage("비밀번호 재설정에 실패했습니다.");
        setIsConfirmPopupOpen(true);
      }
    });
  };

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"비밀번호 재설정"} /> : <TopBarPC />}

      <div className="flex w-full flex-col px-[10px] pt-[35px] pc:mx-auto pc:w-[600px] pc:gap-10 pc:px-0 pc:pt-[137px]">
        {/* PC 버전 타이틀 */}
        <div className="hidden flex-col gap-[22px] pc:flex">
          <h2 className="text-[32px] font-semibold">비밀번호 재설정</h2>
          <hr className="border-t border-solid border-normal" />
        </div>

        <div className="flex w-full flex-col pc:gap-10">
          <div className="flex w-full flex-col gap-5 pc:gap-10">
            <div className="flex w-full flex-col gap-2.5 pc:gap-10">
              {/* 비밀번호 입력 */}
              <div className="flex w-full flex-col items-start gap-[6px]">
                <h2 className="text-sm">비밀번호 입력</h2>
                <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="password"
                    className="h-full w-full bg-white px-[10px] text-sm placeholder:text-[#666666]"
                    value={userPwd || ""}
                    onChange={handleUserPwdChange}
                  />
                </div>
                {pwdError && (
                  <span className="text-xs text-[#DC143C]">{pwdError}</span>
                )}
              </div>
              {/* 비밀번호 재입력 */}
              <div className="flex w-full flex-col items-start gap-[6px]">
                <h2 className="text-sm">비밀번호 재입력</h2>
                <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="password"
                    className="h-full w-full bg-white px-[10px] text-sm placeholder:text-[#666666]"
                    value={userPwdCheck || ""}
                    onChange={handleUserPwdCheckChange}
                  />
                </div>
                {pwdConfirmError && (
                  <span className="text-xs text-[#DC143C]">
                    {pwdConfirmError}
                  </span>
                )}
              </div>
            </div>

            {/* 비밀번호 재설정 버튼 */}
            <button
              type="button"
              className="flex h-[35px] min-h-[35px] w-full items-center justify-center rounded bg-[#DC143C] text-lg font-semibold text-white pc:text-base"
              onClick={handleResetPwdButtonClick}
            >
              비밀번호 재설정
            </button>
          </div>

          <div className="mt-[30px] flex w-full flex-col gap-[19px] pc:mt-0 pc:gap-10">
            <h3 className="px-2 text-base font-semibold">
              안전한 비밀번호 사용 방법
            </h3>
            <div className="flex w-full flex-col gap-3 px-2">
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold leading-4">ㆍ</span>
                <span className="text-xs text-[#666666]">
                  영문, 숫자, 특수기호를 조합해서 8~16자로 작성 (2가지 조합 작성
                  시 10~16자, 띄어쓰기 불가능)
                </span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold leading-4">ㆍ</span>
                <span className="text-xs text-[#666666]">
                  아이디가 포함되거나, 생일 등 개인정보를 포함하는 비밀번호는
                  권장하지 않음
                </span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold leading-4">ㆍ</span>
                <span className="text-xs text-[#666666]">
                  연속된 영문/숫자나 키보드의 연속패턴은 권장하지 않음
                  <br />
                  (예시 : aaaa, abcd, 1234, asdf 등)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => {
            setIsConfirmPopupOpen(false);
            setUserPwd("");
            setUserPwdCheck("");
            if (confirmMessage === "비밀번호가 재설정되었습니다.") {
              window.location.href = "/login";
            } else if (confirmMessage === "로그인이 필요한 서비스입니다.") {
              window.location.href = "/login";
            }
          }}
        />
      )}
    </div>
  );
}

export default ResetPwd;
