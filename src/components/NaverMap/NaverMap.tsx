import { useState, useEffect } from "react";

let mapInstance: naver.maps.Map | null = null;

const loadScript = (src: string, callback: () => void) => {
  const existingScript = document.querySelector(`script[src="${src}"]`);

  if (!existingScript) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback(); // 이미 로드된 스크립트라면 콜백 바로 실행
  }
};

function NaverMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [isMapLoaded, setMapLoaded] = useState(false);

  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

  const initMap = () => {
    if (document.getElementById("map") && window.naver) {
      const mapOptions = {
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 16,
      };

      mapInstance = new window.naver.maps.Map("map", mapOptions);

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
      });

      setMapLoaded(true);
    }
  };

  useEffect(() => {
    if (typeof window.naver === "undefined") {
      loadScript(
        `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`,
        initMap,
      );
    } else {
      initMap();
    }
  }, [latitude, longitude]);

  return (
    <div id="map" className="h-full w-full">
      {!isMapLoaded && (
        <div className="flex h-full w-full items-center justify-center text-sm">
          Loading...
        </div>
      )}
    </div>
  );
}

export default NaverMap;
