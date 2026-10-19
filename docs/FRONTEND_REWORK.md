# 하루동화 프론트엔드 재작업 지침 (백엔드 연동 준비)

> 이 문서는 Claude Code에게 주는 작업 지침이다. 저장소 루트의 `docs/FRONTEND_REWORK.md`에 두고
> "docs/FRONTEND_REWORK.md를 읽고 1단계부터 진행해. 단계마다 빌드 확인하고 커밋해."라고 지시한다.

---

## 0. 목표와 원칙

**목표**: 현재 목업 데모를 "백엔드만 붙이면 실제로 동작하는 프론트"로 바꾼다.
백엔드(FastAPI)는 아직 없다. 프론트는 **API 계층 + 목업 API**로 먼저 완성하고, 백엔드가 준비되면 목업을 실제 호출로 교체한다.

**원칙**
1. 화면 컴포넌트는 `src/mock/`을 직접 import하지 않는다. 데이터는 반드시 `src/api/`를 통해서만 가져온다.
2. 목업 API도 실제 API와 **같은 함수 시그니처, 같은 응답 모양, 비동기(Promise)**로 만든다. 지연(300~800ms)과 실패도 흉내 낸다.
3. 기존 디자인(색상 토큰, 폰트, 삽화, 마스코트 '하루'), 캘린더·타임라인·동화 뷰어 컴포넌트는 최대한 재사용한다.
4. AI는 신경 쓰지 않는다. 프론트 입장에서 동화 생성은 "요청하면 나중에 완성되는 작업"일 뿐이다.
5. 단계별로 작업하고, 각 단계 끝에 `npm run build`와 `npm run lint`가 통과해야 다음 단계로 간다.

---

## 1. 서비스 전제 (확정)

- 부모가 아이의 하루를 사진과 짧은 글로 기록한다. 하루에 기록 1개, 아이 1명 기준이다.
- 쌓인 기록 중 기간을 골라 그림동화를 만든다.
- 동화 생성 입력의 **1순위는 부모가 전하고 싶은 메시지(자유 입력, 필수)**다. 교훈 태그는 선택 보조값이다.
- 동화 생성은 **비동기 작업**이다. 요청하면 바로 `queued` 상태로 응답이 오고, 몇 분 뒤 `completed` 또는 `failed`가 된다.
- 로그인한 사용자만 앱을 쓴다. 회원가입 후 아이 프로필을 먼저 만든다.
- 소개 페이지(`/intro`)는 로그인 없이 볼 수 있다.

---

## 2. 기술 결정

| 항목 | 결정 |
|---|---|
| 기존 스택 | React 19, Vite, TypeScript, Tailwind v4, react-router-dom, lucide-react를 유지한다 |
| 서버 상태 관리 | **TanStack Query(@tanstack/react-query)**를 도입한다. 로딩·에러·캐시·폴링을 여기서 처리한다. `DiaryContext`는 제거한다 |
| HTTP | `fetch` 래퍼(`src/api/client.ts`)를 쓴다. axios는 불필요하다 |
| 환경변수 | `VITE_API_BASE_URL`, `VITE_USE_MOCK`(`true`면 목업 API 사용). `.env.example`을 추가한다 |
| 라우터 | `HashRouter`를 `BrowserRouter`로 바꾸고, Vercel용 `vercel.json` SPA rewrite를 추가한다 |
| 인증 토큰 | 로그인 응답의 `access_token`을 메모리 + localStorage에 보관하고, 요청 헤더에 `Authorization: Bearer`로 붙인다. 401을 받으면 로그아웃 처리하고 `/login`으로 보낸다 |
| 필드 이름 | API JSON은 snake_case, 프론트 타입은 camelCase로 쓴다. 변환은 `src/api/` 안에서만 한다 |

---

## 3. 타입 정의 (`src/types/index.ts` 교체)

```ts
export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export interface User {
  id: string;
  email: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string | null; // YYYY-MM-DD
}

export interface DiaryPhoto {
  id: string;
  url: string; // 표시용 URL (CloudFront 또는 목업 objectURL/dataURL)
}

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD, 아이별로 날짜당 1개
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  photos: DiaryPhoto[];
  createdAt: string;
  updatedAt: string;
}

export type StorybookStatus = "queued" | "processing" | "completed" | "failed";

export interface StorybookPage {
  pageNo: number;
  text: string;
  imageUrl: string;
}

export interface StorybookSummary {
  id: string;
  childId: string;
  title: string | null; // 완성 전에는 null
  status: StorybookStatus;
  periodStart: string;
  periodEnd: string;
  parentMessage: string;
  lessonTag: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Storybook extends StorybookSummary {
  pages: StorybookPage[]; // completed일 때만 채워짐
  errorMessage: string | null;
}
```

