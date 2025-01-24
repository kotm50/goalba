import { useMediaQuery } from "@react-hook/media-query";
import LoginContent from "../../components/LoginContent";
import TopBarPC from "../../components/TopBarPC";
import { useEffect } from "react";
import { checkAndReissueToken } from "../../api/baseUrl";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const { state } = useAuth();
  const isLoggedIn = state.isLoggedIn;

  const isMobileScreen = useMediaQuery("screen and (max-width: 1239px)");

  // 이미 로그인 되어있으면 메인 페이지로 이동
  if (isLoggedIn) {
    window.location.href = "/";
  }

  useEffect(() => {
    checkAndReissueToken(); // 토큰 체크
  }, []);
  return (
    <>
      {isMobileScreen || <TopBarPC />}
      <LoginContent />
    </>
  );
}

export default Login;
