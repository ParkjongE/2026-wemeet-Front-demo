import { Check } from "lucide-react";
import { characterArt } from "../../assets/art";
import type { ChildGender } from "../../types";

const OPTIONS: { value: ChildGender; label: string }[] = [
  { value: "girl", label: "여자아이" },
  { value: "boy", label: "남자아이" },
];

// 동화 속 주인공으로 그려질 캐릭터 고르기
export default function CharacterPicker({
  value,
  onChange,
}: {
  value: ChildGender | null;
  onChange: (value: ChildGender) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-brown">동화 속 주인공 모습</legend>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <label
              key={option.value}
              className={[
                "relative flex cursor-pointer flex-col items-center rounded-3xl border-2 bg-canvas px-2 pb-3 pt-2 transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ocean",
                active ? "border-sand bg-sand-light shadow-card" : "border-hairline hover:border-sand/60",
              ].join(" ")}
            >
              <input
                type="radio"
                name="character"
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <img src={characterArt[option.value].full} alt="" className="h-36 w-auto mix-blend-multiply soft-edges" />
              <span className="mt-1 text-sm font-semibold text-brown">{option.label}</span>
              {active && (
                <span className="animate-pop-in absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brown text-white">
                  <Check size={14} aria-hidden />
                </span>
              )}
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-brown/45">아이 사진 대신, 이 그림책 캐릭터가 이름을 달고 주인공이 돼요.</p>
    </fieldset>
  );
}
