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
