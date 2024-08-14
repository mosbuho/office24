import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../styles/components/member/KakaoMap.css";

const CustomOverlayContent = ({ item, onClick }) => {
  return (
    <div className="custom-overlay" onClick={onClick}>
      <div className="custom-marker">
        <MdLocationOn />
      </div>
      <div className="info-window">
        <h3>{item.TITLE}</h3>
        <div className="info-window-content">
          <div className="price">
            {item.PRICEPERDAY.toLocaleString('ko-KR')}원/일
          </div>
          <div className="item-rating">
            <FaStar />
            <div className="rate">{item.RATING.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
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
        map: map
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
    if (!kakaoMap || !mapData.length) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
      return;
    }

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = mapData.map((item) => {
      const position = new kakao.maps.LatLng(item.LATITUDE, item.LONGITUDE);

      const content = document.createElement('div');
      const root = ReactDOM.createRoot(content);

      root.render(
        <CustomOverlayContent
          item={item}
          onClick={() => navigate(`/office/${item.NO}`)}
        />
      );

      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content,
        zIndex: 3,
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
