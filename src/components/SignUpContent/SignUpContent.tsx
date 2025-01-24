import { useCallback, useEffect, useState } from "react";
import {
  commonSendEmail,
  formMailCertSms,
  FormMailCertSmsRequest,
  jobsiteUserCert,
  jobsiteUserCertEmail,
  JobsiteUserCertEmailRequest,
  JobsiteUserCertRequest,
  jobsiteUserJoin,
  JobsiteUserJoinRequest,
} from "../../api/auth";
import { debounce } from "lodash";
import { jobsiteUserCheckEmail, jobsiteUserCheckId } from "../../api/user";
import ModalPopup from "../../pages/ModalPopup";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";
import { useMediaQuery } from "@react-hook/media-query";

interface SignUpContentProps {
  socialId?: string;
  socialType?: string;
}

interface Agreement {
  age: boolean; // 만 15세 이상
  terms: boolean; // 서비스 이용약관
  privacy: boolean; // 개인정보 수집 및 이용
  marketingSms: boolean; // SMS 수신 동의
  marketingEmail: boolean; // E-Mail 수신 동의
}

interface AgreementRequest {
  age: "Y" | "N";
  terms: "Y" | "N";
  privacy: "Y" | "N";
  marketingSms: "Y" | "N";
  marketingEmail: "Y" | "N";
}

