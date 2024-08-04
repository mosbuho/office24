/* global kakao */

import { useEffect, useRef, useState } from "react";

export default function KakaoMapSingleLocation({ centerMarker }) {
  const [kakaoMap, setKakaoMap] = useState(null);
  const container = useRef();

  // Render Marker
  function createCustomMarker(content, onClick) {
    return `
    <div onclick="${onClick}" style="
      background-color: var(--primary-color);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transform: translateY(-50%);
      cursor: pointer;
    ">
      ${content}
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid var(--primary-color);
        transform: translateX(-50%);
      "></div>
    </div>
  `;
  }

  // Load Kakao Map API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(
          centerMarker.latitude,
          centerMarker.longitude
        );
        const options = {
          center,
          level: 3,
          disableDoubleClickZoom: true, //  더블클릭 비활성화
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);
      });
    };
  }, [centerMarker]);

  //Marker 생성 및 추가
  useEffect(() => {
    if (kakaoMap && centerMarker) {
      const position = new kakao.maps.LatLng(
        centerMarker.latitude,
        centerMarker.longitude
      );

      kakaoMap.setCenter(position);

      const openKakaoMap = () => {
        const kakaoMapUrl = `https://map.kakao.com/link/map/${centerMarker.content},${centerMarker.latitude},${centerMarker.longitude}`;
        window.open(kakaoMapUrl, "_blank");
      };

      // CustomOverlay 생성
      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: createCustomMarker(centerMarker.content, "openKakaoMap()"),
        map: kakaoMap,
      });

      // Add the openKakaoMap function to the window object
      window.openKakaoMap = openKakaoMap;
    }
  }, [kakaoMap, centerMarker]);

  // fix map
  useEffect(() => {
    if (kakaoMap) {
      kakaoMap.setDraggable(false);
      kakaoMap.setZoomable(false);

      kakao.maps.event.addListener(kakaoMap, "click", function (mouseEvent) {
        mouseEvent.preventDefault();
      });
    }
  }, [kakaoMap]);
  //render map
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={container}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </div>
  );
}
