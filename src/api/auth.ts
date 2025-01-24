import api from "./baseUrl";

export interface DefaultResponse {
  code: string;
  message: string;
}

export interface FormMailCertSmsRequest {
  userName: string;
  phone: string;
}

export interface JobsiteUserCertRequest {
  userName: string;
  phone: string;
  smsCode: string;
}

export interface JobsiteUserJoinRequest {
  userId: string;
  userPwd: string;
  userName: string;
  phone: string;
  email: string;
  address?: string;
  sido?: string;
  sigungu?: string;
  gender: string;
  birth: string;
  photo?: string;
  marketing?: string;
  addressDetail?: string;
  agreeOver15: "Y" | "N";
  agreeTerms: "Y" | "N";
  agreePrivacy: "Y" | "N";
  agreeSmsMarketing?: "Y" | "N";
  agreeEmailMarketing?: "Y" | "N";
  socialId?: string;
  socialType?: string;
}

export interface JobsiteUserLoginRequest {
  userId: string;
  userPwd: string;
}

export interface JobsiteUserLoginResponse {
  code: string;
  message: string;
  user?: {
    userId: string;
    userName: string;
    phone: string;
    role: string;
    email: string;
  };
}

export interface CommonSendEmailRequest {
  to: string;
  subject: string;
}

export interface JobsiteUserCertEmailRequest {
  email: string;
  emailCode: string;
}

export interface JobsiteCommonExperCookieResponse {
  code: string;
  message: string;
  limit: string;
}

export interface JobsiteUserResignRequest {
  userId: string;
}

// 본인인증 (문자 전송)
export const formMailCertSms = async (
  formMailCertSmsRequest: FormMailCertSmsRequest,
) => {
  const { userName, phone } = formMailCertSmsRequest;

  try {
    const response = await api.post<DefaultResponse>("/formMail/cert/sms", {
      userName,
      phone,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 연락처로 본인인증 인증번호 일치하는지 확인
export const jobsiteUserCert = async (
  jobsiteUserCertRequest: JobsiteUserCertRequest,
) => {
  const { userName, phone, smsCode } = jobsiteUserCertRequest;

  try {
    const response = await api.post<DefaultResponse>("/jobsite/user/cert", {
      userName,
      phone,
      smsCode,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트 회원 가입
export const jobsiteUserJoin = async (
  jobsiteUserJoinRequest: JobsiteUserJoinRequest,
) => {
  const {
    userId,
    userPwd,
    userName,
    phone,
    email,
    address,
    sido,
    sigungu,
    gender,
    birth,
    photo,
    marketing,
    addressDetail,
    agreeOver15,
    agreeTerms,
    agreePrivacy,
    agreeSmsMarketing,
    agreeEmailMarketing,
    socialId,
    socialType,
  } = jobsiteUserJoinRequest;

  try {
    const response = await api.post<DefaultResponse>("/jobsite/user/join", {
      userId,
      userPwd,
      userName,
      phone,
      email,
      address,
      sido,
      sigungu,
      gender,
      birth,
      photo,
      marketing,
      addressDetail,
      agreeOver15,
      agreeTerms,
      agreePrivacy,
      agreeSmsMarketing,
      agreeEmailMarketing,
      socialId,
      socialType,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트 회원 로그인
export const jobsiteUserLogin = async (
  jobsiteUserLoginRequest: JobsiteUserLoginRequest,
) => {
  const { userId, userPwd } = jobsiteUserLoginRequest;

  try {
    const response = await api.post<JobsiteUserLoginResponse>(
      "/jobsite/user/login",
      {
        userId,
        userPwd,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 이메일 전송
export const commonSendEmail = async (
  commonSendEmailRequest: CommonSendEmailRequest,
) => {
  const { to, subject } = commonSendEmailRequest;

  try {
    const response = await api.post<DefaultResponse>("/common/send/email", {
      to,
      subject,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 이메일 본인인증 확인
export const jobsiteUserCertEmail = async (
  jobsiteUserCertEmailRequest: JobsiteUserCertEmailRequest,
) => {
  const { email, emailCode } = jobsiteUserCertEmailRequest;

  try {
    const response = await api.post<DefaultResponse>(
      "/jobsite/user/cert/email",
      {
        email,
        emailCode,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 회원 탈퇴하기
export const jobsiteUserResign = async (
  jobsiteUserResignRequest: JobsiteUserResignRequest,
) => {
  const { userId } = jobsiteUserResignRequest;

  try {
    const response = await api.delete<DefaultResponse>("/jobsite/user/resign", {
      data: {
        userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// JWT Access 토큰 및 쿠키 재발급 요청
export const jobsiteCommonReissuAccessToken = async () => {
  try {
    const response = await api.get<DefaultResponse>(
      "/jobsite/common/reissu/AccessToken",
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// JWT 쿠키 만료 시간 확인
export const jobsiteCommonExperCookie = async () => {
  try {
    const response = await api.get<JobsiteCommonExperCookieResponse>(
      "/jobsite/common/exper_cookie",
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트 회원 로그아웃
export const jobsiteUserLogout = async () => {
  try {
    await api.post<DefaultResponse>("/jobsite/user/logout");

    localStorage.removeItem("authState");
  } catch (error) {
    console.error(error);
  }
};
