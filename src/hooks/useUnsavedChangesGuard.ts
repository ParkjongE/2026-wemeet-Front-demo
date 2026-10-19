import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

// 저장하지 않은 내용이 있으면 앱 안 이동(blocker)과 새로고침·탭 닫기(beforeunload)를 막는다.
// 저장에 성공한 뒤 이동할 때처럼 경고 없이 나가야 하면 allowLeave()를 먼저 부른다.
export function useUnsavedChangesGuard(when: boolean) {
  const bypassRef = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && !bypassRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (!bypassRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

  const allowLeave = useCallback(() => {
    bypassRef.current = true;
  }, []);

  return { blocker, allowLeave };
}
