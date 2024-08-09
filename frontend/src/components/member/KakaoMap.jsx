/* global kakao */

import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/KakaoMap.css";

export default function KakaoMap(props) {
  const { mapData } = props;
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setUserLocation({ latitude: 37.5665, longitude: 126.9780 }); // 기본 위치 (서울시청)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
    };

    return () => {
      script.remove();
    };
  }, []);

  const initializeMap = useCallback((lat, lng) => {
    kakao.maps.load(() => {
      const mapOptions = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
        draggable: true,
      };

      const map = new kakao.maps.Map(container.current, mapOptions);

      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: map,
      });

      setKakaoMap(map);
    });
  }, []);

  useEffect(() => {
    if (scriptLoaded && userLocation) {
      if (!kakaoMap) {
        initializeMap(userLocation.latitude, userLocation.longitude);
      }
    }
  }, [scriptLoaded, userLocation, kakaoMap, initializeMap]);

  useEffect(() => {
    if (!kakaoMap || !mapData.length) return;

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = mapData.map((item) => {
      const position = new kakao.maps.LatLng(item.LATITUDE, item.LONGITUDE);

      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content: ReactDOMServer.renderToString(
          <div className="custom-overlay">
            <div
              className="custom-marker"
              onClick={() => navigate(`/office/${item.NO}`)}
            >
              <MdLocationOn />
            </div>
            <div className="info-window">
              <h3>{item.TITLE}</h3>
              <div className="info-window-content">
                <div className="price">
                  {item.PRICEPERDAY.toLocaleString()}원/1일
                </div>
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

      kakao.maps.event.addListener(customOverlay, 'click', () => {
        navigate(`/office/${item.NO}`);
      });

      customOverlay.setMap(kakaoMap);

      return customOverlay;
    });

    setMarkers(newMarkers);

    if (newMarkers.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()));
      kakaoMap.setBounds(bounds);
    }
  }, [kakaoMap, mapData, navigate]);

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

      <div
        className="on-map zoom-buttons"
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
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