---

## 4. API 명세 (프론트·백엔드 공통 기준)

모든 경로 앞에 `/api`가 붙는다. 인증이 필요한 API에는 ✅를 표시했다.

### 인증
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST | /auth/signup | `{email, password}` | `{access_token, user}` |
| POST | /auth/login | `{email, password}` | `{access_token, user}` |
| GET ✅ | /me | - | `{user, children: Child[]}` |

### 아이 프로필
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST ✅ | /children | `{name, birth_date?}` | `Child` |
| PATCH ✅ | /children/{child_id} | `{name?, birth_date?}` | `Child` |

### 사진 업로드 (2단계 방식)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST ✅ | /uploads/presign | `{filename, content_type, size}` | `{upload_url, photo_id}` |
| PUT | `{upload_url}` (S3 직접 업로드) | 파일 바이너리 | 200 |

일기를 저장할 때는 `photo_id` 목록을 같이 보낸다. 목업에서는 presign 단계를 흉내 내고, 이미지는 dataURL로 보관한다.

### 일기
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET ✅ | /children/{child_id}/diaries?from=YYYY-MM-DD&to=YYYY-MM-DD | - | `DiaryEntry[]` |
| GET ✅ | /children/{child_id}/diaries/{date} | - | `DiaryEntry` 또는 404 |
| PUT ✅ | /children/{child_id}/diaries/{date} | `{text, weather?, mood_tag?, photo_ids: string[]}` | `DiaryEntry` (생성·수정 겸용) |
| DELETE ✅ | /children/{child_id}/diaries/{date} | - | 204 |

### 동화
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST ✅ | /children/{child_id}/storybooks | `{period_start, period_end, parent_message, lesson_tag?}` | **202** `StorybookSummary` (status=queued) |
| GET ✅ | /children/{child_id}/storybooks | - | `StorybookSummary[]` (최신순) |
| GET ✅ | /storybooks/{id} | - | `Storybook` |
| POST ✅ | /storybooks/{id}/retry | - | `StorybookSummary` (failed일 때만) |
| DELETE ✅ | /storybooks/{id} | - | 204 |

### 에러 형식
```json
{ "error": { "code": "DIARY_NOT_FOUND", "message": "사용자에게 보여줄 수 있는 한국어 메시지" } }
```
`client.ts`는 이 형식을 `ApiError` 클래스로 바꿔서 던진다.

### 목업 API의 동화 상태 흉내
요청 직후에는 `queued`, 약 5초 뒤 `processing`, 약 15초 뒤 `completed`가 된다. 기존 `generateDummyStorybook` 템플릿으로 페이지를 채운다.
개발 중 실패 화면을 확인할 수 있도록, `parent_message`에 "실패테스트"가 들어 있으면 `failed`로 끝나게 한다.

---

## 5. 폴더 구조

```
src/
├─ api/
│  ├─ client.ts          # fetch 래퍼, 토큰, ApiError, snake↔camel 변환
│  ├─ auth.ts            # login, signup, getMe
│  ├─ children.ts
│  ├─ diaries.ts
│  ├─ uploads.ts         # presign + PUT 업로드
│  ├─ storybooks.ts
│  ├─ index.ts           # VITE_USE_MOCK에 따라 real/mock 구현을 골라서 export
│  └─ mock/              # 목업 구현 (localStorage에 저장해서 새로고침해도 유지)
├─ hooks/                # TanStack Query 훅: useDiaries, useDiary, useSaveDiary, useStorybooks, useStorybook ...
├─ auth/                 # AuthProvider, RequireAuth, RequireChild 라우트 가드
├─ pages/
├─ components/
├─ types/
└─ utils/
```

기존 `src/mock/`의 삽화와 템플릿 데이터는 `src/api/mock/`과 소개 페이지에서만 쓴다.

---

## 6. 라우트와 화면별 수정 사항

| 경로 | 화면 | 접근 |
|---|---|---|
| /intro | 서비스 소개 | 공개 |
| /login, /signup | 로그인·회원가입 | 비로그인 전용 |
| /onboarding | 아이 프로필 만들기 | 로그인 + 아이 없음 |
| / | 성장 기록 홈 (캘린더·타임라인) | 로그인 + 아이 있음 |
| /diary/:date | 기록 작성·조회·수정 | 〃 |
| /storybooks/new | 동화 만들기 (입력) | 〃 |
| /storybooks | 내 동화 서재 | 〃 |
| /storybooks/:id | 동화 상세 (상태별 화면 + 뷰어) | 〃 |
| /settings | 아이 프로필 수정, 로그아웃 | 〃 |

