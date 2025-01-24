import api from "./baseUrl";

export interface DefaultResponse {
  code: string;
  message: string;
}

export interface UserDto {
  userId: string;
  userName: string;
  phone: string;
  email?: string;
  address: string;
  sido: string;
  sigungu: string;
  gender: string;
  birth: string;
  photo?: string;
  marketing?: string;
  addressDetail?: string;
}

export interface JobsiteUserFindOneResponse {
  code: string;
  message: string;
  user?: UserDto;
}

export interface JobsiteUserUpdateRequest {
  userId: string;
  userPwd: string;
  userName?: string;
  phone?: string;
  email?: string;
  address?: string;
  sido?: string;
  sigungu?: string;
  gender?: string;
  birth?: string;
  photo?: string;
  marketing?: string;
  addressDetail?: string;
  agreeOver15?: string;
  agreeTerms?: string;
  agreePrivacy?: string;
  agreeSmsMarketing?: string;
  agreeEmailMarketing?: string;
}

export interface JobsiteUserUpdateResponse {
  code: string;
  message: string;
  user?: UserDto;
}

export interface JobsiteUserFindIdRequest {
  userName: string;
  email?: string;
  phone?: string;
}

export interface JobsiteUserFindIdResponse {
  code: string;
  message: string;
  jobsiteUserList: JobsiteUser[];
  totalCount: number;
}

export interface JobsiteUser {
  userId: string;
  createdAt: string;
}

export interface JobsiteUserFindIdBeforeCertRequest {
  userName: string;
  email?: string;
  phone?: string;
}

export interface JobsiteUserFindPwdRequest {
  userId: string;
  userName: string;
  email?: string;
  phone?: string;
}

export interface JobsiteUserUpdatePwdRequest {
  userPwd: string;
  userId: string;
  userName: string;
  email?: string;
  phone?: string;
}

export interface JobsiteUserChangePwdRequest {
  userPwd: string;
  userId: string;
  userNewPwd: string;
}

// 잡사이트 회원 한 명 정보 조회
export const jobsiteUserFindOne = async (userId: string) => {
  try {
    const response = await api.post<JobsiteUserFindOneResponse>(
      "/jobsite/user/findOne",
      {
        userId,
      },
    );

    if (response.data.user) {
      return response.data.user;
    }
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트 회원 수정
export const jobsiteUserUpdate = async (
  jobsiteUserUpdateRequest: JobsiteUserUpdateRequest,
) => {
  const { userId, userPwd, ...rest } = jobsiteUserUpdateRequest;

  try {
    const response = await api.put<JobsiteUserUpdateResponse>(
      "/jobsite/user/update",
      {
        userId,
        userPwd,
        ...rest,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 본인인증 성공 시 회원 Id 찾기
export const jobsiteUserFindId = async (
  jobsiteUserFindIdRequest: JobsiteUserFindIdRequest,
) => {
  const { userName, email, phone } = jobsiteUserFindIdRequest;

  try {
    const response = await api.post<JobsiteUserFindIdResponse>(
      "/jobsite/user/find/id",
      {
        userName,
        email,
        phone,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ID 중복인지 확인
export const jobsiteUserCheckId = async (userId: string) => {
  try {
    const response = await api.post<DefaultResponse>("/jobsite/user/check/id", {
      userId,
    });

    return response.data.code;
  } catch (error) {
    console.error(error);
  }
};

// 회원가입시 email 중복 체크하는 API
export const jobsiteUserCheckEmail = async (email: string) => {
  try {
    const response = await api.post<DefaultResponse>(
      "/jobsite/user/check/email",
      { email },
    );

    return response.data.code;
  } catch (error) {
    console.error(error);
  }
};

// 아이디 찾기시 등록된 계정 확인
export const jobsiteUserFindIdBeforeCert = async (
  jobsiteUserFindIdBeforeCertRequest: JobsiteUserFindIdBeforeCertRequest,
) => {
  const { userName, ...rest } = jobsiteUserFindIdBeforeCertRequest;

  try {
    const response = await api.post<DefaultResponse>(
      "/jobsite/user/find/id/before/cert",
      {
        userName,
        ...rest,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 비밀번호 찾기시 등록된 계정 확인
export const jobsiteUserFindPwd = async (
  jobsiteUserFindPwdRequest: JobsiteUserFindPwdRequest,
) => {
  const { userId, userName, ...rest } = jobsiteUserFindPwdRequest;

  try {
    const response = await api.post<DefaultResponse>("/jobsite/user/find/pwd", {
      userId,
      userName,
      ...rest,
    });

    return response.data.code;
  } catch (error) {
    console.error(error);
  }
};

// 비밀번호 찾기시 비밀번호 변경하기
export const jobsiteUserUpdatePwd = async (
  jobsiteUserUpdatePwdRequest: JobsiteUserUpdatePwdRequest,
) => {
  const { userPwd, userName, ...rest } = jobsiteUserUpdatePwdRequest;

  try {
    const response = await api.put<DefaultResponse>(
      "/jobsite/user/update/pwd",
      {
        userPwd,
        userName,
        ...rest,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 회원 정보 수정시 비밀번호 변경하기
export const jobsiteUserChangePwd = async (
  jobsiteUserChangePwdRequest: JobsiteUserChangePwdRequest,
) => {
  const { userPwd, userId, userNewPwd } = jobsiteUserChangePwdRequest;

  try {
    const response = await api.put<DefaultResponse>(
      "/jobsite/user/change/pwd",
      {
        userPwd,
        userId,
        userNewPwd,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 비밀번호 변경창 누를때, 소셜 로그인인지 체크
export const jobsiteUserCheckSocial = async (userId: string) => {
  try {
    const response = await api.post<DefaultResponse>(
      "jobsite/user/check/social",
      {
        userId,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
