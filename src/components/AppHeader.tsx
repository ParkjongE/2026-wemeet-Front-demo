import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  backTo?: string;
}

export default function AppHeader({ title, backTo = "/" }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          aria-label="이전 화면으로 돌아가기"
          className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 hover:bg-mint-light"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="truncate font-story text-lg text-brown">{title}</h1>
      </div>
      <Link
        to="/intro"
        className="flex min-h-11 shrink-0 items-center rounded-full px-3 text-xs font-medium text-brown/50 transition-colors hover:bg-mint-light hover:text-brown sm:text-sm"
      >
        서비스 소개
      </Link>
    </div>
  );
}
