import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import JobList from "./pages/JobList";
import SalaryCalc from "./pages/SalaryCalc";
import WeeklyHoliday from "./pages/WeeklyHoliday";
import Notice from "./pages/Notice";
import NoticeDetail from "./pages/NoticeDetail";
import Faq from "./pages/Faq";
import UserService from "./pages/UserService";
import Scrape from "./pages/Scrape";
import UpdateProfile from "./pages/UpdateProfile";
import ResetPwd from "./pages/ResetPwd";
import JobDetail from "./pages/JobDetail";
import SearchResult from "./pages/SearchResult";
import FindIdResult from "./pages/FindIdResult";
import FindId from "./pages/FindId";
import FindPassword from "./pages/FindPassword";
import Recommend from "./pages/Recommend";
import Region from "./pages/Region";
import { RecoilRoot } from "recoil";
import { useAuth } from "./contexts/AuthContext";
import { setDispatch } from "./api/baseUrl";
import Short from "./pages/Short";
import Favorite from "./pages/Favorite";
import Recent from "./pages/Recent";
import Urgent from "./pages/Urgent";
import Custom from "./pages/Custom";
import ExpirationOneMinuteModal from "./components/ExpirationOneMinuteModal";
import ConfirmPopup from "./components/ConfirmPopup";
import NaverLoginHandler from "./components/Social/NaverLoginHandler";
import KakaoLoginHandler from "./components/Social/KakaoLoginHandler";
import GoogleLoginHandler from "./components/Social/GoogleLoginHandler";
import FacebookLoginHandler from "./components/Social/FacebookLoginHandler";
import ExpirationFiveMinuteModal from "./components/ExpirationFiveMinuteModal";

function App() {
  const { state, dispatch } = useAuth();
  setDispatch(dispatch); // dispatch 전달!

  return (
    <RecoilRoot>
      <Routes>
        {/* 메인페이지 */}
        <Route path="/" element={<Main />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        {/* 소셜 로그인 */}
        <Route path="/naver-login" element={<NaverLoginHandler />} />
        <Route path="/kakao-login" element={<KakaoLoginHandler />} />
        <Route path="/google-login" element={<GoogleLoginHandler />} />
        <Route path="/facebook-login" element={<FacebookLoginHandler />} />

        {/* 회원가입 */}
        <Route path="/signup" element={<SignUp />} />

        {/* 공고 리스트 */}
        <Route path="/joblist" element={<JobList />} />

        {/* 공고 상세 페이지 */}
        <Route path="/joblist/:id" element={<JobDetail />} />

        {/* 추천 공고 */}
        <Route path="/recommend" element={<Recommend />} />

        {/* 단기 공고 */}
        <Route path="/short" element={<Short />} />

        {/* 급구 공고 */}
        <Route path="/urgent" element={<Urgent />} />

        {/* 맞춤 공고 */}
        <Route path="/custom" element={<Custom />} />

        {/* 지역별 공고 */}
        <Route path="/region" element={<Region />} />

        {/* 검색 결과 */}
        <Route path="/search" element={<SearchResult />} />

        {/* 급여 계산기 */}
        <Route path="/salary" element={<SalaryCalc />} />

        {/* 주휴수당 계산기 */}
        <Route path="/weekly" element={<WeeklyHoliday />} />

        {/* 공지사항 */}
        <Route path="/notice" element={<Notice />} />

        {/* 공지사항 상세 */}
        <Route path="/notice/:id" element={<NoticeDetail />} />

        {/* FAQ */}
        <Route path="faq" element={<Faq />} />

        {/* 회원 서비스 */}
        <Route path="/service" element={<UserService />} />

        {/* 스크랩 */}
        <Route path="/scrape" element={<Scrape />} />

        {/* 좋아요 */}
        <Route path="/favorite" element={<Favorite />} />

        {/* 최근 열람 공고 */}
        <Route path="/recent" element={<Recent />} />

        {/* 개인정보수정 / 비밀번호변경 / 회원탈퇴신청 */}
        <Route path="/edit" element={<UpdateProfile />} />

        {/* 아이디 찾기 */}
        <Route path="/help/find/id" element={<FindId />} />

        {/* 비밀번호 찾기 */}
        <Route path="/help/find/pwd" element={<FindPassword />} />

        {/* 아이디 찾기 결과 */}
        <Route path="/help/find/id/result" element={<FindIdResult />} />

        {/* 비밀번호 재설정 */}
        <Route path="/help/reset" element={<ResetPwd />} />
      </Routes>

      {/* 토큰 만료 (1분) 모달 */}
      {state.showOneMinuteModal && (
        <ExpirationOneMinuteModal
          onClose={() => dispatch({ type: "HIDE_ONE_MINUTE_MODAL" })}
        />
      )}
      {/* 토큰 만료 (5분) 모달 */}
      {state.showFiveMinuteModal && (
        <ExpirationFiveMinuteModal
          onClose={() => dispatch({ type: "HIDE_FIVE_MINUTE_MODAL" })}
        />
      )}
      {/* 로그아웃 모달 */}
      {state.logoutModalShown && (
        <ConfirmPopup
          title={"알림"}
          message={"장시간 활동이 없어 로그아웃되었습니다."}
          onClose={() => dispatch({ type: "HIDE_LOGOUT_MODAL" })}
        />
      )}
    </RecoilRoot>
  );
}

export default App;
