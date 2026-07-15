# Git 전략 — LocalHub (빠른 1일 워크플로우)

목적: 3명 이내 단기 개발에서 충돌을 줄이고 신속히 병합·배포하기 위한 최소한의 규칙과 명령어 모음입니다.

## 요약
- `main`은 보호(직접 푸시 금지). 모든 변경은 Feature 브랜치 → PR → 리뷰 → 머지
- 브랜치 네이밍: `feature/<짧은-설명>-<이니셜>` (예: `feature/dashboard-b`)
- PR 방식: `Squash and merge` 권장

## 브랜치 규칙
- Feature: `feature/<what>-<initial>`
- Fix: `fix/<what>`
- Chore: `chore/<what>`
- Hotfix(긴급): `hotfix/<what>`

## 기본 워크플로우(예시)
1. 브랜치 생성

```bash
git fetch origin
git switch -c feature/<what>-<initial>
```

2. 작업 중간에 최신화(리베이스 권장)

```bash
git fetch origin
git rebase origin/main
# 충돌 발생 시: 충돌 파일 수정 -> git add . -> git rebase --continue
```

3. 푸시 및 PR 생성

```bash
git push -u origin feature/<what>-<initial>
# GitHub에서 PR 생성
```

4. PR 머지 전 최신화(필수)

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

> 주의: `--force-with-lease`는 안전한 강제 푸시입니다. 충돌 해결 후만 사용하세요.

## 커밋 메시지 규칙(권장)
- 형식: `type(scope): 한줄요약 (이니셜)`
- type: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`

예:
```
feat(dashboard): add KPI cards (B)
fix(community): password validation bug (C)
```

## PR 체크리스트 (템플릿으로 사용)
- [ ] 설명: 변경 목적과 요약
- [ ] 관련 이슈 번호
- [ ] 어떻게 수동으로 확인할지(테스트 방법)
- [ ] 빌드/런 로컬에서 확인 (`npm run build` / `npm run dev`)
- [ ] 민감 정보(키) 하드코딩 없음
- [ ] 최소 1명 리뷰 승인

## 충돌 최소화 규칙
- 공통 파일(라우터, netlify.toml, package.json 등)은 변경 전 팀 합의
- 파일 단위 소유권을 정해 소유자만 변경 권한 권장
- PR은 작게(기능 단위, 200줄 내외)로 유지
- 커밋은 의미있게, 자주 푸시

## 긴급 핫픽스 흐름
1. `git switch -c hotfix/<desc>` from `main`
2. 수정 → 테스트 → PR 또는 직접 배포(팀 합의 필요)

## CODEOWNERS 사용
- 코드 소유자 파일을 설정하면 PR에 자동 리뷰어가 지정됩니다. (
[CODEOWNERS](../CODEOWNERS) 참고 — 실제 GitHub 핸들로 교체하세요.)

## 권장 명령 모음
```bash
# 새 브랜치
git switch -c feature/foo-a
# 최신화(rebase)
git fetch origin && git rebase origin/main
# 충돌 해결 후 계속
git add . && git rebase --continue
# 푸시(초기)
git push -u origin feature/foo-a
# 강제푸시(충돌 해결 후)
git push --force-with-lease
```

---
참고: 상세 PR 템플릿은 `.github/PULL_REQUEST_TEMPLATE.md`를 사용하세요.