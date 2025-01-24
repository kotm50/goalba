import axios from "axios";
import { jobsiteCommonExperCookie, jobsiteUserLogout } from "../auth";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// dispatchRef
let dispatchRef: React.Dispatch<any>; // dispatch를 저장할 변수

export const setDispatch = (dispatch: React.Dispatch<any>) => {
  dispatchRef = dispatch;
};

// 만료 시간 체크 중복 방지
let isCheckingExpiration = false;

// JWT 만료 시간을 확인하고 필요 시 AccessToken 재발급
export const checkAndReissueToken = async () => {
  if (isCheckingExpiration) return; // 중복 실행 방지
  isCheckingExpiration = true;

  try {
    // 쿠키 만료 시간 확인 API 호출
    const response = await jobsiteCommonExperCookie();

    if (response) {
      const expirationTime = parseInt(response.limit, 10); // 만료 시간 (초)

      // 5분 이상 남은 경우
      if (expirationTime > 300) {
        dispatchRef({ type: "SET_USER" }); // 기존 상태 유지

        return;
      }

      // 만료된 경우
      if (expirationTime <= 0) {
        dispatchRef({ type: "LOGOUT", payload: null });

        // 현재 로그인 상태 확인
        const authState = JSON.parse(localStorage.getItem("authState") || "{}");
        if (authState.isLoggedIn) {
          dispatchRef({ type: "SHOW_LOGOUT_MODAL" });
        }
        return;
      }

      // 남은 시간이 5분(300초) 이하라면 5분 경고 표시
      if (expirationTime > 60 && expirationTime <= 300) {
        const authState = JSON.parse(localStorage.getItem("authState") || "{}");
        if (!authState.fiveMinuteModalShown) {
          dispatchRef({ type: "SHOW_FIVE_MINUTE_MODAL" });
        }
      }

      // 남은 시간이 1분(60초) 이하라면 AccessToken 재발급
      if (expirationTime <= 60) {
        const authState = JSON.parse(localStorage.getItem("authState") || "{}");
        if (!authState.oneMinuteModalShown) {
          dispatchRef({ type: "SHOW_ONE_MINUTE_MODAL" });
        }
        // await jobsiteCommonReissuAccessToken();
      }
    }
  } catch (error) {
    console.error("토큰 만료 시간 확인 실패:", error);
    dispatchRef({ type: "LOGOUT", payload: null });

    // 현재 로그인 상태 확인
    const authState = JSON.parse(localStorage.getItem("authState") || "{}");
    if (authState.isLoggedIn) {
      dispatchRef({ type: "SHOW_LOGOUT_MODAL" });
    }
  } finally {
    isCheckingExpiration = false;
  }
};

// Request 인터셉터
api.interceptors.request.use(
  async (config) => {
    // 특정 API 경로에서는 checkAndReissueToken 실행하지 않음
    const excludedPaths = ["/jobsite/user/login"];

    if (!excludedPaths.some((path) => config.url?.includes(path))) {
      await checkAndReissueToken();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response 인터셉터
api.interceptors.response.use(
  async (response) => {
    const { code } = response.data;
    if (window.location.pathname !== "/login") {
      if (code === "E401") {
        console.warn("Access Token 만료");

        // 로그아웃 API 호출
        jobsiteUserLogout();

        // 상태 업데이트
        dispatchRef({ type: "LOGOUT", payload: null });

        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
      }
    }

    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default api;
