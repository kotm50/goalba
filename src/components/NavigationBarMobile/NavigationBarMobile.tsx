import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegionMenuMobile from "../RegionMenuMobile";

// 네비게이션 아이템 (단기, 급구, 맞춤)
const NAV_ITEMS = [
  {
    imgPath: "/assets/images/icons/svg/short.svg",
    title: "단기",
    alt: "Short Term",
    navigate: "/short",
  },
  {
    imgPath: "/assets/images/icons/svg/urgent.svg",
    title: "급구",
    alt: "Urgent Request",
    navigate: "/urgent",
  },
  {
    imgPath: "/assets/images/icons/svg/custom.svg",
    title: "맞춤",
    alt: "Custom",
    navigate: "/custom",
  },
];

function NavigationBarMobile() {
  const navigate = useNavigate();

  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState<boolean>(false); // 지역 메뉴 열림 여부

  return (
    <nav className="flex min-h-nav-mobile w-full items-center justify-between border-b border-solid border-light bg-white px-5">
      {/* 지역 버튼 */}
      <button
        type="button"
        className="flex w-9 flex-col items-center justify-center gap-1"
        onClick={() => {
          setIsRegionMenuOpen(!isRegionMenuOpen);
        }}
      >
        <img
          src="/assets/images/icons/svg/region.svg"
          alt="Region"
          className="w-full"
        />
        <span className="text-center text-xs">지역</span>
      </button>

      {/* 단기, 급구, 맞춤 버튼 */}
      {NAV_ITEMS.map((item, index) => (
        <button
          key={index}
          type="button"
          className="flex w-9 flex-col items-center justify-center gap-1"
          onClick={() => {
            navigate(item.navigate);
          }}
        >
          <img src={item.imgPath} alt={item.alt} className="w-full" />
          <span className="text-center text-xs">{item.title}</span>
        </button>
      ))}

      {/* 지역 메뉴 */}
      {isRegionMenuOpen && (
        <RegionMenuMobile
          isOpen={isRegionMenuOpen}
          setIsRegionMenuOpen={setIsRegionMenuOpen}
        />
      )}
    </nav>
  );
}

export default NavigationBarMobile;
