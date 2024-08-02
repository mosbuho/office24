/* global kakao */

import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import "../../styles/components/member/KakaoMap.css";

export default function KakaoMap(props) {
  const { mapData, onItemSelect } = props;
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const container = useRef();

  const handleZoomIn = () => {
    if (kakaoMap) {
      kakaoMap.setLevel(kakaoMap.getLevel() - 1);
    }
  };

  const handleZoomOut = () => {
    if (kakaoMap) {
      kakaoMap.setLevel(kakaoMap.getLevel() + 1);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(37.50802, 127.062835);
        const options = {
          center,
          level: 3,
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);
      });
    };
  }, []);

  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }

    const center = kakaoMap.getCenter();
    kakaoMap.relayout();
    kakaoMap.setCenter(center);
  }, [kakaoMap]);

  useEffect(() => {
    if (kakaoMap === null || !mapData.length) {
      return;
    }

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = mapData.map((item) => {
      const position = new kakao.maps.LatLng(
        item.yCoordinate,
        item.xCoordinate
      );

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: ReactDOMServer.renderToString(
          <div className="custom-overlay">
            <div className="custom-marker" onClick={() => onItemSelect(item)}>
              <MdLocationOn />
            </div>
            <div className="info-window">
              <h3>{item.title}</h3>

              <div className="info-window-content">
                <div className="price">{item.pricePerDay}원/1일</div>
                <div className="item-rating">
                  <FaStar />
                  <div className="rate">{item.rating}</div>
                </div>
              </div>
            </div>
          </div>
        ),
        zIndex: 3,
      });

      customOverlay.setMap(kakaoMap);

      kakao.maps.event.addListener(customOverlay, "click", () => {
        onItemSelect(item);
      });

      return customOverlay;
    });

    setMarkers(newMarkers);

    if (newMarkers.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()));
      kakaoMap.setBounds(bounds);
    }
  }, [kakaoMap, mapData, onItemSelect]);

  return (
    //comment: 사용자 경험향상을 위해 범위를 200프로로 로딩해두고 중앙으로 이동시킴
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="map"
        ref={container}
        style={{
          width: "200%",
          height: "200%",
          transform: "translate(-25%, -25%)",
          transformOrigin: "center",
        }}
      ></div>

      <div className="on-map zoom-buttons">
        <button className="map-button zoom" onClick={handleZoomIn}>
          +
        </button>
        <button className="map-button zoom" onClick={handleZoomOut}>
          -
        </button>
      </div>
    </div>
  );
}
