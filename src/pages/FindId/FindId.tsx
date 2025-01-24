import { useState } from "react";
import AppBar from "../../components/AppBar";
import { useMediaQuery } from "@react-hook/media-query";
import TopBarPC from "../../components/TopBarPC";
import {
  commonSendEmail,
  formMailCertSms,
  jobsiteUserCert,
  jobsiteUserCertEmail,
  JobsiteUserCertEmailRequest,
  JobsiteUserCertRequest,
} from "../../api/auth";
import {
  jobsiteUserFindId,
  jobsiteUserFindIdBeforeCert,
  JobsiteUserFindIdBeforeCertRequest,
  JobsiteUserFindIdRequest,
} from "../../api/user";
import ConfirmPopup from "../../components/ConfirmPopup";
import { useNavigate } from "react-router-dom";

function FindId() {
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const [userName, setUserName] = useState<string>(""); // 이름
  const [phone, setPhone] = useState<string>(""); // 휴대폰 번호
  const [email, setEmail] = useState<string>(""); // 이메일
  const [smsCode, setSmsCode] = useState<string>(""); // 휴대폰 인증번호
  const [emailCode, setEmailCode] = useState<string>(""); // 이메일 인증번호

  const [isInformationOpen, setIsInformationOpen] = useState<boolean>(false); // 회사정보 오픈 여부
  const [isPhoneAuth, setIsPhoneAuth] = useState<boolean>(true); // 휴대폰 인증 / 이메일 인증 선택
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증번호 전송 여부
  const [isAuthSuccess, setIsAuthSuccess] = useState<boolean>(false); // 인증 성공 여부

  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 여부
  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지

  // 휴대폰 인증 / 이메일 인증 선택 이벤트
  const handleIsPhoneAuthSelect = (isPhoneAuth: boolean) => {
    setIsPhoneAuth(isPhoneAuth);
  };

  // 이름 입력 이벤트
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  // 휴대폰 / 이메일 입력 이벤트
  const handlePhoneOrEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhoneAuth) {
      setPhone(e.target.value);
    } else {
      setEmail(e.target.value);
    }
  };

  // 인증번호 입력 이벤트
  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhoneAuth) {
      // 휴대폰 인증번호
      setSmsCode(e.target.value);
    } else {
      // 이메일 인증번호
      setEmailCode(e.target.value);
    }
  };

  // 인증하기 버튼 클릭 이벤트
  const handleAuthButtonClick = () => {
    // 아이디 찾기시 등록된 계정 확인 요청 Request
    const jobsiteUserFindIdBeforeCertRequest: JobsiteUserFindIdBeforeCertRequest =
      {
        userName,
        phone: isPhoneAuth ? phone : undefined,
        email: isPhoneAuth ? undefined : email,
      };

    // 아이디 찾기시 등록된 계정 확인 API 호출
    jobsiteUserFindIdBeforeCert(jobsiteUserFindIdBeforeCertRequest)
      .then((response) => {
        if (response?.code === "C000") {
          if (isPhoneAuth) {
            // 휴대폰 인증
            formMailCertSms({
              userName,
              phone,
            }).then((response) => {
              if (response && response.code === "C000") {
                // 인증번호 발송 성공
                setIsCodeSent(true);
                setConfirmTitle("알림");
                setConfirmMessage("인증번호가 발송되었습니다.");
                setIsConfirmPopupOpen(true);
              }
            });
          } else {
            // 이메일 인증
            commonSendEmail({
              to: email,
              subject: "아이디 찾기 인증번호",
            })
              .then((response) => {
                if (response) {
                  if (response.code === "C000") {
                    // 인증번호 발송 성공
                    setIsCodeSent(true);
                    setConfirmTitle("알림");
                    setConfirmMessage("인증번호가 발송되었습니다.");
                    setIsConfirmPopupOpen(true);
                  }
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        } else if (response && response.code === "C005") {
          setConfirmTitle("알림");
          setConfirmMessage(response.message);
          setIsConfirmPopupOpen;
        } else {
          setConfirmTitle("알림");
          setConfirmMessage("가입된 회원정보가 없습니다.");
          setIsConfirmPopupOpen(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 인증번호 확인 버튼 클릭 이벤트
  const handleAuthInputButtonClick = () => {
    if (isPhoneAuth) {
      // 휴대폰 인증일 때
      const jobsiteUserCertRequest: JobsiteUserCertRequest = {
        userName,
        phone,
        smsCode,
      };

      // 휴대폰 인증번호 일치 API 호출
      jobsiteUserCert(jobsiteUserCertRequest)
        .then((response) => {
          if (response && response.code === "C000") {
            setIsAuthSuccess(true);
            setConfirmTitle("알림");
            setConfirmMessage("인증되었습니다.");
            setIsConfirmPopupOpen(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // 이메일 인증일 때
      const jobsiteUserCertEmailRequest: JobsiteUserCertEmailRequest = {
        email,
        emailCode,
      };

      // 이메일 인증번호 일치 API 호출
      jobsiteUserCertEmail(jobsiteUserCertEmailRequest)
        .then((response) => {
          if (response && response.code === "C000") {
            setIsAuthSuccess(true);
            setConfirmTitle("알림");
            setConfirmMessage("인증되었습니다.");
            setIsConfirmPopupOpen(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // 아이디 찾기 버튼 클릭 이벤트
  const handleFindIdButtonClick = () => {
    if (!userName) {
      setConfirmTitle("알림");
      setConfirmMessage("이름을 입력해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    if (isPhoneAuth && !phone) {
      setConfirmTitle("알림");
      setConfirmMessage("휴대폰 번호를 입력해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    if (!isPhoneAuth && !email) {
      setConfirmTitle("알림");
      setConfirmMessage("이메일을 입력해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    if (!isAuthSuccess) {
      setConfirmTitle("알림");
      setConfirmMessage("인증을 완료해주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    let jobsiteUserFindIdRequest: JobsiteUserFindIdRequest;

    if (isPhoneAuth) {
      // 휴대폰 인증일 때
      jobsiteUserFindIdRequest = {
        userName,
        phone,
      };
    } else {
      // 이메일 인증일 때
      jobsiteUserFindIdRequest = {
        userName,
        email,
      };
    }

    // 아이디 찾기 API 호출
    jobsiteUserFindId(jobsiteUserFindIdRequest)
      .then((response) => {
        if (response && response.code === "C000") {
          navigate("/help/find/id/result", {
            state: {
              userName: userName,
              jobsiteUserList: response.jobsiteUserList,
              totalCount: response.totalCount,
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex w-full flex-col">
      {isMobileScreen ? <AppBar title={"아이디 찾기"} /> : <TopBarPC />}

      <div className="flex w-full flex-col px-[10px] pt-8 pc:mx-auto pc:w-[600px] pc:gap-10 pc:px-0 pc:pt-[137px]">
        {/* PC 버전 타이틀 */}
        <div className="hidden flex-col gap-[22px] pc:flex">
          <h2 className="text-[32px] font-semibold">아이디 찾기</h2>
          <hr className="border-t border-solid border-normal" />
        </div>

        {/* PC 버전 휴대폰 인증 / 이메일 인증 선택 버튼 */}
        <div className="hidden h-12 w-full rounded border border-solid border-normal bg-white pc:flex">
          <div className="flex flex-1 items-center justify-center gap-2.5">
            {isPhoneAuth ? (
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-normal"
                onClick={() => handleIsPhoneAuthSelect(true)}
              >
                <div className="flex h-5 w-5 items-center rounded-full border border-solid border-normal bg-[#0099FF]"></div>
              </button>
            ) : (
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-normal"
                onClick={() => handleIsPhoneAuthSelect(true)}
              ></button>
            )}
            <span className="text-base font-semibold">휴대폰 인증</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-2.5">
            {isPhoneAuth ? (
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-normal"
                onClick={() => handleIsPhoneAuthSelect(false)}
              ></button>
            ) : (
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-normal"
                onClick={() => handleIsPhoneAuthSelect(false)}
              >
                <div className="flex h-5 w-5 items-center rounded-full border border-solid border-normal bg-[#0099FF]"></div>
              </button>
            )}
            <span className="text-base font-semibold">이메일 인증</span>
          </div>
        </div>

        {/* 모바일 버전 휴대폰 인증 / 이메일 인증 선택 버튼 */}
        <div className="flex h-12 min-h-12 w-full pc:hidden">
          <button
            type="button"
            className={`${isPhoneAuth ? "border border-solid border-black bg-white" : "border border-solid border-normal bg-main"} flex h-full flex-1 flex-col items-center justify-center`}
            onClick={() => setIsPhoneAuth(true)}
          >
            <span className="text-base font-bold leading-none">
              휴대폰 인증
            </span>
          </button>
          <button
            type="button"
            className={`${isPhoneAuth ? "border border-solid border-normal bg-main" : "border border-solid border-black bg-white"} flex h-full flex-1 flex-col items-center justify-center`}
            onClick={() => setIsPhoneAuth(false)}
          >
            <span className="text-base font-bold leading-none">
              이메일 인증
            </span>
          </button>
        </div>

        {/* 이름 */}
        <div className="mt-[42px] flex w-full flex-col items-start gap-[6px] pc:mt-0">
          <h2 className="text-base">이름</h2>
          <div className="min-h-10 w-full rounded border border-solid border-normal bg-white px-[10px]">
            <input
              type="text"
              className="h-full w-full text-xs"
              value={userName || ""}
              onChange={handleUserNameChange}
            />
          </div>
        </div>

        {/* 휴대폰 / 이메일 인증 */}
        <div className="mt-[42px] flex w-full flex-col items-start gap-[6px] pc:mt-0">
          <h2 className="text-sm pc:text-base">
            {isPhoneAuth ? "휴대폰 인증" : "이메일 인증"}
          </h2>
          <div className="flex min-h-10 w-full items-center gap-2.5">
            <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
              <input
                type="text"
                className="h-full w-full text-xs"
                value={isPhoneAuth ? phone : email}
                onChange={handlePhoneOrEmailChange}
              />
            </div>
            <button
              type="button"
              className="h-full min-w-[110px] rounded bg-[#10B981] text-sm text-white"
              onClick={handleAuthButtonClick}
            >
              {isCodeSent ? "인증번호 재발송" : "인증하기"}
            </button>
          </div>
          <div className="mt-[10px] flex min-h-10 w-full items-center gap-2.5">
            <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
              <input
                type="text"
                className="h-full w-full text-xs"
                value={isPhoneAuth ? smsCode : emailCode}
                onChange={handleAuthCodeChange}
              />
            </div>
            <button
              type="button"
              className="h-full min-w-[110px] rounded bg-[#0099FF] text-sm text-white"
              onClick={handleAuthInputButtonClick}
            >
              인증번호 확인
            </button>
          </div>
        </div>

        {/* 아이디 찾기 */}
        <div className="mt-8 flex w-full flex-col gap-2.5 pc:mt-0">
          <button
            type="button"
            className="flex h-[35px] min-h-[35px] w-full items-center justify-center rounded bg-[#DC143C] text-base font-semibold text-white"
            onClick={handleFindIdButtonClick}
          >
            아이디 찾기
          </button>
        </div>
      </div>

      {/* 코리아티엠 정보 */}
      <div className="fixed bottom-24 left-1/2 hidden w-full -translate-x-1/2 transform flex-col items-center gap-5 pc:flex">
        <div
          className="flex cursor-pointer items-center justify-center gap-[11px]"
          onClick={() => setIsInformationOpen(!isInformationOpen)}
        >
          <span className="text-sm text-[#333333]">ⓒ Recruiting Lab</span>
          <img
            src="/assets/images/icons/svg/down_arrow_light.svg"
            alt="Open"
            className={`${isInformationOpen ? "rotate-180" : "rotate-0"} w-3 cursor-pointer`}
          />
        </div>

        {isInformationOpen && (
          <h4 className="absolute top-6 text-center text-xxs text-[#333333]">
            서울특별시 중구 다산로38길 66-47
            <br />
            개인정보관리책임자 : 이태준 | 고객센터 : 1644-4223
            <br />
            사업자등록번호 : 789-81-02395
            <br />
            통신판매업신고 : 제2022-서울중구-1101호
            <br />
            직업소개사업 신고번호 : 제2021-3010165-14-5-0003호 
          </h4>
        )}
      </div>

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )}
    </div>
  );
}

export default FindId;
