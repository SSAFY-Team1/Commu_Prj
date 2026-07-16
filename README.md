# LocalHub Seoul

서울 지역 관광·문화 정보를 탐색하고, 익명 커뮤니티와 챗봇, 데이터 시각화 대시보드를 함께 제공하는 Vue 3 기반 지역 정보 서비스입니다.

본 프로젝트는 3명의 팀원이 3일 동안 의뢰서 요구사항을 기준으로 구현한 MVP입니다. 제공된 서울 권역 JSON 데이터를 프론트엔드에서 직접 활용하며, 정적 SPA와 Netlify Functions로 구성했습니다.

## 주요 기능

- 지역 정보 탐색: 관광지, 문화시설, 축제공연행사, 여행코스, 레포츠, 숙박, 쇼핑 데이터 조회
- 상세 페이지: 지역 정보 상세 내용, 주소, 이미지, 좌표 기반 지도 마커 표시
- 커뮤니티 게시판: localStorage 기반 목록, 상세, 작성, 수정, 삭제
- 커뮤니티 추가 기능: 조회수, 검색, 페이지네이션, 좋아요, 북마크, 이미지 첨부, 카테고리/태그/자치구 선택
- 챗봇: 플로팅 챗봇 UI에서 질문 입력 후 Netlify Function을 통해 OpenAI API 호출
- 대시보드: Chart.js 기반 카테고리/자치구/커뮤니티 통계 시각화
- 지도 시각화: Leaflet 기반 관광지·맛집 등 카테고리별 색상 핀과 자치구 필터
- 축제 캘린더: 축제공연행사 데이터를 월별 캘린더와 목록 형태로 확인
- 반응형 UI: 데스크톱과 모바일 화면 크기에 맞춘 메뉴와 주요 화면 배치

## 기술 스택

- Vue 3
- Vite
- Vue Router
- Tailwind CSS
- Chart.js
- Leaflet
- Netlify Functions
- OpenAI API
- Vitest

## 실행 방법

```bash
npm install
npm run dev
```

Windows PowerShell에서 `npm` 실행이 막히면 아래처럼 실행할 수 있습니다.

```bash
npm.cmd run dev
```

챗봇까지 로컬에서 함께 테스트하려면 Vite 단독 실행 대신 Netlify Functions가 함께 실행되는 명령을 사용합니다.

```bash
npm run dev:netlify
```

실행 후 브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:8888
```

## 환경 변수

챗봇은 API 키 노출을 막기 위해 프론트엔드에서 OpenAI API 키를 직접 사용하지 않습니다. Vue 앱은 `/.netlify/functions/chat`을 호출하고, Netlify Function이 서버 환경변수 `OPENAI_API_KEY`로 OpenAI API를 호출합니다.

프로젝트 루트에 `.env` 파일을 만들고 아래처럼 설정합니다.

```env
OPENAI_API_KEY=sk-xxxx
```

`.env` 파일은 Git에 포함하지 않습니다. 현재 `.gitignore`에 등록되어 있습니다.

Netlify 배포 환경에서는 Netlify 사이트 설정에서 환경변수를 등록한 뒤 다시 배포합니다.

```text
Site configuration > Environment variables > OPENAI_API_KEY
```

## 주요 명령

```bash
npm run dev          # Vite 개발 서버 실행
npm run dev:netlify  # Netlify Functions 포함 로컬 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run test -- --run # 테스트 1회 실행
```

## 데이터

- 앱 제공 데이터: `public/data/`
- 데이터 manifest: `public/data/manifest.json`
- 원본 데이터 출처: 한국관광공사 TourAPI 기반 서울 관광 정보 JSON

의뢰서 기준에 따라 사전 수집·가공된 JSON 파일을 프론트엔드에서 직접 로딩합니다. OpenAPI를 브라우저에서 직접 호출하지 않습니다.

## 빌드 확인

```bash
npm run test -- --run
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.
