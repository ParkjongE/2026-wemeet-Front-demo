import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageStatus from "../components/common/FullPageStatus";
import { useAuth } from "./authContext";

function AuthPending() {
  const { status, retry, signOut } = useAuth();
  if (status === "error") {
    return (
      <FullPageStatus
        kind="error"
        message="정보를 불러오지 못했어요."
        onRetry={retry}
        secondaryAction={{ label: "다시 로그인하기", onClick: signOut }}
      />
    );
  }
  return <FullPageStatus kind="loading" />;
}

// 로그인한 사용자만 들어올 수 있다.
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (status !== "authenticated") return <AuthPending />;
  return <Outlet />;
}

// 아이 프로필이 있어야 들어올 수 있다. 없으면 온보딩으로 보낸다.
export function RequireChild() {
  const { child } = useAuth();
  if (!child) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

// 아이 프로필이 없을 때만 들어올 수 있다 (온보딩).
export function RequireNoChild() {
  const { child } = useAuth();
  if (child) return <Navigate to="/" replace />;
  return <Outlet />;
}

// 로그인하지 않은 사용자만 들어올 수 있다 (로그인·회원가입).
export function GuestOnly() {
  const { status } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  if (status === "authenticated") return <Navigate to={from ?? "/"} replace />;
  if (status === "loading") return <AuthPending />;
  return <Outlet />;
}
