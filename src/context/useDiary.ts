import { useContext } from "react";
import { DiaryContext, type DiaryContextValue } from "./diaryContextStore";

export function useDiary(): DiaryContextValue {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error("useDiary must be used within DiaryProvider");
  return ctx;
}