비로그인 사용자가 앱 경로에 들어오면 `/login`으로 보낸다. 로그인했지만 아이가 없으면 `/onboarding`으로 보낸다.
기존 `/storybook` 경로는 `/storybooks/new`로 리다이렉트한다.

### 6-1. 로그인·회원가입 (신규)
- 이메일 + 비밀번호만 받는다. 소셜 로그인은 나중에 추가한다.
- 입력 검증: 이메일 형식, 비밀번호 8자 이상.
- 에러 메시지는 서버 `error.message`를 그대로 보여준다.

### 6-2. 온보딩 (신규)
- 아이 이름(필수)과 생년월일(선택)을 받는다.
- 이 이름이 동화 주인공 이름이 된다. 동화 만들기 화면의 "주인공 이름" 입력은 없앤다(`DEFAULT_NAME = "서아"` 제거).
- 마스코트 '하루'를 활용해 따뜻한 첫 화면으로 만든다.

### 6-3. 성장 기록 홈 (`AppHome`)
- 보고 있는 달의 기록을 `GET diaries?from&to`로 가져온다. 월을 바꾸면 다시 조회한다.
- 로딩 스켈레톤, 에러 상태(다시 시도 버튼), 빈 상태(첫 기록 유도)를 만든다.
- 통계(`utils/stats.ts`)는 조회한 데이터로 계산한다.
- 헤더에 서재(/storybooks)와 설정 진입점을 추가한다.

### 6-4. 기록 작성·조회·수정 (`DiaryEntryPage`, `PhotoUploader`)
- 조회: `GET diaries/{date}`를 쓴다. 404면 새 기록 작성 모드로 연다.
- 저장: 사진 업로드를 먼저 끝낸 뒤 `PUT`으로 저장한다.
  - 사진마다 업로드 진행 상태(대기·업로드 중·완료·실패)를 보여주고, 실패한 사진은 다시 시도하거나 뺄 수 있게 한다.
  - 업로드 중에는 저장 버튼을 비활성화한다.
  - 제한: 최대 5장, 장당 10MB, `image/jpeg`, `image/png`, `image/heic`, `image/webp`. 제한을 넘으면 업로드 전에 안내한다.
- 삭제 버튼을 추가한다. 확인 다이얼로그를 띄우고 `DELETE`를 호출한다.
- 미래 날짜는 작성할 수 없다.
- 저장 중 중복 클릭을 막고, 실패하면 입력 내용을 유지한 채 에러를 보여준다.
- 수정 중 페이지를 벗어나면 "저장하지 않은 내용이 있어요" 확인을 띄운다.
- 저장에 성공하면 해당 월 일기 쿼리를 무효화(invalidate)한다.

### 6-5. 동화 만들기 (`/storybooks/new`, 기존 `StorybookPage` 분리)
입력 순서와 비중을 다음과 같이 바꾼다.
1. **전하고 싶은 메시지 (필수, 가장 크게)**: 여러 줄 입력, 10~300자. 예시 문구를 placeholder와 칩으로 제공한다(예: "친구에게 먼저 사과하는 용기를 알려주고 싶어요").
2. **교훈 태그 (선택)**: 기존 `LESSON_TAGS` 칩. 아무것도 고르지 않아도 된다.
3. **기간**: 기본값은 최근 7일이다. 빠른 선택 칩(3일·7일·14일)과 직접 선택을 둔다. 최대 31일이다.
4. **이 기간의 기록 미리보기**: 선택한 기간의 기록 개수와 썸네일을 보여준다. **기록이 1개 미만이면 생성 버튼을 비활성화**하고 기록 작성으로 안내한다.

생성 버튼을 누르면 `POST`(202)를 보내고 바로 `/storybooks/:id`로 이동한다. 기존의 2.4초 가짜 로딩 단계는 없앤다.

### 6-6. 내 동화 서재 (`/storybooks`, 신규)
- 카드 목록: 표지(완성 시 첫 페이지 이미지, 미완성이면 마스코트), 제목(없으면 "만드는 중인 동화"), 기간, 메시지 앞부분, 상태 배지.
- `queued`나 `processing`인 항목이 하나라도 있으면 목록을 10초 간격으로 폴링한다(TanStack Query `refetchInterval`). 모두 끝나면 폴링을 멈춘다.
- 빈 상태에서는 첫 동화 만들기로 유도한다.

