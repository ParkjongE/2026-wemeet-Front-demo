<!-- Source: https://designmd.ai/chef/nomadkit (MIT) -->

# NomadKit Design System

## Overview

NomadKit is a free-spirited, light-packed, and essential design system for digital nomad tools and backpacker community platforms. It embraces minimalism and portability, using warm sand tones balanced by ocean and forest accents.

## Colors

- **Primary Sand** (#D4A373): Primary actions, key accents
- **Secondary Ocean** (#0891B2): Links, secondary actions
- **Tertiary Forest** (#166534): Success states, highlights
- **Background** (#FFFDF7): Page background
- **Surface Default** (#FFFFFF): Card backgrounds
- **Success** (#166534)
- **Warning** (#CA8A04)
- **Error** (#DC2626)
- **Info** (#0891B2)

## Do's and Don'ts
- Do use Sand as the dominant primary action color
- Don't rely on color alone to convey meaning
- Do design for offline-first with skeleton states


## 하루동화 적용 원칙

- 원래 Sand / Ocean / Forest 색상을 유지한다. 주요 행동은 Sand, 링크는 Ocean, 성공 상태는 Forest로 구분한다.
- Pretendard는 메뉴·본문·폼에, 고운바탕 700은 브랜드·화면 제목에, 고운돋움은 일기에, 고운바탕은 책 본문에 사용한다. Gaegu는 사용하지 않는다.
- 폰트는 SIL OFL 1.1을 확인한 배포본만 사용하고 `public/licenses/`의 원문 고지를 유지한다.
- 큰 섹션에는 16px, 입력·버튼에는 8–12px 모서리를 사용한다. 모든 정보를 독립 카드로 감싸지 않는다.
- 장식용 캐릭터의 반복과 무한 부유 애니메이션은 피한다. 그림책 삽화와 기록 사진에 시선을 모은다.
- 소개에는 구체적인 일상 예시, 앱에는 짧고 직접적인 행동 안내를 쓴다.


## 기록·동화 만들기 UX (2026-10-23)

- 제목은 홈의 “이번 주 기록을 그림책으로 엮어 보세요”와 동일한 고운바탕 700으로 통일한다. 공통 font-display는 font-book을 참조한다. 고운돋움 400은 일기·메시지 입력에, Pretendard는 조작 요소와 설명에 사용한다.
- 동화 제작은 기록 선택 → 메시지 → 주제 및 최종 확인의 3단계. 현재 단계와 이전 단계만 이동 가능하다.
- 기록 기간의 실제 글·사진을 확인하고 다음으로 진행한다. 표지는 확정 결과가 아닌 예시라고 표시한다.
- 일기는 저장 상태를 첫 번째 도구로 배치하고 꾸미기를 접어서 제공한다. 한 가지 질문으로 글쓰기를 돕는다.
- 신뢰 문구는 실제 동작에 맞춘다. 체험 모드의 브라우저 보관과 기기 임시 저장을 구분한다.
- 조사 근거 및 적용 판단: SERVICE-RESEARCH.md. 타 서비스의 리뷰 수·보안 수준·수상 이력은 가져오지 않는다.
