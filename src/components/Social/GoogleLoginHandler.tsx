import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { jobsiteUserLoginGoogle } from "../../api/social";

function GoogleLoginHandler() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const code = new URL(window.location.href).searchParams.get("code"); // URL에서 code 파라미터 추출

  // code가 있을 경우 구글 로그인 요청
  useEffect(() => {
    if (code) {
      jobsiteUserLoginGoogle(code).then((response) => {
        if (response) {
          if (
            response.code === "C003" &&
            response.socialId &&
            response.socialType
          ) {
            // 회원가입이 되어있지 않은 경우
            navigate("/signup", {
              state: {
                socialId: response.socialId,
                socialType: response.socialType,
              },
            });
          } else if (response.code === "C000" && response.user) {
            // 회원가입이 되어 있는 경우
            dispatch({ type: "LOGIN", payload: response.user }); // 로그인 처리

            navigate("/");
          } else if (response.code === "C001") {
            // 이미 로그인 되어 있는 경우
            dispatch({ type: "SET_USER" }); // 기존 상태 유지

            navigate("/");
          } else {
            // 그 외의 경우
            navigate("/login");

            console.error("구글 로그인 에러", response);
          }
        }
      });
    }
  }, [code]);

  return <div></div>;
}

export default GoogleLoginHandler;
