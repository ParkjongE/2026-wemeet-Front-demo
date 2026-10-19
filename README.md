# 하루동화 프론트엔드

> 우리 아이의 하루가, 한 권의 동화로.

부모가 아이의 하루를 사진과 짧은 글로 기록하고, 쌓인 기록과 **부모가 전하고 싶은 메시지**를 바탕으로 아이가 주인공인 그림동화를 만드는 서비스의 프론트엔드입니다.

백엔드(FastAPI)는 별도 저장소에서 개발합니다. 이 저장소는 API 계층(`src/api/`)과 목업 API를 함께 제공해서, 백엔드 없이도 전체 흐름을 체험할 수 있습니다.

## 기술 스택

- React 19, TypeScript, Vite
- Tailwind CSS v4
- react-router-dom, TanStack Query
- lucide-react

## 시작하기

```bash
npm install
cp .env.example .env   # 필요하면 값 수정
npm run dev
```

| 환경변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 주소. 요청 경로 앞에 `/api`가 붙습니다 |
| `VITE_USE_MOCK` | `true`면 localStorage 기반 목업 API를 사용합니다 |

## 목업 모드 (`VITE_USE_MOCK=true`)

- 데이터는 브라우저 localStorage(`harudonghwa.mock.db.v1`)에 저장돼서 새로고침해도 유지됩니다.
- 로그인 화면의 **데모 계정으로 체험하기**를 누르면 예시 기록 10개와 완성된 동화 1권이 있는 계정으로 들어갑니다
  (`demo@harudonghwa.app` / `harudonghwa`).
- 모든 요청은 300~800ms 지연됩니다. `VITE_MOCK_FAIL_RATE`(0~1)로 무작위 실패를 켤 수 있습니다.
- 동화는 요청 직후 `queued`, 약 5초 뒤 `processing`, 약 15초 뒤 `completed`가 됩니다.
- 실패 화면 확인용 장치
  - 전하고 싶은 메시지에 `실패테스트`가 들어 있으면 동화가 `failed`로 끝납니다. 다시 만들기(retry)는 성공합니다.
  - 파일 이름에 `fail` 또는 `실패`가 들어간 사진은 업로드에 실패합니다.

## 화면 구성

| 경로 | 화면 | 접근 |
|---|---|---|
| `/intro` | 서비스 소개 | 공개 |
| `/login`, `/signup` | 로그인·회원가입 | 비로그인 |
| `/onboarding` | 아이 프로필 만들기 | 로그인 + 아이 없음 |
| `/` | 성장 기록 홈 (캘린더·타임라인) | 로그인 + 아이 있음 |
| `/diary/:date` | 기록 작성·조회·수정·삭제 | 〃 |
| `/storybooks/new` | 동화 만들기 | 〃 |
| `/storybooks` | 동화 서재 | 〃 |
| `/storybooks/:id` | 동화 상세 (상태별 화면 + 뷰어) | 〃 |
| `/settings` | 아이 프로필 수정, 로그아웃 | 〃 |

## 폴더 구조

```
src/
├─ api/          # fetch 래퍼(client.ts), 실제 API, mock/(목업 구현). 화면은 api/index.ts만 쓴다
├─ hooks/        # TanStack Query 훅 (useDiaries, useStorybooks, useAccount, usePhotoUploads ...)
├─ auth/         # AuthProvider, 라우트 가드
├─ pages/        # 라우트별 화면
├─ components/   # 화면 구성 요소, common/(버튼·토스트·다이얼로그·스켈레톤 등)
├─ constants/    # 교훈 태그, 메시지·기간 제한 등
├─ assets/       # 삽화와 마스코트 '하루'
├─ mock/         # 동화 템플릿·예시 기록 (목업 API와 소개 페이지에서만 사용)
├─ types/
└─ utils/
```

## 배포

Vercel에 배포합니다. `vercel.json`이 모든 경로를 `index.html`로 보내서 BrowserRouter 새로고침이 동작합니다.

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 + 프로덕션 빌드 |
| `npm run lint` | oxlint |
| `npm run preview` | 빌드 결과 미리보기 |

## 문서

- [docs/FRONTEND_REWORK.md](docs/FRONTEND_REWORK.md): 백엔드 연동 준비 재작업 지침 (API 명세 포함)
- [docs/prd.md](docs/prd.md): 초기 데모 PRD
