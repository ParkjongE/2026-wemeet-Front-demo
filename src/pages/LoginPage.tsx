import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { DEMO_ACCOUNT, USE_MOCK, errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import CredentialsForm from "../components/Auth/CredentialsForm";
import Button from "../components/common/Button";
import { useLogin } from "../hooks/useAccount";

export default function LoginPage() {
  const login = useLogin();

  return (
    <AuthLayout title="다시 만나서 반가워요" description="오늘은 어떤 하루를 남겨 볼까요?">
      <CredentialsForm
        submitLabel="로그인"
        isNewPassword={false}
        pending={login.isPending}
        serverError={login.isError ? errorMessage(login.error) : null}
        onSubmit={(input) => login.mutate(input)}
      />

      {USE_MOCK && (
        <div className="mt-6 rounded-2xl bg-sand-light p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brown">
            <Sparkles size={16} className="text-sand-ink" aria-hidden />
            가입 없이 둘러보기
          </p>
          <p className="mt-1 text-xs leading-relaxed text-brown/60">
            서아네 가족의 한 달 기록과 그림동화 3권이 담긴 체험 계정이에요.
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            disabled={login.isPending}
            onClick={() => login.mutate(DEMO_ACCOUNT)}
          >
            체험 계정으로 둘러보기
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-brown/60">
        아직 계정이 없나요?{" "}
        <Link to="/signup" className="font-semibold text-ocean-deep underline-offset-2 hover:underline">
          회원가입
        </Link>
      </p>
    </AuthLayout>
  );
}