function SignUpContent(props: SignUpContentProps) {
  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  const { socialId, socialType } = props; // 소셜 로그인 사용자일 경우 소셜 정보 가져오기
  const navigate = useNavigate();

  const [allChecked, setAllChecked] = useState<boolean>(false); // 모두 동의 체크박스

  // 약관 동의 상태
  const [agreements, setAgreements] = useState<Agreement>({
    age: false, // 만 15세 이상
    terms: false, // 서비스 이용약관
    privacy: false, // 개인정보 수집 및 이용
    marketingSms: false, // SMS 수신 동의
    marketingEmail: false, // E-Mail 수신 동의
  });

  // 약관 동의 상태 (API 요청용)
  const [agreementsRequest, setAgreementsRequest] = useState<AgreementRequest>({
    age: "N", // 만 15세 이상
    terms: "N", // 서비스 이용약관
    privacy: "N", // 개인정보 수집 및 이용
    marketingSms: "N", // SMS 수신 동의
    marketingEmail: "N", // E-Mail 수신 동의
  });
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false); // 약관 보기 모달 오픈 여부
  const [selectedTerms, setSelectedTerms] = useState<keyof Agreement | null>(
    null,
  ); // 선택된 약관
  const [isAvailable, setIsAvailable] = useState<boolean>(false); // 아이디 중복 여부

  const [userId, setUserId] = useState<string>(""); // 아이디
  const [userIdError, setUserIdError] = useState<string>(""); // 아이디 에러 메시지
  const [isUserIdTouched, setIsUserIdTouched] = useState<boolean>(false); // 아이디 입력 여부 확인

  const [userPwd, setUserPwd] = useState<string>(""); // 비밀번호
  const [userPwdConfirm, setUserPwdConfirm] = useState<string>(""); // 비밀번호 확인
  const [userPwdError, setUserPwdError] = useState<string>(""); // 비밀번호 에러 메시지
  const [userPwdConfirmError, setUserPwdConfirmError] = useState<string>(""); // 비밀번호 확인 에러 메시지
  const [securityLevel, setSecurityLevel] = useState<string>(""); // 비밀번호 보안 등급

  const [userName, setUserName] = useState<string>(""); // 이름
  const [userNameError, setUserNameError] = useState<string>(""); // 이름 에러 메시지

  const [email, setEmail] = useState<string>(""); // 이메일
  const [emailError, setEmailError] = useState<string>(""); // 이메일 에러 메시지
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false); // 이메일 중복 여부
  const [emailDuplicateError, setEmailDuplicateError] = useState<string>(""); // 이메일 중복 에러 메시지
  const [emailDuplicateMessage, setEmailDuplicateMessage] =
    useState<string>(""); // 이메일 중복 메시지
  const [emailCodeSent, setEmailCodeSent] = useState<boolean>(false); // 이메일 인증번호 발송 여부
  const [emailCode, setEmailCode] = useState<string>(""); // 이메일 인증번호
  const [emailVerified, setEmailVerified] = useState<boolean>(false); // 이메일 인증 여부

  const [birth, setBirth] = useState<string>(""); // 생년월일
  const [birthError, setBirthError] = useState<string>(""); // 생년월일 에러 메시지

  const [gender, setGender] = useState(""); // 성별
  const [genderError, setGenderError] = useState<string>(""); // 성별 에러 메시지

  const [phone, setPhone] = useState<string>(""); // 휴대폰 번호
  const [phoneError, setPhoneError] = useState<string>(""); // 휴대폰 번호 에러 메시지

  const [smsCode, setSmsCode] = useState<string>(""); // 인증번호
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증번호 발송 여부 상태
  const [isCodeConfirmed, setIsCodeConfirmed] = useState<boolean>(false); // 인증 완료 여부 상태
  const [verificationMessage, setVerificationMessage] = useState<string>(""); // 인증 확인 메시지

  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 회원가입 확인 팝업 오픈 여부
  const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지

  const [showScrollButton, setShowScrollButton] = useState<boolean>(false); // 스크롤 버튼 표시 여부

  // 개별 체크박스 상태 변경
  const handleCheckboxChange = (name: keyof Agreement) => {
    setAgreements((prev) => {
      const updatedAgreements = { ...prev, [name]: !prev[name] }; // 선택된 약관 상태 변경
      const isAllChecked = Object.values(updatedAgreements).every((v) => v); // 모두 동의 체크 여부 확인

      setAllChecked(isAllChecked); // 모두 동의 체크박스 상태 변경
      return updatedAgreements; // 변경된 약관 상태 반환
    });
  };

  // 모두 동의 상태 변경
  const handleAllCheckChange = () => {
    const newCheckedState = !allChecked; // 모두 동의 상태 변경
    setAllChecked(newCheckedState); // 모두 동의 체크박스 상태 변경

    // 모두 동의 상태에 따라 약관 상태 변경
    setAgreements({
      age: newCheckedState,
      terms: newCheckedState,
      privacy: newCheckedState,
      marketingSms: newCheckedState,
      marketingEmail: newCheckedState,
    });
  };

  // 약관 보기 버튼 클릭 이벤트
  const handleTermsOpenButtonClick = (name: keyof Agreement) => {
    setSelectedTerms(name); // 선택된 약관 설정
    setIsTermsOpen(true); // 약관 모달 오픈
  };

  // 아이디 유효성 검사 함수
  const validateId = (inputId: string) => {
    const idRegex = /^[a-zA-Z0-9]{4,15}$/; // 4~15자의 영문 또는 숫자

    if (!idRegex.test(inputId)) {
      // 한글이 포함되거나 4~15자의 범위를 벗어나는 경우
      if (
        inputId.length < 4 ||
        inputId.length > 15 ||
        /[^a-zA-Z0-9]/.test(inputId)
      ) {
        return "4~15자의 영문 또는 숫자만 가능합니다.";
      }
    }
    return ""; // 유효하면 에러 메시지 없음
  };

  // 아이디 중복 체크 API (디바운싱)
  const checkIdAvailability = useCallback(
    debounce(async (userId: string) => {
      if (!userId) return; // 아이디가 없으면 API 호출하지 않음

      try {
        const result = await jobsiteUserCheckId(userId); // 아이디 중복 체크 API 호출

        if (result === "C000") {
          // 중복되지 않았을 경우
          setIsAvailable(true);
        } else if (result === "E002") {
          // 이미 사용중이거나 탈퇴한 아이디일 경우
          setUserIdError("이미 사용중이거나 탈퇴한 아이디입니다.");
          setIsAvailable(false);
        } else {
          setIsAvailable(false);
        }
      } catch (error) {
        console.error(error);
        setIsAvailable(false); // 에러 발생 시 중복 여부 초기화
      }
    }, 500), // 500ms 디바운싱
    [],
  );

  // 아이디 입력 이벤트
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputId = e.target.value;

    setIsUserIdTouched(true); // 아이디 입력 시작 시 터치 여부 변경

    if (inputId.length > 15) return; // 최대 15자리까지만 입력 허용

    setUserId(inputId);

    // 아이디 유효성 검사
    const error = validateId(inputId);
    setUserIdError(error); // 에러 메시지 업데이트

    // 아이디 중복 체크
    if (!error) {
      checkIdAvailability(inputId);
    } else {
      setIsAvailable(false); // 에러가 있으면 중복 체크 결과 초기화
    }
  };

  // 비밀번호 입력 이벤트
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputPassword = e.target.value;

    if (inputPassword.length > 15) return; // 최대 15자리까지만 입력 허용

    setUserPwd(inputPassword);

    const error = validatePassword(inputPassword);
    setUserPwdError(error);

    // 비밀번호 확인 입력 필드가 비어있을 경우 메시지 설정
    if (!userPwdConfirm) {
      setUserPwdConfirmError("비밀번호를 다시 한번 입력해 주세요.");
    } else if (inputPassword !== userPwdConfirm) {
      setUserPwdConfirmError(
        "비밀번호와 일치하지 않습니다. 다시 입력해 주세요.",
      );
    } else {
      setUserPwdConfirmError(""); // 일치하면 에러 메시지 초기화
    }

    if (!inputPassword) {
      setSecurityLevel(""); // 비밀번호가 없으면 보안등급 초기화
    }
  };

  // 비밀번호 확인 입력 이벤트
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputPasswordConfirm = e.target.value;

    if (inputPasswordConfirm.length > 15) return; // 최대 15자리까지만 입력 허용

    setUserPwdConfirm(inputPasswordConfirm);

    if (!inputPasswordConfirm) {
      // 비밀번호 확인 입력 필드가 비어있을 경우
      setUserPwdConfirmError("비밀번호를 다시 한번 입력해 주세요.");
    } else if (userPwd && inputPasswordConfirm !== userPwd) {
      // 비밀번호와 일치하지 않을 경우
      setUserPwdConfirmError(
        "비밀번호와 일치하지 않습니다. 다시 입력해 주세요.",
      );
    } else {
      setUserPwdConfirmError(""); // 에러 메시지 초기화
    }
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string => {
    if (password.length < 8) return "8자리 이상 입력해 주세요."; // 8자리 이상
    if (password.length > 15) return "비밀번호는 최대 15자까지 가능합니다."; // 15자리 이하

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/; // 영문, 숫자, 특수문자 조합

    // 영문, 숫자, 특수문자 조합 체크
    if (!regex.test(password)) {
      return "영문, 숫자, 특수문자를 조합하여 입력해 주세요.";
    }

    // 보안 등급 설정
    if (password.length >= 12 && regex.test(password)) {
      setSecurityLevel("보안등급 높음");
    } else if (password.length >= 8) {
      setSecurityLevel("보안등급 중간");
    }

    return ""; // 유효하면 에러 메시지 없음
  };

  // 이름 입력 이벤트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputName = e.target.value;
    setUserName(inputName);

    // 이름을 입력하지 않았을 경우
    if (!inputName.trim()) {
      setUserNameError("이름을 입력해 주세요.");
    } else {
      setUserNameError(""); // 유효하면 초기화
    }
  };

  // 생년월일 입력 이벤트
  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputBirth = e.target.value;

    // 숫자만 입력 허용, 8자리 초과 방지
    if (!/^\d{0,8}$/.test(inputBirth)) return;

    setBirth(inputBirth);

    // 생년월일 유효성 검사
    if (inputBirth.length !== 8) {
      setBirthError("생년월일 8자리를 입력해 주세요.");
      return;
    }

    const year = parseInt(inputBirth.substring(0, 4)); // 년도
    const month = parseInt(inputBirth.substring(4, 6)); // 월
    const day = parseInt(inputBirth.substring(6, 8)); // 일
    const currentYear = new Date().getFullYear(); // 현재 년도

    // 유효하지 않은 월/일 체크 (1~12월, 1~31일)
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      setBirthError("유효하지 않은 생년월일 입니다.");
      return;
    }

    // 만 100세 제한
    if (currentYear - year > 100) {
      setBirthError("만 100세 미만만 회원가입이 가능합니다.");
      return;
    }

    setBirthError(""); // 유효하면 초기화
  };

  // 성별 선택 이벤트
  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
    setGenderError(""); // 성별 선택 시 에러 초기화
  };

  // 이메일 입력 이벤트
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // 이메일 중복 체크 결과 초기화
    setIsEmailAvailable(false);
    setEmailDuplicateError("");
    setEmailDuplicateMessage("");
    setEmailCodeSent(false);

    // 이메일 유효성 검사
    if (!inputEmail.trim()) {
      setEmailError("이메일을 입력해 주세요.");
    } else if (!validateEmail(inputEmail)) {
      setEmailError("이메일 형식에 맞게 입력해주세요.");
    } else {
      setEmailError(""); // 유효하면 초기화
    }
  };

  // 이메일 중복 확인 버튼 클릭 이벤트
  const handleEmailCheckButtonClick = () => {
    if (emailError) return; // 이메일 형식 에러가 있으면 중복 확인하지 않음

    // 이메일 중복 확인 API 호출
    if (emailDuplicateError) {
      // 이미 가입된 이메일일 경우
      commonSendEmail({
        to: email,
        subject: "코티잡 이메일 인증",
      }).then((response) => {
        if (response?.code === "C000") {
          // 이메일 전송 성공 시
          setConfirmTitle("인증메일 전송");
          setConfirmMessage("이메일로 인증번호가 발송되었습니다.");
          setIsConfirmPopupOpen(true);
          setEmailCodeSent(true);
        } else {
          // 이메일 전송 실패 시
          setConfirmTitle("인증메일 전송 실패");
          setConfirmMessage("인증메일 전송에 실패했습니다.");
          setIsConfirmPopupOpen(true);
        }
      });
    } else {
      // 이메일 중복 확인 API 호출
      jobsiteUserCheckEmail(email).then((response) => {
        if (response === "C000") {
          // 중복되지 않았을 경우
          setIsEmailAvailable(true);
        } else if (response === "C003") {
          // 이미 가입된 이메일일 경우
          setIsEmailAvailable(true);
          setEmailDuplicateError("이미 가입된 이메일입니다.");
          setEmailDuplicateMessage(
            "본인 이메일이 맞다면 [인증메일 전송] 버튼을 선택 후 이메일로 발송된 인증번호를 입력해주세요.",
          );
        } else {
          setIsEmailAvailable(false);
        }
      });
    }
  };

  // 이메일 인증번호 입력 이벤트
  const handleEmailCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmailCode = e.target.value;
    setEmailCode(inputEmailCode);
  };

  // 이메일 인증번호 확인 버튼 클릭 이벤트
  const handleEmailAuthButtonClick = () => {
    // 이메일 인증 API Request
    const req: JobsiteUserCertEmailRequest = {
      email,
      emailCode,
    };

    // 이메일 인증 API 호출
    jobsiteUserCertEmail(req).then((response) => {
      if (response?.code === "C000") {
        // 이메일 인증 성공 시
        setEmailVerified(true);
        setConfirmTitle("이메일 인증 성공");
        setConfirmMessage("이메일 인증이 완료되었습니다.");
        setIsConfirmPopupOpen(true);
      } else {
        // 이메일 인증 실패 시
        setEmailVerified(false);
        setConfirmTitle("이메일 인증 실패");
        setConfirmMessage("이메일 인증에 실패했습니다.");
        setIsConfirmPopupOpen(true);
      }
    });
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규식 (공백, @ 포함)
    return emailRegex.test(email);
  };

  // 휴대폰 번호 입력 이벤트
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputPhone = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 허용

    if (inputPhone.length > 11) return; // 최대 11자리까지만 허용

    setPhone(inputPhone);
    setPhoneError(""); // 휴대폰 번호 입력 시 에러 초기화
  };

  // 휴대폰 번호 포커스 아웃 이벤트
  const handlePhoneBlur = () => {
    if (phone.length === 0) {
      // 휴대폰 번호를 입력하지 않았을 경우
      setPhoneError("휴대폰번호를 입력해 주세요.");
    } else if (phone.length < 7) {
      // 휴대폰 번호가 7자리 미만일 경우
      setPhoneError("휴대폰번호를 입력해 주세요.");
    } else if (phone.length < 11) {
      // 휴대폰 번호가 11자리 미만일 경우
      setPhoneError("휴대폰 번호 형식에 맞지 않습니다.");
    }
  };

  // 인증번호 입력 이벤트
  const handleSmsCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 아이디를 먼저 입력하지 않았을 경우
    if (!userId && !isUserIdTouched) {
      setUserIdError("아이디를 먼저 입력해주세요."); // 아이디를 먼저 입력하라는 에러 메시지
    }

    const inputSmsCode = e.target.value;
    setSmsCode(inputSmsCode);
  };

  // 휴대폰 인증 버튼 클릭 이벤트
  const handlePhoneAuthButtonClick = () => {
    // 휴대폰 번호가 11자리가 아닐 경우
    if (phone.length !== 11) {
      setPhoneError("휴대폰 번호 형식에 맞지 않습니다.");
      return;
    }

    // 휴대폰 인증번호 발송 API Request
    const formMailCertSmsRequest: FormMailCertSmsRequest = {
      userName,
      phone,
    };

    // 인증번호 발송 API 호출
    formMailCertSms(formMailCertSmsRequest).then((response) => {
      if (response?.code === "C000") {
        // 인증번호 발송 성공 시
        setIsCodeSent(true); // 인증번호 발송 상태 변경
        setVerificationMessage("휴대폰으로 인증번호가 발송되었습니다.");
      } else {
        // 인증번호 발송 실패 시
        setIsCodeSent(false); // 인증번호 발송 상태 변경
        setVerificationMessage("인증번호 발송에 실패했습니다.");
      }
    });
  };

  // 인증번호 확인 버튼 클릭 이벤트
  const handleAuthInputButtonClick = () => {
    // 인증번호 확인 API Request
    const jobsiteUserCertRequest: JobsiteUserCertRequest = {
      userName,
      phone,
      smsCode,
    };

    // 인증번호 확인 API 호출
    jobsiteUserCert(jobsiteUserCertRequest).then((response) => {
      if (response?.code === "C000") {
        setIsCodeConfirmed(true); // 인증 완료 상태 변경
        setVerificationMessage("휴대폰번호 확인이 완료 되었습니다.");
      } else if (response?.code === "C003") {
        setIsCodeConfirmed(false);
        setVerificationMessage(response?.message);
      } else {
        setIsCodeConfirmed(false);
        setVerificationMessage(
          "입력하신 인증번호가 일치하지 않습니다. 인증번호 확인 후 정확히 입력해주세요.",
        );
      }
    });
  };

  // 회원가입 버튼 클릭 이벤트
  const handleSignUpButtonClick = () => {
    let isValid = true; // 유효한지 여부

    // 아이디 확인
    if (!userName.trim()) {
      setUserNameError("이름을 입력해 주세요.");
      return;
    }

    // 생년월일 확인
    if (!birth || birthError) {
      setBirthError("생년월일 8자리를 입력해 주세요.");
      return;
    }

    // 성별 확인
    if (!gender) {
      setGenderError("성별을 체크해 주세요.");
      return;
    }

    // 비밀번호 확인
    if (!socialId && !socialType) {
      if (!userPwd || userPwdError || userPwd !== userPwdConfirm) {
        isValid = false;
      }
    }

    // 이메일 확인
    if (!email.trim()) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }

    // 이메일 유효성 확인
    if (!validateEmail(email)) {
      setEmailError("이메일 형식에 맞게 입력해주세요.");
      return;
    }

    // 휴대폰 번호 확인
    if (!phone || phoneError || !isCodeConfirmed) {
      isValid = false;
    }

    // 약관 동의 확인
    if (!agreements.age || !agreements.terms || !agreements.privacy) {
      setConfirmTitle("필수 약관 동의");
      setConfirmMessage("필수 약관에 동의해 주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 이메일 인증 확인
    if (emailDuplicateError && !emailVerified) {
      setConfirmTitle("이메일 인증");
      setConfirmMessage("이메일 인증을 완료해 주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 입력값이 없거나 유효하지 않은 경우
    if (!isValid) {
      setConfirmTitle("회원가입 실패");
      setConfirmMessage("입력 정보를 다시 확인해 주세요.");
      setIsConfirmPopupOpen(true);
      return;
    }

    // 회원가입 API Request
    const jobsiteUserJoinRequest: JobsiteUserJoinRequest = {
      userId,
      userPwd,
      userName,
      phone,
      email,
      gender,
      birth,
      agreeOver15: agreementsRequest.age,
      agreeTerms: agreementsRequest.terms,
      agreePrivacy: agreementsRequest.privacy,
      agreeSmsMarketing: agreementsRequest.marketingSms,
      agreeEmailMarketing: agreementsRequest.marketingEmail,
      socialId,
      socialType,
    };

    // 회원가입 API 호출
    jobsiteUserJoin(jobsiteUserJoinRequest).then((response) => {
      if (response) {
        if (response.code === "C000") {
          // 회원가입 성공 시 로그인 페이지로 이동
          navigate("/", {
            state: {
              title: "환영합니다!",
              popupMessage:
                "코티잡 가입을 축하합니다.\n고소득 알바\n신입, 경력단절 구직자를 위한\n모든 구직자와 함께하는\n코티잡 입니다.",
            },
            replace: true,
          });
        } else if (response.code === "E004") {
          // 약관 동의 실패 시
          setConfirmTitle("필수 약관 동의");
          setConfirmMessage("필수 약관에 동의해 주세요.");
          setIsConfirmPopupOpen(true);
        } else {
          // 회원가입 실패 시 에러 메시지 표시
          setConfirmTitle("회원가입 실패");
          setConfirmMessage(response.message);
          setIsConfirmPopupOpen(true);
        }
      }
    });
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 스크롤 감지를 위한 이벤트 리스너 추가
    const handleScroll = () => {
      // 스크롤 위치가 100 이상일 때 맨위로 이동 버튼 표시
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가

    return () => {
      // 스크롤 이벤트 리스너 해제
      window.removeEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 해제
    };
  }, []);

  // 약관 동의 상태 변경 시 실행
  useEffect(() => {
    setAgreementsRequest({
      age: agreements.age ? "Y" : "N",
      terms: agreements.terms ? "Y" : "N",
      privacy: agreements.privacy ? "Y" : "N",
      marketingSms: agreements.marketingSms ? "Y" : "N",
      marketingEmail: agreements.marketingEmail ? "Y" : "N",
    });
  }, [agreements]);

  // 소셜 로그인 시 최초 회원가입 팝업 표시
  useEffect(() => {
    if (socialId && socialType) {
      setConfirmTitle("알림");
      setConfirmMessage("최초 로그인 1회 한정 회원가입이 필요합니다.");
      setIsConfirmPopupOpen(true);
    }
  }, [socialId, socialType]);

  return (
    <div className="flex w-full flex-col px-[10px] pb-8 pt-[18px] pc:mx-auto pc:w-[600px] pc:px-0 pc:pt-[100px]">
      {/* 약관 동의 체크박스 */}
      <div className="flex w-full flex-col border border-solid border-normal">
        {/* 모두 동의 */}
        <div className="flex h-9 min-h-9 w-full items-center gap-[5px] border-b border-solid border-normal bg-white p-[10px]">
          <div
            className={`${allChecked ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
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

        {/* 만 15세 이상입니다 */}
        <div className="flex min-h-9 w-full items-center gap-[5px] p-[10px]">
          <div
            className={`${agreements.age ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
            onClick={() => handleCheckboxChange("age")}
          >
            {agreements.age ? (
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
            <span className="text-[#DC143C]">[필수]</span> 만 15세 이상입니다
          </label>
        </div>

        {/* 서비스 이용약관 동의 */}
        <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
          <div
            className={`${agreements.terms ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
            onClick={() => handleCheckboxChange("terms")}
          >
            {agreements.terms ? (
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
            <span className="text-[#DC143C]">[필수]</span> 서비스 이용약관 동의
          </label>
          <button
            type="button"
            className="absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 transform items-center justify-center"
            onClick={() => handleTermsOpenButtonClick("terms")}
          >
            <img
              src="/assets/images/icons/svg/right_arrow_bold.svg"
              alt="Open"
              className="w-2"
            />
          </button>
        </div>

        {/* 개인정보 수집 및 이용 동의 */}
        <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
          <div
            className={`${agreements.privacy ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
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
            <span className="text-[#DC143C]">[필수]</span> 개인정보 수집 및 이용
            동의
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

        {/* 광고성 정보 수신 동의 (SMS/MMS) */}
        <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
          <div
            className={`${agreements.marketingSms ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
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

        {/* 광고성 정보 수신 동의 (E-Mail) */}
        <div className="relative flex min-h-9 w-full items-center gap-[5px] p-[10px]">
          <div
            className={`${agreements.marketingEmail ? "bg-[#0099FF]" : "border border-solid border-normal bg-white"} flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-[3px]`}
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

      {/* 회원가입 폼 */}
      <div className="mt-[38px] flex w-full flex-col gap-5 pc:mt-[25px]">
        {/* 아이디 (소셜 로그인 시 아이디 입력 없음) */}
        {!socialId && !socialType && (
          <div className="flex w-full flex-col items-start gap-[6px]">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base">아이디</h2>
              <span className="text-sm text-[#666666]">
                (4~15자 영문, 숫자)
              </span>
            </div>
            <div
              className={`${userIdError ? "border-[#DC143C]" : "border-normal"} min-h-10 w-full rounded border border-solid bg-white px-[10px]`}
            >
              <input
                type="text"
                className="h-full w-full text-xs"
                value={userId}
                onChange={handleUserIdChange}
              />
            </div>
            {userIdError && (
              <p className="text-xxs text-[#DC143C]">{userIdError}</p>
            )}
            {isAvailable && (
              <p className="text-xxs text-[#0099FF]">
                사용 가능한 아이디입니다.
              </p>
            )}
          </div>
        )}

        {/* 비밀번호 (소셜 로그인 시 비밀번호 입력 없음) */}
        {!socialId && !socialType && (
          <div className="flex w-full flex-col items-start gap-[6px]">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base">비밀번호</h2>
              <span className="text-sm text-[#666666]">
                (8~15자 영문, 숫자, 특수문자 조합)
              </span>
            </div>
            <div
              className={`${userPwdError ? "border-[#DC143C]" : "border-normal"} min-h-10 w-full rounded border border-solid bg-white px-[10px]`}
            >
              <input
                type="password"
                className="h-full w-full text-xs"
                placeholder="비밀번호 입력"
                value={userPwd || ""}
                onChange={handlePasswordChange}
              />
            </div>
            {userPwdError && (
              <p className="text-xxs text-[#DC143C]">{userPwdError}</p>
            )}
            {securityLevel && (
              <p className="text-xxs text-[#0099FF]">{securityLevel}</p>
            )}
            <div
              className={`${userPwdConfirmError ? "border-[#DC143C]" : "border-normal"} min-h-10 w-full rounded border border-solid bg-white px-[10px]`}
            >
              <input
                type="password"
                className="h-full w-full text-xs"
                placeholder="비밀번호 재입력"
                value={userPwdConfirm || ""}
                onChange={handlePasswordConfirmChange}
              />
            </div>
            {userPwdConfirmError && (
              <p className="text-xxs text-[#DC143C]">{userPwdConfirmError}</p>
            )}
          </div>
        )}

        {/* 이름 */}
        <div className="flex w-full flex-col items-start gap-[6px]">
          <h2 className="text-base">이름</h2>
          <div className="min-h-10 w-full rounded border border-solid border-normal bg-white px-[10px]">
            <input
              type="text"
              className="h-full w-full text-xs"
              value={userName || ""}
              onChange={handleNameChange}
            />
          </div>

          {userNameError && (
            <p className="text-xxs text-[#DC143C]">{userNameError}</p>
          )}
        </div>

        {/* 생년월일 / 성별 */}
        <div className="flex w-full flex-col items-start gap-[6px]">
          <h2 className="text-base">생년월일 (8자리 숫자) / 성별</h2>
          <div className="flex min-h-10 w-full items-center gap-2.5">
            <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
              <input
                type="text"
                className="h-full w-full text-xs"
                placeholder="‘-’없이 입력 예시) 19990123"
                value={birth}
                onChange={handleBirthChange}
                inputMode="numeric"
              />
            </div>
            <div className="flex h-full items-center gap-2.5">
              <button
                type="button"
                className={`${gender === "남자" ? "bg-[#DC143C33]" : "bg-white"} flex h-full min-w-[50px] items-center justify-center rounded border border-solid border-normal text-base`}
                onClick={() => handleGenderChange("남자")}
              >
                남자
              </button>
              <button
                type="button"
                className={`${gender === "여자" ? "bg-[#DC143C33]" : "bg-white"} flex h-full min-w-[50px] items-center justify-center rounded border border-solid border-normal text-base`}
                onClick={() => handleGenderChange("여자")}
              >
                여자
              </button>
            </div>
          </div>
          {birthError && (
            <p className="text-xxs text-[#DC143C]">{birthError}</p>
          )}
          {genderError && (
            <p className="text-xxs text-[#DC143C]">{genderError}</p>
          )}
        </div>

        {/* 이메일 주소 */}
        <div className="flex w-full flex-col items-start gap-[6px]">
          <h2 className="text-base">이메일 주소</h2>
          <div className="flex min-h-10 w-full items-center gap-2.5">
            <div className="h-full w-full rounded border border-solid border-normal bg-white px-[10px]">
              <input
                type="email"
                className="h-full w-full text-xs"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <button
              type="button"
              className="h-full min-w-[110px] rounded bg-[#10B981] text-sm text-white disabled:bg-opacity-50"
              onClick={handleEmailCheckButtonClick}
              disabled={isEmailAvailable && !emailDuplicateError}
            >
              {!isEmailAvailable && "중복확인"}
              {isEmailAvailable && !emailDuplicateError && "중복확인"}
              {isEmailAvailable && emailDuplicateError && "인증메일 전송"}
            </button>
          </div>
          {emailCodeSent && (
            <div className="mt-[10px] flex min-h-10 w-full items-center gap-2.5">
              <div
                className={`${!emailCodeSent || emailVerified ? "bg-gray-200" : "bg-white"} h-full w-full rounded border border-solid border-normal px-[10px]`}
              >
                <input
                  type="text"
                  className="h-full w-full text-xs disabled:bg-transparent"
                  placeholder="인증번호 입력"
                  value={emailCode}
                  onChange={handleEmailCodeChange}
                  disabled={!emailCodeSent || emailVerified}
                  inputMode="numeric"
                />
              </div>
              <button
                type="button"
                className="h-full min-w-[110px] whitespace-nowrap rounded bg-[#0099FF] text-sm text-white disabled:bg-opacity-50"
                onClick={handleEmailAuthButtonClick}
                disabled={!emailCodeSent || emailVerified}
              >
                인증번호 확인
              </button>
            </div>
          )}
          {emailError && (
            <p className="text-xxs text-[#DC143C]">{emailError}</p>
          )}
          {isEmailAvailable && !emailDuplicateError && (
            <p className="text-xxs text-[#0099FF]">사용 가능한 이메일입니다.</p>
          )}
          {emailDuplicateError && !emailVerified && (
            <p className="text-xxs font-semibold text-[#DC143C]">
              {emailDuplicateError}
            </p>
          )}
          {emailDuplicateMessage && !emailVerified && (
            <p className="text-xxs text-[#DC143C]">{emailDuplicateMessage}</p>
          )}
        </div>

        {/* 휴대폰 인증 */}
        <div className="flex w-full flex-col items-start gap-[6px]">
          <h2 className="text-base">휴대폰 인증</h2>
          <div className="flex min-h-10 w-full items-center gap-2.5">
            <div
              className={`${isCodeConfirmed ? "bg-gray-200" : "bg-white"} h-full w-full rounded border border-solid border-normal px-[10px]`}
            >
              <input
                type="text"
                className="h-full w-full text-xs disabled:bg-transparent"
                placeholder="휴대폰 번호 '-' 없이 입력하세요"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                disabled={isCodeConfirmed}
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              className="h-full min-w-[110px] rounded bg-[#10B981] text-sm text-white disabled:bg-opacity-50"
              onClick={handlePhoneAuthButtonClick}
              disabled={isCodeConfirmed}
            >
              {isCodeSent ? "재전송" : "인증하기"}
            </button>
          </div>
          <div className="mt-[10px] flex min-h-10 w-full items-center gap-2.5">
            <div
              className={`${!isCodeSent || isCodeConfirmed ? "bg-gray-200" : "bg-white"} h-full w-full rounded border border-solid border-normal px-[10px]`}
            >
              <input
                type="text"
                className="h-full w-full text-xs disabled:bg-transparent"
                placeholder="인증번호 입력"
                value={smsCode}
                onChange={handleSmsCodeChange}
                disabled={!isCodeSent || isCodeConfirmed}
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              className="h-full min-w-[110px] whitespace-nowrap rounded bg-[#0099FF] text-sm text-white disabled:bg-opacity-50"
              onClick={handleAuthInputButtonClick}
              disabled={!isCodeSent || isCodeConfirmed}
            >
              인증번호 확인
            </button>
          </div>
          {phoneError && (
            <p className="text-xxs text-[#DC143C]">{phoneError}</p>
          )}
          {verificationMessage && (
            <p className="text-xxs text-[#0099FF]">{verificationMessage}</p>
          )}
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="button"
        className="mt-[52px] min-h-12 w-full rounded bg-[#DC143C] text-xl font-bold text-white pc:mt-5"
        onClick={handleSignUpButtonClick}
      >
        회원가입
      </button>

      {/* 약관 모달 */}
      {isTermsOpen && (
        <ModalPopup
          closeModal={() => setIsTermsOpen(false)}
          isTerms={selectedTerms === "terms"}
          privacyConsentPersonal={selectedTerms === "privacy"}
          smsPersonal={selectedTerms === "marketingSms"}
          emailPersonal={selectedTerms === "marketingEmail"}
        />
      )}

      {/* 확인 팝업 */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )}

      {/* 맨 위로 이동 */}
      {showScrollButton && (
        <button
          type="button"
          className={`${isMobileScreen ? "bottom-4 right-4" : "bottom-28 right-20"} fixed flex items-center justify-center`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/assets/images/icons/svg/move_to_top.svg"
            alt="Move to Top"
            className="h-8 w-8"
          />
        </button>
      )}
    </div>
  );
}

export default SignUpContent;
