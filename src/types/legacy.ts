// 기존 동화 화면이 쓰던 타입. 5단계에서 동화 화면을 API 훅으로 옮기면서 삭제한다.
export interface LegacyStorybookPage {
  text: string;
  imageUrl: string;
}

export interface LegacyStorybook {
  id: string;
  title: string;
  lesson: string;
  protagonistName: string;
  periodStart: string;
  periodEnd: string;
  pages: LegacyStorybookPage[];
  createdAt: string;
}
