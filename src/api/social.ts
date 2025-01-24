import api from "./baseUrl";

const API_URL = import.meta.env.VITE_API_URL;

export interface JobsiteUserLoginNaverResponse {
  code: string;
  message: string;
  socialId?: string;
  socialType?: string;
  user?: {
    userId: string;
    userName: string;
    phone: string;
    role: string;
    email: string;
  };
}

// 네이버 로그인 창 띄우기
export const socialLoginNaverStart = async () => {
  try {
    window.location.href = `${API_URL}v1/social/login/naver/start`;
  } catch (error) {
    console.error(error);
  }
};

// 카카오 로그인 창 띄우기
export const socialLoginKakaoStart = async () => {
  try {
    window.location.href = `${API_URL}v1/social/login/kakao/start`;
  } catch (error) {
    console.error(error);
  }
};

// Facebook 로그인 창 띄우기
export const socialLoginFacebookStart = async () => {
  try {
    window.location.href = `${API_URL}v1/social/login/facebook/start`;
  } catch (error) {
    console.error(error);
  }
};

// 구글 로그인 창 띄우기
export const socialLoginGoogleStart = async () => {
  try {
    window.location.href = `${API_URL}v1/social/login/google/start`;
  } catch (error) {
    console.error(error);
  }
};

// 네이버 로그인 결과 처리
export const jobsiteUserLoginNaver = async (code: string) => {
  try {
    const response = await api.get<JobsiteUserLoginNaverResponse>(
      `/jobsite/user/login/naver?code=${code}`,
    );

    return response.data;
  } catch (error) {
    console.error("네이버 로그인 에러", error);
    throw error;
  }
};

// 카카오 로그인 결과 처리
export const jobsiteUserLoginKakao = async (code: string) => {
  try {
    const response = await api.get(`/jobsite/user/login/kakao?code=${code}`);

    return response.data;
  } catch (error) {
    console.error("카카오 로그인 에러", error);
  }
};

// 구글 로그인 결과 처리
export const jobsiteUserLoginGoogle = async (code: string) => {
  try {
    const response = await api.get(`/jobsite/user/login/google?code=${code}`);

    return response.data;
  } catch (error) {
    console.error("구글 로그인 에러", error);
    throw error;
  }
};

// 페이스북 로그인 결과 처리
export const jobsiteUserLoginFacebook = async (code: string) => {
  try {
    const response = await api.get(`/jobsite/user/login/facebook?code=${code}`);

    return response.data;
  } catch (error) {
    console.error("페이스북 로그인 에러", error);
    throw error;
  }
};
