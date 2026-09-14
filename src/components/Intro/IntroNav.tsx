import { Link } from "react-router-dom";
import { mascot } from "../../mock/illustrations";

const MENU_LINKS = [
  { href: "#record", label: "하루 기록" },
  { href: "#ai-story", label: "AI 그림동화" },
  { href: "#preview", label: "동화 미리보기" },
];

export default function IntroNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <img src={mascot.wave} alt="" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
          <span className="truncate font-story text-base text-brown sm:text-lg">하루동화</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {MENU_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-brown/60 transition-colors hover:bg-mint-light hover:text-brown"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          to="/"
          className="shrink-0 rounded-full bg-coral px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 sm:px-5 sm:py-2"
        >
          시작하기
        </Link>
      </div>
    </header>
  );
}
