/* global kakao */

import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/KakaoMap.css";

export default function KakaoMap(props) {
  const { mapData, onItemSelect } = props;
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const container = useRef();
  const navigate = useNavigate();

  const handleZoomIn = useCallback(() => {
    if (kakaoMap) {
      kakaoMap.setLevel(kakaoMap.getLevel() - 1);
    }
  }, [kakaoMap]);

  const handleZoomOut = useCallback(() => {
    if (kakaoMap) {
      kakaoMap.setLevel(kakaoMap.getLevel() + 1);
    }
  }, [kakaoMap]);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User Location:", position.coords.latitude, position.coords.longitude);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // 기본 위치 설정 (서울시청)
          setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
    }
  }, []);

  // Kakao 지도 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY
      }&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
    };

    return () => {
      script.remove();
    };
  }, []);

  // Kakao 지도 초기화
  const initializeMap = useCallback((lat, lng) => {
    console.log("Initializing map with:", lat, lng);
    kakao.maps.load(() => {
      const mapOptions = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
        draggable: true // 드래그 가능하도록 설정
      };

      const map = new kakao.maps.Map(container.current, mapOptions);

      // 사용자 위치 마커 추가
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: map
      });

      setKakaoMap(map);
    });
  }, []);

  // 지도 초기화 및 사용자 위치 업데이트
  useEffect(() => {
    if (scriptLoaded && userLocation) {
      console.log("Script loaded and user location available");
      if (!kakaoMap) {
        initializeMap(userLocation.latitude, userLocation.longitude);
      }
    }
  }, [scriptLoaded, userLocation, kakaoMap, initializeMap]);

  // 상품들 마커 세팅
  useEffect(() => {
    if (!kakaoMap || !mapData.length) return;

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = mapData.map((item) => {
      const position = new kakao.maps.LatLng(item.LATITUDE, item.LONGITUDE);

      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content: ReactDOMServer.renderToString(
          <div className="custom-overlay">
            <div className="custom-marker" onClick={() => onItemSelect(item)}>
              <MdLocationOn />
            </div>
            <div className="info-window">
              <h3>{item.TITLE}</h3>
              <div className="info-window-content">
                <div className="price">{item.PRICEPERDAY.toLocaleString()}원/1일</div>
                <div className="item-rating">
                  <FaStar />
                  <div className="rate">{item.RATING}</div>
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
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
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

      <div className="on-map zoom-buttons" style={{ position: "absolute", top: "10px", right: "10px" }}>
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