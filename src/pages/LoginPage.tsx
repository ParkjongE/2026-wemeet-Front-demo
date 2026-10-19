import { Link } from "react-router-dom";
import { DEMO_ACCOUNT, USE_MOCK, errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import CredentialsForm from "../components/Auth/CredentialsForm";
import Button from "../components/common/Button";
import { useLogin } from "../hooks/useAccount";

export default function LoginPage() {
  const login = useLogin();

  return (
    <AuthLayout title="다시 만나서 반가워요" description="오늘의 하루를 기록하러 가볼까요?">
      <CredentialsForm
        submitLabel="로그인"
        isNewPassword={false}
        pending={login.isPending}
        serverError={login.isError ? errorMessage(login.error) : null}
        onSubmit={(input) => login.mutate(input)}
      />

      {USE_MOCK && (
        <div className="mt-5 rounded-2xl bg-yellow-light p-4 text-center">
          <p className="text-xs text-brown/70">
            목업 모드예요. 예시 기록이 담긴 데모 계정으로 바로 둘러볼 수 있어요.
          </p>
          <Button
            variant="ghost"
            className="mt-3 w-full"
            disabled={login.isPending}
            onClick={() => login.mutate(DEMO_ACCOUNT)}
          >
            데모 계정으로 체험하기
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-brown/60">
        아직 계정이 없나요?{" "}
        <Link to="/signup" className="font-medium text-coral-deep underline-offset-2 hover:underline">
          회원가입
        </Link>
      </p>
    </AuthLayout>
  );
}
