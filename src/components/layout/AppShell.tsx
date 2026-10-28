import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BookHeart, House, PenLine, Settings, BookPlus } from "lucide-react";
import { useCurrentChild } from "../../auth/authContext";
import { todayString } from "../../utils/date";
import CharacterAvatar from "../common/CharacterAvatar";
import Brand from "./Brand";

const NAV = [
  { to: "/", label: "홈", icon: House, end: true },
  { to: "/storybooks", label: "동화 서재", icon: BookHeart, end: true },
  { to: "/storybooks/new", label: "동화 만들기", icon: BookPlus, end: true },
];

// 로그인하고 아이가 있는 화면의 공통 틀. 넓은 화면은 위쪽 메뉴, 좁은 화면은 아래 탭을 쓴다.
export default function AppShell() {
  const child = useCurrentChild();
  const { pathname } = useLocation();
  const todayPath = `/diary/${todayString()}`;
  const onDiary = pathname.startsWith("/diary/");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-hairline/70 bg-canvas">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex min-h-11 items-center rounded-xl px-4 text-[15px] font-medium transition-colors",
                    isActive ? "bg-sand-light text-sand-ink" : "text-brown/60 hover:bg-sand-light/70 hover:text-brown",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <NavLink
              to={todayPath}
              className="hidden min-h-11 items-center gap-1.5 rounded-xl bg-sand px-4 text-sm font-semibold text-brown shadow-sm transition-colors hover:bg-sand-strong md:flex"
            >
              <PenLine size={16} aria-hidden />
              오늘 기록하기
            </NavLink>
            <NavLink
              to="/settings"
              aria-label={`${child.name} 프로필과 설정`}
              className="flex min-h-11 items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-sand-light md:pr-3"
            >
              <CharacterAvatar gender={child.gender} className="h-9 w-9" />
              <span className="hidden text-sm font-medium text-brown/80 md:inline">{child.name}</span>
            </NavLink>
          </div>
        </div>
      </header>

      <div className="pb-28 md:pb-16">
        <Outlet />
      </div>

      {/* 모바일 하단 탭 */}
      <nav
        aria-label="하단 메뉴"
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-white/95 backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
          <TabLink to="/" label="홈" icon={House} end />
          <TabLink to="/storybooks" label="서재" icon={BookHeart} end />
          <div className="flex justify-center">
            <NavLink
              to={todayPath}
              aria-label="오늘 기록하기"
              className={[
                "flex h-11 w-11 items-center justify-center rounded-lg transition-transform active:scale-95",
                onDiary ? "bg-brown text-white" : "bg-sand text-brown",
              ].join(" ")}
            >
              <PenLine size={24} aria-hidden />
            </NavLink>
          </div>
          <TabLink to="/storybooks/new" label="만들기" icon={BookPlus} end />
          <TabLink to="/settings" label="설정" icon={Settings} end />
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string;
  label: string;
  icon: typeof House;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
          isActive ? "text-brown" : "text-brown/45",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} aria-hidden />
          {label}
        </>
      )}
    </NavLink>
  );
}
