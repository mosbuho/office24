package com.kh.backend.common.geocoding;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GeocodingService {

    @Value("${kakao.maps.api.key}")
    private String apiKey;

    public double[] getLatLongFromAddress(String address) {
        RestTemplate restTemplate = new RestTemplate();
        String url = UriComponentsBuilder.fromHttpUrl("https://dapi.kakao.com/v2/local/search/address.json")
                .queryParam("query", address)
                .build()
                .toString();

        // Authorization 헤더 추가
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<KakaoGeocodingResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, KakaoGeocodingResponse.class);

        if (response.getBody() != null && !response.getBody().getDocuments().isEmpty()) {
            double lat = Double.parseDouble(response.getBody().getDocuments().get(0).getY());
            double lng = Double.parseDouble(response.getBody().getDocuments().get(0).getX());
            return new double[]{lat, lng};
        }
        throw new IllegalArgumentException("Invalid address: " + address);
    }

    // 내장 클래스 또는 별도 파일로 JSON 응답을 매핑하기 위한 클래스
    public static class KakaoGeocodingResponse {
        private List<Document> documents;

        public List<Document> getDocuments() {
            return documents;
        }

        public void setDocuments(List<Document> documents) {
            this.documents = documents;
        }

        public static class Document {
            private String x; // 경도
            private String y; // 위도

            public String getX() {
                return x;
            }

            public void setX(String x) {
                this.x = x;
            }

            public String getY() {
                return y;
            }

            public void setY(String y) {
                this.y = y;
            }
        }
    }
}
