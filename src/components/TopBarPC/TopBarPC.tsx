import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function TopBarPC() {
  const navigate = useNavigate();

  return (
    <div className="fixed z-10 flex h-[79px] w-full items-center bg-white">
      <div className="mx-auto w-full max-w-[1240px]">
        <h1
          className="cursor-pointer py-2 text-[32px] text-[#DC143C]"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="고알바" className="h-[36px]" />
        </h1>
      </div>
    </div>
  );
}

export default TopBarPC;
