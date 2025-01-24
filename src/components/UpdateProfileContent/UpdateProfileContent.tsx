import { useEffect, useState } from "react";
import {
  jobsiteUserChangePwd,
  JobsiteUserChangePwdRequest,
  jobsiteUserCheckSocial,
  jobsiteUserFindOne,
  jobsiteUserUpdate,
  JobsiteUserUpdateRequest,
} from "../../api/user";
import {
  commonSendEmail,
  formMailCertSms,
  jobsiteUserCert,
  jobsiteUserCertEmail,
  jobsiteUserResign,
  JobsiteUserResignRequest,
} from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";
import ModalPopup from "../../pages/ModalPopup";
import DaumPostCode from "react-daum-postcode";

interface UpdateProfileContentProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

interface Agreement {
  privacy: boolean; // 개인정보 수집 및 이용
  marketingSms: boolean; // SMS 수신 동의
  marketingEmail: boolean; // E-Mail 수신 동의
}

interface AgreementRequest {
  privacy: "Y" | "N";
  marketingSms: "Y" | "N";
  marketingEmail: "Y" | "N";
}

function UpdateProfileContent({
  selectedTab,
  setSelectedTab,
}: UpdateProfileContentProps) {
  const { state, dispatch } = useAuth();
  const { isLoggedIn, user } = state;
  const navigate = useNavigate();

  // 로그인 되어있지 않으면 로그인 페이지로 이동
  if (!isLoggedIn) {
    navigate("/login", { replace: true });
  }

  const [userId, setUserId] = useState<string>(""); // 아이디
  const [userPwd, setUserPwd] = useState<string>(""); // 비밀번호
  const [userNewPwd, setUserNewPwd] = useState<string>(""); // 새 비밀번호
  const [userNewPwdCheck, setUserNewPwdCheck] = useState<string>(""); // 새 비밀번호 재입력
  const [newPwdError, setNewPwdError] = useState<string>(""); // 새 비밀번호 오류 메시지
  const [userName, setUserName] = useState<string>(""); // 이름
  const [phone, setPhone] = useState<string>(""); // 휴대폰
  const [initialPhone, setInitialPhone] = useState<string>(""); // 초기 휴대폰
  const [phoneCode, setPhoneCode] = useState<string>(""); // 휴대폰 인증번호
  const [email, setEmail] = useState<string>(""); // 이메일
  const [initialEmail, setInitialEmail] = useState<string>(""); // 초기 이메일
  const [emailCode, setEmailCode] = useState<string>(""); // 이메일 인증번호
  const [zoneCode, setZoneCode] = useState<string>(""); // 우편번호
  const [address, setAddress] = useState<string>(""); // 주소
  // const [sido, setSido] = useState<string>(""); // 시도
  // const [sigungu, setSigungu] = useState<string>(""); // 시군구
  const [gender, setGender] = useState<string>("남자"); // 성별
  const [birth, setBirth] = useState<string>(""); // 생년월일
  const [addressDetail, setAddressDetail] = useState<string>(""); // 상세주소

  const [allChecked, setAllChecked] = useState<boolean>(false); // 약관동의 동의 여부
  const [agreements, setAgreements] = useState<Agreement>({
    privacy: false,
    marketingSms: false,
    marketingEmail: false,
  }); // 약관동의 상태
  const [agreementsRequest, setAgreementsRequest] = useState<AgreementRequest>({
    privacy: "N",
    marketingSms: "N",
    marketingEmail: "N",
  }); // 약관동의 요청 (API 전송용)
  const [selectedTerms, setSelectedTerms] = useState<keyof Agreement | null>(
    null,
  ); // 선택된 약관

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 이메일 발송 여부
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // 이메일 인증 여부

  const [isPhoneSent, setIsPhoneSent] = useState<boolean>(false); // 휴대폰 발송 여부
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false); // 휴대폰 인증 여부

  // const [pwdError, setPwdError] = useState<string>(""); // 비밀번호 오류 메시지

  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false); // 확인 팝업 오픈 여부

  const [isSocial, setIsSocial] = useState<boolean>(false); // 소셜 로그인 여부

  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false); // 약관 보기 모달 오픈 여부

  const [isUserUpdated, setIsUserUpdated] = useState<boolean>(false); // 회원정보 수정 여부

  const [isDaumPostOpen, setIsDaumPostOpen] = useState<boolean>(false); // 다음 주소 찾기 모달 오픈 여부

  // 개별 체크박스 상태 변경
  const handleCheckboxChange = (name: keyof Agreement) => {
    setAgreements((prev) => {
      const updatedAgreements = { ...prev, [name]: !prev[name] }; // 변경된 약관 상태
      const isAllChecked = Object.values(updatedAgreements).every((v) => v); // 모두 동의 여부
      setAllChecked(isAllChecked); // 모두 동의 상태 변경
      return updatedAgreements;
    });
  };

  // 모두 동의 상태 변경
  const handleAllCheckChange = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setAgreements({
      privacy: newCheckedState,
      marketingSms: newCheckedState,
      marketingEmail: newCheckedState,
    });
  };

  // 약관 보기 버튼 클릭 이벤트
  const handleTermsOpenButtonClick = (name: keyof Agreement) => {
    setSelectedTerms(name);
    setIsTermsOpen(true);
  };

  // 비밀번호 입력 이벤트
  const handleUserPwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPwd(event.target.value);
  };

  // 이름 입력 이벤트
  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  // 생년월일 입력 이벤트
  const handleBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirth(event.target.value);
  };

  // 이메일 입력 이벤트
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // 이메일 인증번호 입력 이벤트
  const handleEmailCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmailCode(event.target.value);
  };

  // 이메일 인증 후 변경 버튼 클릭 이벤트
  const handleEmailChangeAuthButtonClick = () => {
    commonSendEmail({
      to: email,
      subject: "이메일 인증 코드",
    }).then((response) => {
      if (response && response.code === "C000") {
        // 이메일 발송 성공 시
        setIsEmailSent(true);
        setConfirmTitle("알림");
        setConfirmMessage("인증번호가 발송되었습니다.");
        setIsConfirmOpen(true);
      }
    });
  };

  // 이메일 인증번호 확인 버튼 클릭 이벤트
  const handleEmailAuthButtonClick = () => {
    jobsiteUserCertEmail({
      email,
      emailCode,
    }).then((response) => {
      if (response && response.code === "C000") {
        // 이메일 인증 성공 시
        setIsEmailVerified(true);
        setConfirmTitle("알림");
        setConfirmMessage("인증되었습니다.");
        setIsConfirmOpen(true);
      }
    });
  };

  // 휴대폰 입력 이벤트
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  // 휴대폰 인증번호 입력 이벤트
  const handlePhoneCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPhoneCode(event.target.value);
  };

  // 휴대폰 인증 후 변경 버튼 클릭 이벤트
  const handlePhoneChangeAuthButtonClick = () => {
    // 휴대폰 인증번호 발송 API 호출
    formMailCertSms({
      userName,
      phone,
    }).then((response) => {
      if (response && response.code === "C000") {
        // 휴대폰 인증 성공 시
        setIsPhoneSent(true);
        setConfirmTitle("알림");
        setConfirmMessage("인증번호가 발송되었습니다.");
        setIsConfirmOpen(true);
      }
    });
  };

  // 휴대폰 인증번호 확인 버튼 클릭 이벤트
  const handlePhoneAuthButtonClick = () => {
    // 인증번호 확인 API 호출
    jobsiteUserCert({
      userName,
      phone,
      smsCode: phoneCode,
    }).then((response) => {
      if (response && response.code === "C000") {
        // 휴대폰 인증 성공 시
        setIsPhoneVerified(true);
        setConfirmTitle("알림");
        setConfirmMessage("인증되었습니다.");
        setIsConfirmOpen(true);
      }
    });
  };

  // 다음 주소 찾기 설정
  const complete = (data: any) => {
    let fullAddress = data.address;
    let zonecode = data.zonecode;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setZoneCode(zonecode); // 우편번호
    setAddress(fullAddress); // 주소

    setIsDaumPostOpen(false); // 다음 주소 찾기 모달 닫기
  };

  // 주소 입력 이벤트
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  // 상세주소 입력 이벤트
  const handleAddressDetailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddressDetail(event.target.value);
  };

  // 새 비밀번호 입력 이벤트
  const handleUserNewPwdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserNewPwd(event.target.value);
  };

  // 새 비밀번호 재입력 이벤트
  const handleUserNewPwdCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserNewPwdCheck(event.target.value);
  };

  // 회원정보수정 버튼 클릭
  const handleUserEditButtonClick = () => {
    // 비밀번호 확인
    if (!isSocial && !userPwd) {
      setConfirmTitle("알림");
      setConfirmMessage("비밀번호를 입력해주세요.");
      setIsConfirmOpen(true);
      return;
    }

    // 주소 확인
    if (!address) {
      setConfirmTitle("알림");
      setConfirmMessage("주소를 입력해주세요.");
      setIsConfirmOpen(true);
      return;
    }

    // 필수 약관 동의 확인
    if (!agreements.privacy) {
      setConfirmTitle("알림");
      setConfirmMessage("개인정보 수집 및 이용에 동의해주세요.");
      setIsConfirmOpen(true);
      return;
    }

    // 이메일이 변경되었을 경우
    if (email !== initialEmail) {
      if (!isEmailVerified) {
        setConfirmTitle("알림");
        setConfirmMessage("이메일 인증을 진행해주세요.");
        setIsConfirmOpen(true);
        return;
      }
    }

    // 휴대폰이 변경되었을 경우
    if (phone !== initialPhone) {
      if (!isPhoneVerified) {
        setConfirmTitle("알림");
        setConfirmMessage("휴대폰 인증을 진행해주세요.");
        setIsConfirmOpen(true);
        return;
      }
    }

    // 회원 수정 API Request
    const jobsiteUserUpdateRequest: JobsiteUserUpdateRequest = {
      userId,
      userPwd,
      userName,
      phone,
      email,
      address,
      // sido,
      // sigungu,
      gender,
      birth,
      // photo,
      // marketing,
      addressDetail,
      agreePrivacy: agreementsRequest.privacy,
      agreeSmsMarketing: agreementsRequest.marketingSms,
      agreeEmailMarketing: agreementsRequest.marketingEmail,
    };

    // 회원 수정 API 호출
    jobsiteUserUpdate(jobsiteUserUpdateRequest)
      .then((response) => {
        if (response && response.code === "C000") {
          // 회원정보 수정 성공 시
          setConfirmTitle("알림");
          setConfirmMessage("회원정보가 수정되었습니다.");
          setIsConfirmOpen(true);
          setIsUserUpdated(true);

          // 회원정보 수정 후 초기화
          setUserPwd("");
          setEmailCode("");
          setPhoneCode("");
          setUserNewPwd("");
          setUserNewPwdCheck("");
        } else if (response && response.code === "C003") {
          setConfirmTitle("알림");
          setConfirmMessage(response.message);
          setIsConfirmOpen(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 비밀번호변경 버튼 클릭 이벤트
  const handlePasswordChangeButtonClick = () => {
    // 비밀번호를 입력하지 않았을 경우
    if (!userPwd) {
      setNewPwdError("현재 비밀번호를 입력해주세요.");
      return;
    }

    // 새 비밀번호를 입력하지 않았을 경우
    if (!userNewPwd) {
      setNewPwdError("새 비밀번호를 입력해주세요.");
      return;
    }

    // 새 비밀번호 재입력이 일치하지 않을 경우
    if (userNewPwd !== userNewPwdCheck) {
      setNewPwdError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const passwordError = validatePassword(userNewPwd);

    // 비밀번호가 유효하지 않을 경우
    if (passwordError) {
      setNewPwdError(passwordError);
      setUserPwd("");
      setUserNewPwd("");
      setUserNewPwdCheck("");
      return;
    }

    // 비밀번호 변경 API Request
    const jobsiteUserChangePwdRequest: JobsiteUserChangePwdRequest = {
      userId,
      userPwd,
      userNewPwd,
    };

    // 비밀번호 변경 API 호출
    jobsiteUserChangePwd(jobsiteUserChangePwdRequest).then((response) => {
      if (response && response.code === "C000") {
        // 비밀번호 변경 성공 시
        setConfirmTitle("알림");
        setConfirmMessage("비밀번호가 변경되었습니다.");
        setIsConfirmOpen(true);
        setUserPwd("");
        setUserNewPwd("");
        setUserNewPwdCheck("");
        setNewPwdError("");
      } else if (response?.code === "C003") {
        // 비밀번호 변경 실패 시
        setConfirmTitle("알림");
        setConfirmMessage("입력하신 현재 비밀번호가 일치하지 않습니다.");
        setIsConfirmOpen(true);
        setUserPwd("");
        setUserNewPwd("");
        setUserNewPwdCheck("");
        setNewPwdError("");
      }
    });
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string => {
    if (password.length < 8) return "8자리 이상 입력해 주세요."; // 8자리 이상
    if (password.length > 15) return "비밀번호는 최대 15자까지 가능합니다."; // 15자리 이하

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/; // 영문, 숫자, 특수문자 조합

    // 영문, 숫자, 특수문자 조합이 아닐 경우
    if (!regex.test(password)) {
      return "영문, 숫자, 특수문자를 조합하여 입력해 주세요.";
    }

    return ""; // 유효하면 에러 메시지 없음
  };

  // 탈퇴하기 버튼 클릭 이벤트
  const handleResignButtonClick = () => {
    if (user?.userId) {
      // 탈퇴 API Request
      const jobsiteUserResignRequest: JobsiteUserResignRequest = {
        userId: user.userId,
      };

      // 탈퇴 API 호출
      jobsiteUserResign(jobsiteUserResignRequest).then((response) => {
        if (response?.code === "C000") {
          // 탈퇴 성공 시
          setConfirmTitle("알림");
          setConfirmMessage("회원탈퇴가 완료되었습니다.");
          setIsConfirmOpen(true);
          localStorage.removeItem("accesstoken");
          localStorage.removeItem("authState");
          Object.keys(localStorage).forEach((key) => {
            if (key.includes("recentJobs")) {
              localStorage.removeItem(key);
            }
          });
        } else {
          // 탈퇴 실패 시
          setConfirmTitle("알림");
          setConfirmMessage("회원탈퇴에 실패했습니다.");
          setIsConfirmOpen(true);
        }
      });
    }
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    if (user?.userId) {
      // 회원정보 조회 API 호출
      jobsiteUserFindOne(user.userId)
        .then((response) => {
          if (response) {
            setUserId(response.userId);
            setUserName(response.userName);
            setPhone(response.phone);
            setInitialPhone(response.phone);
            setBirth(response.birth);
            setGender(response.gender);
            setEmail(response.email || "");
            setInitialEmail(response.email || "");
            setAddress(response.address);
            setAddressDetail(response.addressDetail || "");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // 로그인 되어있지 않으면 로그인 페이지로 이동
  if (!isLoggedIn) {
    navigate("/login", { replace: true });
  }

  // 약관 동의 상태 변경 시 실행
  useEffect(() => {
    setAgreementsRequest({
      privacy: agreements.privacy ? "Y" : "N",
      marketingSms: agreements.marketingSms ? "Y" : "N",
      marketingEmail: agreements.marketingEmail ? "Y" : "N",
    });
  }, [agreements]);

  // 회원정보 수정 성공 시 실행
  useEffect(() => {
    // 현재 탭이 개인정보수정일 경우
    if (selectedTab === "개인정보수정") {
      if (user) {
        jobsiteUserCheckSocial(user?.userId).then((response) => {
          if (response && response.code !== "C000") {
            setIsSocial(true);
          }
        });
      }
    }

    // 현재 탭이 비밀번호변경일 경우
    if (selectedTab === "비밀번호변경" && user?.userId) {
      jobsiteUserCheckSocial(user.userId).then((response) => {
        if (response && response.code !== "C000") {
          setConfirmTitle("알림");
          setConfirmMessage(
            "소셜 로그인 사용자는 비밀번호 변경이 불가능합니다.",
          );
          setIsConfirmOpen(true);
          setSelectedTab("개인정보수정");
        }
      });
    }
  }, [selectedTab]);

  // 회원정보 수정 성공 시 실행
  useEffect(() => {
    if (isUserUpdated) {
      jobsiteUserFindOne(userId).then((response) => {
        if (response) {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: response.userId,
              userName: response.userName,
              role: user?.role || "", // 기존 role 유지
              phone: response.phone,
              email: response.email || user?.email || "", // email이 없으면 기존 email 유지
            },
          });

          setUserId(response.userId);
          setUserName(response.userName);
          setPhone(response.phone);
          setBirth(response.birth);
          setGender(response.gender);

          if (response.email) {
            setEmail(response.email);
          }
        }
      });
    }
  }, [isUserUpdated]);

  return (
    <div className="flex w-full flex-col px-[10px] pb-[15px] pt-[13px] pc:mx-auto pc:w-[600px] pc:pb-0 pc:pt-[50px]">
      {/* 탭 선택 */}
      <div className="mb-[13px] flex h-9 min-h-9 w-full overflow-hidden rounded border border-solid border-normal pc:mb-[30px]">
        <button
          type="button"
          className={`h-full flex-1 rounded-s border-b-0 border-l-0 border-r border-t-0 border-solid border-normal text-sm ${selectedTab === "개인정보수정" ? "bg-white" : "bg-[#D9D9D9] text-[#666666]"}`}
          onClick={() => setSelectedTab("개인정보수정")}
        >
          개인정보수정
        </button>
        <button
          type="button"
          className={`h-full flex-1 border-b-0 border-l-0 border-r border-t-0 border-solid border-normal text-sm ${selectedTab === "비밀번호변경" ? "bg-white" : "bg-[#D9D9D9] text-[#666666]"}`}
          onClick={() => setSelectedTab("비밀번호변경")}
        >
          비밀번호변경
        </button>
        <button
          type="button"
          className={`h-full flex-1 rounded-e text-sm ${selectedTab === "회원탈퇴신청" ? "bg-white" : "bg-[#D9D9D9] text-[#666666]"}`}
          onClick={() => setSelectedTab("회원탈퇴신청")}
        >
          회원탈퇴신청
        </button>
      </div>

      {/* PC 버전 타이틀 */}
      {selectedTab !== "회원탈퇴신청" && (
        <div className="mb-10 hidden w-full items-center justify-between pc:flex">
          <h2 className="text-[32px]">{selectedTab}</h2>
        </div>
      )}

      {/* 개인정보수정 */}
      {selectedTab === "개인정보수정" && (
        <div className="flex w-full flex-col gap-5">
          {!isSocial && (
            <>
              {/* 아이디 */}
              <div className="flex w-full flex-col items-start gap-[6px]">
                <h2 className="text-sm">아이디</h2>
                <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="text"
                    value={userId || ""}
                    disabled
                    className="h-full w-full px-[10px] disabled:cursor-not-allowed disabled:bg-[#EAEAEA] disabled:text-sm disabled:text-[#666666]"
                  />
                </div>
              </div>
              {/* 비밀번호 */}
              <div className="flex w-full flex-col items-start gap-[6px]">
                <h2 className="text-sm">비밀번호</h2>
                <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="password"
                    className="h-full w-full px-[10px] text-sm"
                    value={userPwd || ""}
                    onChange={handleUserPwdChange}
                  />
                </div>
              </div>
            </>
          )}

          <hr className="border-t border-solid border-normal" />

          {/* 이름 */}
          <div className="flex w-full flex-col items-start gap-[6px]">
            <h2 className="text-sm">이름</h2>
            <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
              <input
                type="text"
                className="h-full w-full px-[10px] text-sm disabled:bg-[#EAEAEA] disabled:text-[#666666]"
                disabled
                value={userName || ""}
                onChange={handleUserNameChange}
              />
            </div>
          </div>
          {/* 생년월일 / 성별 */}
          <div className="flex w-full flex-col items-start gap-[6px]">
            <h2 className="text-sm">생년월일 / 성별</h2>
            <div className="flex min-h-10 w-full items-center gap-2.5">
              <div className="h-full w-full rounded border border-solid border-normal bg-white">
                <input
                  type="text"
                  className="h-full w-full px-[10px] text-xs disabled:bg-[#EAEAEA] disabled:text-sm disabled:text-[#666666]"
                  disabled
                  value={birth || ""}
                  onChange={handleBirthChange}
                />
              </div>
              <div className="flex h-full items-center gap-2.5">
                <button
                  type="button"
                  className={`${gender === "남자" ? "bg-[#DC143C33]" : "bg-white"} flex h-full min-w-[50px] items-center justify-center rounded border border-solid border-normal text-sm disabled:bg-[#EAEAEA]`}
                  disabled
                  onClick={() => setGender("남자")}
                >
                  남자
                </button>
                <button
                  type="button"
                  className={`${gender === "여자" ? "bg-[#DC143C33]" : "bg-white"} flex h-full min-w-[50px] items-center justify-center rounded border border-solid border-normal text-sm`}
                  disabled
                  onClick={() => setGender("여자")}
                >
                  여자
                </button>
              </div>
            </div>
          </div>

          <hr className="border-t border-solid border-normal" />

          {/* 이메일 변경 */}
          <div className="flex w-full flex-col items-start gap-[6px]">
            <h2 className="text-sm">이메일인증</h2>
            <div className="flex min-h-10 w-full items-center gap-2.5">
              <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
                <input
                  type="text"
                  className="h-full w-full text-xs"
                  value={email || ""}
                  onChange={handleEmailChange}
                />
              </div>
              <button
                type="button"
                className="h-full min-w-[110px] rounded bg-[#10B981] text-sm text-white"
                onClick={handleEmailChangeAuthButtonClick}
              >
                인증 후 변경
              </button>
            </div>
            <div className="mt-[10px] flex min-h-10 w-full items-center gap-2.5">
              <div
                className={`h-full w-full rounded border border-solid border-normal bg-white px-[10px]`}
              >
                <input
                  type="text"
                  className="h-full w-full text-xs disabled:bg-transparent"
                  value={emailCode || ""}
                  onChange={handleEmailCodeChange}
                  disabled={!isEmailSent || isEmailVerified}
                />
              </div>
              <button
                type="button"
                className="h-full min-w-[110px] whitespace-nowrap rounded bg-[#0099FF] text-sm text-white disabled:bg-opacity-50"
                disabled={!isEmailSent || isEmailVerified}
                onClick={handleEmailAuthButtonClick}
              >
                인증번호 확인
              </button>
            </div>
          </div>

          <hr className="border-t border-solid border-normal" />

          {/* 휴대폰 변경 */}
          <div className="flex w-full flex-col items-start gap-[6px]">
            <h2 className="text-sm">휴대폰인증</h2>
            <div className="flex min-h-10 w-full items-center gap-2.5">
              <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
                <input
                  type="text"
                  className="h-full w-full text-xs"
                  value={phone || ""}
                  onChange={handlePhoneChange}
                />
              </div>
              <button
                type="button"
                className="h-full min-w-[110px] rounded bg-[#10B981] text-sm text-white"
                onClick={handlePhoneChangeAuthButtonClick}
              >
                인증 후 변경
              </button>
            </div>
            <div className="mt-[10px] flex min-h-10 w-full items-center gap-2.5">
              <div
                className={`h-full w-full rounded border border-solid border-normal bg-white px-[10px]`}
              >
                <input
                  type="text"
                  className="h-full w-full text-xs disabled:bg-transparent"
                  value={phoneCode || ""}
                  onChange={handlePhoneCodeChange}
                  disabled={!isPhoneSent || isPhoneVerified}
                />
              </div>
              <button
                type="button"
                className="h-full min-w-[110px] whitespace-nowrap rounded bg-[#0099FF] text-sm text-white disabled:bg-opacity-50"
                disabled={!isPhoneSent || isPhoneVerified}
                onClick={handlePhoneAuthButtonClick}
              >
                인증번호 확인
              </button>
            </div>
          </div>

          <hr className="border-t border-solid border-normal" />

          {/* 주소 */}
          <div className="flex w-full flex-col items-start gap-[6px]">
            <h2 className="text-sm">
              주소 <span className="text-[#DC143C]">(필수)</span>
            </h2>
            <div className="flex w-full flex-col gap-2">
              {/* 우편번호 */}
              <div className="flex min-h-10 w-full items-center gap-2.5">
                <div className="h-full w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="text"
                    className="h-full w-full px-[10px] text-xs disabled:bg-[#EAEAEA] disabled:text-[#666666]"
                    value={zoneCode || ""}
                    disabled
                  />
                </div>
                <button
                  type="button"
                  className="h-full min-w-[110px] rounded bg-[#0099FF] text-sm text-white"
                  onClick={() => setIsDaumPostOpen(true)}
                >
                  주소찾기
                </button>
              </div>
              {/* 주소찾기를 눌러주세요 */}
              <div className="h-10 min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                <input
                  type="text"
                  className="h-full w-full px-[10px] text-sm disabled:bg-[#EAEAEA] disabled:text-[#666666]"
                  value={address || ""}
                  disabled
                  onChange={handleAddressChange}
                  onClick={() => setIsDaumPostOpen(true)}
                />
              </div>
              {/* 상세주소입력 */}
              <div className="h-10 min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                <input
                  type="text"
                  placeholder="상세주소입력"
                  className="h-full w-full px-[10px] text-sm"
                  value={addressDetail || ""}
                  onChange={handleAddressDetailChange}
                />
              </div>
            </div>
          </div>

          {/* 약관동의 */}
          <div className="flex w-full flex-col border border-solid border-normal">
            <div className="flex min-h-9 w-full items-center gap-[5px] border-b border-solid border-normal bg-white p-[10px]">
              <div
                className={`${allChecked ? "bg-[#0099FF]" : "bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] border border-solid border-normal`}
                onClick={handleAllCheckChange}
              >
                {allChecked ? (
                  <img
                    src="/assets/images/icons/svg/check_white.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                ) : (
                  <img
                    src="/assets/images/icons/svg/check.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                )}
              </div>
              <label className="text-sm">모두 동의</label>
            </div>
            <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
              <div
                className={`${agreements.privacy ? "bg-[#0099FF]" : "bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] border border-solid border-normal`}
                onClick={() => handleCheckboxChange("privacy")}
              >
                {agreements.privacy ? (
                  <img
                    src="/assets/images/icons/svg/check_white.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                ) : (
                  <img
                    src="/assets/images/icons/svg/check.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                )}
              </div>
              <label className="text-sm">
                <span className="text-[#DC143C]">[필수]</span> 개인정보 수집 및
                이용 동의
              </label>
              <button
                type="button"
                className="absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 transform items-center justify-center"
                onClick={() => handleTermsOpenButtonClick("privacy")}
              >
                <img
                  src="/assets/images/icons/svg/right_arrow_bold.svg"
                  alt="Open"
                  className="w-2"
                />
              </button>
            </div>
            <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
              <div
                className={`${agreements.marketingSms ? "bg-[#0099FF]" : "bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] border border-solid border-normal`}
                onClick={() => handleCheckboxChange("marketingSms")}
              >
                {agreements.marketingSms ? (
                  <img
                    src="/assets/images/icons/svg/check_white.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                ) : (
                  <img
                    src="/assets/images/icons/svg/check.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                )}
              </div>
              <label className="text-sm text-[#666666]">
                [선택] 광고성 정보 수신 동의 (SMS/MMS)
              </label>
              <button
                type="button"
                className="absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 transform items-center justify-center"
                onClick={() => handleTermsOpenButtonClick("marketingSms")}
              >
                <img
                  src="/assets/images/icons/svg/right_arrow_bold.svg"
                  alt="Open"
                  className="w-2"
                />
              </button>
            </div>
            <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
              <div
                className={`${agreements.marketingEmail ? "bg-[#0099FF]" : "bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px] border border-solid border-normal`}
                onClick={() => handleCheckboxChange("marketingEmail")}
              >
                {agreements.marketingEmail ? (
                  <img
                    src="/assets/images/icons/svg/check_white.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                ) : (
                  <img
                    src="/assets/images/icons/svg/check.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                )}
              </div>
              <label className="text-sm text-[#666666]">
                [선택] 광고성 정보 수신 동의 (E-Mail)
              </label>
              <button
                type="button"
                className="absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 transform items-center justify-center"
                onClick={() => handleTermsOpenButtonClick("marketingEmail")}
              >
                <img
                  src="/assets/images/icons/svg/right_arrow_bold.svg"
                  alt="Open"
                  className="w-2"
                />
              </button>
            </div>
          </div>

          {/* 수정 버튼 */}
          <button
            type="button"
            className="flex h-12 min-h-12 w-full items-center justify-center rounded bg-[#DC143C] text-xl font-bold text-white pc:mb-[90px]"
            onClick={handleUserEditButtonClick}
          >
            회원정보수정
          </button>
        </div>
      )}

      {/* 비밀번호변경 */}
      {selectedTab === "비밀번호변경" && (
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-[6px]">
              {/* 현재 비밀번호 */}
              <div className="flex w-full flex-col items-start gap-[6px]">
                <h2 className="text-sm">비밀번호</h2>
                <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                  <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    className="h-full w-full bg-white px-[10px] text-sm placeholder:text-[#666666]"
                    value={userPwd || ""}
                    onChange={handleUserPwdChange}
                  />
                </div>
              </div>
              {/* 새 비밀번호 */}
              <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                <input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  className="h-full w-full bg-white px-[10px] text-sm placeholder:text-[#666666]"
                  value={userNewPwd || ""}
                  onChange={handleUserNewPwdChange}
                />
              </div>
              {/* 새 비밀번호 재입력 */}
              <div className="min-h-10 w-full overflow-hidden rounded border border-solid border-normal">
                <input
                  type="password"
                  placeholder="새 비밀번호 재입력"
                  className="h-full w-full bg-white px-[10px] text-sm placeholder:text-[#666666]"
                  value={userNewPwdCheck || ""}
                  onChange={handleUserNewPwdCheckChange}
                />
              </div>
              {newPwdError && (
                <p className="text-xxs text-[#DC143C] pc:text-xs">
                  {newPwdError}
                </p>
              )}
            </div>

            {/* 수정 버튼 */}
            <button
              type="button"
              className="flex h-12 min-h-12 w-full items-center justify-center rounded bg-[#DC143C] text-xl font-bold text-white"
              onClick={handlePasswordChangeButtonClick}
            >
              비밀번호변경
            </button>
          </div>

          <div className="mt-[30px] flex w-full flex-col gap-[19px] pc:mb-[124px]">
            <h3 className="px-2 text-base font-semibold pc:px-0 pc:text-xl">
              안전한 비밀번호 사용 방법
            </h3>
            <div className="flex w-full flex-col gap-3 px-2 pc:px-0">
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
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold leading-4">ㆍ</span>
                <span className="text-xs text-[#666666]">
                  6개월마다 비밀번호 변경 권장
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 회원탈퇴신청 */}
      {selectedTab === "회원탈퇴신청" && (
        <div className="flex w-full flex-col gap-[30px] pt-[7px] pc:gap-10 pc:pt-0">
          <h2 className="text-xl font-bold pc:-mb-2.5 pc:text-[32px]">
            탈퇴 전 꼭 확인해 주세요
          </h2>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-bold pc:text-base">
              1. 동일한 아이디로 재가입 불가
            </h3>
            <div className="flex items-start gap-1 pl-[10px]">
              <span className="text-xs font-bold leading-4 text-[#666666] pc:text-base">
                •
              </span>
              <span className="text-xs text-[#666666] pc:text-base">
                탈퇴 신청 즉시 처리되며, 해당 아이디로 재가입/로그인이 불가능
                합니다
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-bold pc:text-base">
              2. 탈퇴 즉시 회원정보 삭제
            </h3>
            <div className="flex items-start gap-1 pl-[10px]">
              <span className="text-xs font-bold leading-4 text-[#666666] pc:text-base">
                •
              </span>
              <span className="text-xs text-[#666666] pc:text-base">
                탈퇴 즉시 이력서 및 구직활동 정보가 모두 삭제되며, 삭제된 정보는
                복구되지 않습니다. 단, 공공적 성격의 게시물은 삭제되지 않으므로
                탈퇴 전 미리 삭제해 주세요
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-bold pc:text-base">
              3. 이용 정보 일정기관 보관
            </h3>
            <div className="flex items-start gap-1 pl-[10px]">
              <span className="text-xs font-bold leading-4 text-[#666666] pc:text-base">
                •
              </span>
              <span className="text-xs text-[#666666] pc:text-base">
                ‘전자상거래 등에서 소비자보호에 관한 법률’에 따라 유료 결제에
                관한 계약 기록은 5년간 보관합니다.
              </span>
            </div>
            <div className="flex items-start gap-1 pl-[10px]">
              <span className="text-xs font-bold leading-4 text-[#666666] pc:text-base">
                •
              </span>
              <span className="text-xs text-[#666666] pc:text-base">
                부적합 정보, 이용제한 및 징계에 관한 기록은 일정기간 보관합니다
              </span>
            </div>
          </div>

          {/* 탈퇴하기 버튼 */}
          <button
            type="button"
            className="flex h-12 min-h-12 w-full items-center justify-center rounded bg-[#DC143C] text-xl font-bold text-white pc:mb-[68px]"
            onClick={handleResignButtonClick}
          >
            탈퇴하기
          </button>
        </div>
      )}

      {/* 약관 모달 */}
      {isTermsOpen && (
        <ModalPopup
          closeModal={() => setIsTermsOpen(false)}
          privacyConsentPersonal={selectedTerms === "privacy"}
          smsPersonal={selectedTerms === "marketingSms"}
          emailPersonal={selectedTerms === "marketingEmail"}
        />
      )}

      {/* 확인 팝업 */}
      {isConfirmOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => {
            setIsConfirmOpen(false);
            if (confirmMessage === "회원탈퇴가 완료되었습니다.") {
              window.location.href = "/";
              setTimeout(() => {
                dispatch({ type: "LOGOUT" });
              }, 100);
            }
          }}
        />
      )}

      {/* 다음 주소 찾기 팝업 */}
      {isDaumPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          {/* 어두운 배경 Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsDaumPostOpen(false)}
          ></div>

          <DaumPostCode
            autoClose
            style={{
              height: "500px",
              width: "100%",
              maxWidth: "700px",
            }}
            onComplete={complete}
          />
        </div>
      )}
    </div>
  );
}

export default UpdateProfileContent;
