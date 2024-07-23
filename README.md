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

3. **해당 브랜치로 기능 구현 후 commit, push (팀원)**
   - 기능 구현 작업 진행
   - 작업한 내용 스테이징
     ```sh
     git add .
     ```
   - 변경 사항 커밋
     ```sh
     git commit -m "이슈 번호에 해당하는 작업 내용 설명"
     ```
   - 원격 저장소의 해당 브랜치로 푸시
     ```sh
     git push origin feature/이슈번호
     ```

4. **GitHub에 PR 요청 (팀원)**
   - GitHub에서 `feature/이슈번호` 브랜치에서 `develop` 브랜치로의 Pull Request 생성
   - PR 설명 작성

5. **PR 확인 후 develop에 merge (팀장)**
   - 코드 리뷰가 완료되면 PR을 `develop` 브랜치에 머지

6. **로컬 develop 최신화 (팀장, 팀원)**
   - `develop` 브랜치 최신 상태로 업데이트
     ```sh
     git checkout develop
     git pull origin develop
     ```

7. **기능 브랜치 삭제 (팀장)**
   - **로컬**:
     - 사용한 작업 브랜치 삭제
       ```sh
       git branch -d feature/이슈번호
       ```
   - **원격**:
     - 원격 저장소에서도 사용한 작업 브랜치 삭제
       ```sh
       git push origin --delete feature/이슈번호
       ```