### 6-7. 동화 상세 (`/storybooks/:id`, 신규)
상태별로 화면을 나눈다.
- `queued`·`processing`: 마스코트 '하루' 삽화와 "동화를 만들고 있어요. 몇 분 정도 걸려요. 이 화면을 나가도 서재에서 확인할 수 있어요."를 보여준다. 5초 간격으로 폴링한다.
- `completed`: 기존 `StorybookViewer`를 재사용한다. 상단에 기간과 부모 메시지를 보여준다.
- `failed`: 실패 안내와 "다시 만들기"(retry API) 버튼을 보여준다.
- 공통으로 삭제 버튼을 둔다(확인 다이얼로그 포함).
- 기존의 "다시 만들기"(같은 화면에서 재생성)는 "같은 설정으로 새로 만들기"로 바꾼다. 이 버튼은 입력값을 채운 채 `/storybooks/new`로 보낸다.

### 6-8. 소개 페이지 (`IntroPage`)
- 구조와 삽화는 유지한다.
- "부모가 전하고 싶은 메시지가 동화의 중심"이라는 방향에 맞게 핵심 기능 2 문구를 다듬는다.
- CTA는 로그인 상태에 따라 `/`(로그인됨) 또는 `/signup`으로 보낸다.
- 데모 안내 문구("미리 준비된 예시로 체험하는…")는 목업 모드(`VITE_USE_MOCK=true`)일 때만 보여준다.

### 6-9. 공통
- 토스트 알림 컴포넌트를 만든다(저장 완료, 삭제 완료, 에러).
- 확인 다이얼로그 컴포넌트를 만든다(삭제, 이탈 경고). 접근성(포커스 트랩, ESC로 닫기)을 지킨다.
- 로딩 스켈레톤과 에러 박스(다시 시도 버튼) 컴포넌트를 공통으로 만든다.
- 375px 모바일 우선, 터치 영역은 44px 이상으로 한다.

---

## 7. 작업 순서 (단계별 완료 기준)

| 단계 | 작업 | 완료 기준 |
|---|---|---|
| 1 | 정리: `DESIGN (1).md`, `DESIGN (2).md`, 쓰지 않는 참고 문서 정리. README를 프로젝트 설명으로 교체. `.env.example` 추가 | 빌드·린트 통과 |
| 2 | 타입 교체 + `src/api/` 계층 + 목업 구현(localStorage 유지) + TanStack Query 설정 | 목업 API 함수 단위로 호출해서 동작 확인 |
| 3 | 인증·온보딩·라우트 가드 + BrowserRouter + `vercel.json` | 회원가입 → 온보딩 → 홈 흐름 동작, 새로고침해도 유지 |
| 4 | 홈·일기 화면을 API 훅으로 전환 (`DiaryContext` 제거), 사진 업로드 흐름, 삭제 | 기록 작성·수정·삭제·사진 업로드(성공·실패) 동작 |
| 5 | 동화 만들기·서재·상세 화면 (비동기 상태 + 폴링 + retry) | 생성 → queued → processing → completed 자동 전환, 실패 테스트 동작 |
| 6 | 공통 UI(토스트·다이얼로그·스켈레톤) 마무리, 소개 페이지 문구, 설정 화면 | 375px·태블릿·데스크톱 확인, 콘솔 에러 없음 |

---

## 8. 하지 말 것

- 화면 컴포넌트에서 `fetch`를 직접 부르거나 `src/api/mock/`을 import하지 않는다.
- 런타임에 AI API(OpenAI, Gemini 등)를 호출하지 않는다.
- 비밀 키를 프론트 코드나 `.env`에 넣지 않는다. 프론트에는 `VITE_API_BASE_URL`만 둔다.
- 백엔드 코드를 이 저장소에 만들지 않는다.
- 기존 삽화 에셋과 색상 토큰을 임의로 바꾸지 않는다.

---

## 9. 아직 정하지 않은 것 (기본값으로 진행하고, 바뀌면 이 문서를 고친다)

| 항목 | 지금 기본값 |
|---|---|
| 로그인 방식 | 이메일 + 비밀번호 (카카오 로그인은 나중에) |
| 아이 여러 명 지원 | 1명만 (타입과 API는 child_id 기준이라 나중에 확장 가능) |
| 사진 제한 | 최대 5장, 장당 10MB |
| 동화 생성 최소 기록 수 | 1개 |
| 동화 기간 | 기본 7일, 최대 31일 |
| 동화 완성 알림 | 서재 폴링만 (푸시·이메일 알림은 나중에) |
| 그림체 선택 | 없음 (나중에 동화 생성 요청에 `art_style` 필드 추가) |
