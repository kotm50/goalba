import { createContext, useContext, useEffect, useReducer } from "react";

// User 타입 정의
interface User {
  userId: string;
  userName: string;
  role: string;
  phone: string;
  email: string;
}

// 스토리지에 저장할 상태 타입 정의
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  showOneMinuteModal: boolean;
  oneMinuteModalShown: boolean;
  showFiveMinuteModal: boolean;
  fiveMinuteModalShown: boolean;
  logoutModalShown: boolean;
}

// dispatch 함수의 action 및 payload 타입 정의
interface AuthAction {
  type:
    | "LOGIN" //  로그인
    | "LOGOUT" // 로그아웃
    | "SET_USER" // 기존 상태 유지
    | "SHOW_ONE_MINUTE_MODAL" // 1분 모달 표시
    | "HIDE_ONE_MINUTE_MODAL" // 1분 모달 숨김
    | "RESET_ONE_MINUTE_MODAL" // 1분 모달 초기화
    | "SHOW_FIVE_MINUTE_MODAL" // 5분 모달 표시
    | "HIDE_FIVE_MINUTE_MODAL" // 5분 모달 숨김
    | "RESET_FIVE_MINUTE_MODAL" // 5분 모달 초기화
    | "SHOW_LOGOUT_MODAL" // 로그아웃 모달 표시
    | "HIDE_LOGOUT_MODAL"; // 로그아웃 모달 숨김
  payload?: User;
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload || null,
      };
    case "LOGOUT":
      localStorage.removeItem("authState");
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        oneMinuteModalShown: false, // 로그아웃 시 1분 모달 초기화
        fiveMinuteModalShown: false, // 로그아웃 시 5분 모달 초기화
      };
    case "SET_USER":
      return {
        ...state,
      };
    case "SHOW_ONE_MINUTE_MODAL":
      if (state.oneMinuteModalShown) return state; // 이미 표시된 상태라면 리턴

      return {
        ...state,
        showOneMinuteModal: true,
        oneMinuteModalShown: true,
      };
    case "HIDE_ONE_MINUTE_MODAL":
      return {
        ...state,
        showOneMinuteModal: false,
      };
    case "RESET_ONE_MINUTE_MODAL":
      return {
        ...state,
        oneMinuteModalShown: false,
        fiveMinuteModalShown: false,
      };
    case "SHOW_FIVE_MINUTE_MODAL":
      if (state.fiveMinuteModalShown) return state;

      return {
        ...state,
        showFiveMinuteModal: true,
        fiveMinuteModalShown: true,
      };
    case "HIDE_FIVE_MINUTE_MODAL":
      return {
        ...state,
        showFiveMinuteModal: false,
      };
    case "RESET_FIVE_MINUTE_MODAL":
      return {
        ...state,
        oneMinuteModalShown: false,
        fiveMinuteModalShown: false,
      };
    case "SHOW_LOGOUT_MODAL":
      return {
        ...state,
        logoutModalShown: true,
      };
    case "HIDE_LOGOUT_MODAL":
      return {
        ...state,
        logoutModalShown: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    authReducer,
    loadStateFromLocalStorage(),
  );

  // 상태를 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(state));
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 로컬 스토리지에서 상태 로드
function loadStateFromLocalStorage(): AuthState {
  const storedState = localStorage.getItem("authState");
  return storedState
    ? JSON.parse(storedState)
    : {
        isLoggedIn: false,
        user: null,
        showOneMinuteModal: false,
        oneMinuteModalShown: false,
        showFiveMinuteModal: false,
        fiveMinuteModalShown: false,
        logoutModalShown: false,
      };
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
