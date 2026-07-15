# 요구사항 추적표

기준: `02_3일차_팀프로젝트_개발 의뢰서_비전공.pdf`, `LocalHub_서울_실습기획서_최종.md`

## 필수 요구사항

| 요구사항 | 담당 | 구현 위치 | 현재 상태 |
|---|---|---|---|
| Vue.js 3 + Vite SPA | A | `src/main.js`, `src/router/index.js` | 기본 구성 완료 |
| Netlify 정적 배포 | A | `netlify.toml` | 설정 완료, 실제 URL 필요 |
| 서울 제공 JSON 프론트 로딩 | B | `public/data/`, `src/utils/dataLoader.js` | 기본 로딩 구현, B 검증/고도화 필요 |
| 카테고리 목록/검색 | A/B | `src/views/CategoryView.vue`, `dataLoader.js` | 기본 구현 완료, B 고도화 가능 |
| 익명 커뮤니티 CRUD | C | `src/views/CommunityView.vue`, `src/utils/localStorage.js` | 기본 CRUD 있음, C 추가기능 필요 |
| 수정/삭제 비밀번호 검증 | C | `CommunityView.vue`, `localStorage.js` | 기본 구현 있음 |
| localStorage 저장 | C | `src/utils/localStorage.js` | 기본 helper 있음 |
| 챗봇 UI | C | `src/components/Chatbot.vue` | 기본 구현 완료, C UX 고도화 필요 |
| OpenAI API 연동 | C | `netlify/functions/chat.mjs` | Function 구현, API 키 설정 후 검증 필요 |
| API 키 비노출 | A/C | `chat.mjs`, Netlify env | 프론트 키 없음, 배포 후 번들 검사 필요 |
| 선택 기능 1개 이상 | B | `DashboardView.vue` | 데이터 시각화 기본 구현 |
| 데이터 출처/라이선스 문서화 | A/B | `서울/SOURCE.md`, README, Footer | 기본 표기 완료 |
| 산출물 제출 | A | README, WBS, 발표자료 | 발표자료/URL 최종 필요 |

## 데이터 건수 확인

`서울/SOURCE.md`와 최종 기획서에는 총 8,150건으로 적혀 있으나, 현재 저장소에 포함된 서울 JSON 7개 파일의 `total`과 `items.length` 합산은 6,518건입니다.

| 파일 | 건수 |
|---|---:|
| `서울_관광지.json` | 783 |
| `서울_문화시설.json` | 566 |
| `서울_축제공연행사.json` | 201 |
| `서울_여행코스.json` | 51 |
| `서울_레포츠.json` | 126 |
| `서울_숙박.json` | 423 |
| `서울_쇼핑.json` | 4,368 |
| 합계 | 6,518 |

Team B는 대시보드 PR에서 실제 로딩 건수를 기준으로 검증하고, 발표자료에는 “현재 제공 파일 기준”이라고 표기한다.

## 제외 범위

- 회원가입/로그인
- 서버 DB
- WebSocket
- 지도/경로 안내
- 날씨 API
- 다국어
- 소셜 공유

## 의뢰서와 기획서 차이

의뢰서는 Vue 프론트에서 OpenAI API를 직접 호출하고 `VITE_` 환경변수를 사용하는 예시를 포함합니다. 최종 기획서는 API 키 노출 방지를 위해 `Vue -> Netlify Function -> OpenAI API` 구조를 채택합니다.

발표와 기능 명세서에는 이 차이를 “배포 안정성과 API 키 비노출을 위한 보완 결정”으로 설명합니다.
