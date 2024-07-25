# 프로젝트 구조 및 설정 가이드

## 프로젝트 구조

```
office24/
│
├── backend/
│   ├── table/
│   │   ├── controller
│   │   ├── entity
│   │   ├── mapper
│   │   └── service
│   └── ...
│
└── frontend/
    ├── assets/
    ├── components/
    │   ├── member/
    │   ├── manager/
    │   └── admin/
    ├── pages/
    │   ├── member/
    │   ├── manager/
    │   └── admin/
    └── styles/
        ├── components/
        │   ├── member/
        │   ├── manager/
        │   └── admin/
        └── pages/
            ├── member/
            ├── manager/
            └── admin/
```

### 백엔드 (Spring Boot)

- controller: API 엔드포인트 정의
- entity: 데이터베이스 모델 정의
- mapper: 데이터베이스 쿼리 매핑
- service: 비즈니스 로직 구현

### 프론트엔드 (React)

- assets: 이미지, 폰트 등의 정적 파일
- components: 재사용 가능한 React 컴포넌트
- pages: 라우트에 해당하는 페이지 컴포넌트
- styles: 전역 스타일 및 테마 설정

## 의존성 설치

### 백엔드 (Maven)

   ```
   mvn clean install
   ```

### 프론트엔드 (npm)

   ```
   npm install
   ```

<br>

---

<br>

# 프로젝트 브랜치 관리 절차

브랜치를 나누어 프로젝트를 진행하기 위한 절차

## 절차

1. **이슈 등록 (팀원)**
   - **GitHub** 등 원격 저장소 관리 툴에서 새로운 이슈 등록

2. **feature/이슈번호 브랜치 생성 (팀원)**
   - 저장소 최신 상태로 업데이트
     ```sh
     git fetch origin
     ```
   - `develop` 브랜치로 체크아웃하여 최신 상태로 업데이트
     ```sh
     git checkout develop
     git pull origin develop
     ```
   - 이슈 번호를 포함한 새로운 브랜치 생성
     ```sh
     git checkout -b feature/이슈번호
     ```

3. **해당 브랜치로 기능 구현, commit, push (팀원)**
   - 기능 구현 작업 진행
   - 작업한 내용 스테이징
     ```sh
     git add .
     ```
   - 변경 사항 커밋
     ```sh
     git commit -m "이슈 번호에 해당하는 작업 내용"
     ```
   - 원격 저장소의 해당 브랜치로 푸시
     ```sh
     git push origin feature/이슈번호
     ```

4. **GitHub에 PR 요청 (팀원)**
   - GitHub에서 `feature/이슈번호` 브랜치에서 `develop` 브랜치로의 Pull Request 생성
   - PR 설명에 작업한 내용 작성

5. **PR 확인 후 develop에 merge (팀장)**
   - 코드 리뷰가 완료되면 PR을 `develop` 브랜치에 머지

6. **로컬 develop 최신화 (팀장, 팀원)**
   - `develop` 브랜치 최신 상태로 업데이트
     ```sh
     git checkout develop
     git pull origin develop
     ```

7. **기능 브랜치 삭제**
   - **로컬 (팀원)**:
     - 사용한 작업 브랜치 삭제
       ```sh
       git branch -d feature/이슈번호
       ```
   - **원격 (팀장)**:
     - 원격 저장소에서도 사용한 작업 브랜치 삭제
       ```sh
       git push origin --delete feature/이슈번호
       ```
