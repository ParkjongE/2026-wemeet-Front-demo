import { mockAuthApi } from "./auth";
import { mockChildrenApi } from "./children";
import { mockDiariesApi } from "./diaries";
import { mockStorybooksApi } from "./storybooks";
import { mockUploadsApi } from "./uploads";

export const mockApi = {
  ...mockAuthApi,
  ...mockChildrenApi,
  ...mockDiariesApi,
  ...mockUploadsApi,
  ...mockStorybooksApi,
};

export { DEMO_ACCOUNT } from "./seed";
export { resetMockDb } from "./db";
