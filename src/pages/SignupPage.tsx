import { Link } from "react-router-dom";
import { errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import CredentialsForm from "../components/Auth/CredentialsForm";
import { useSignup } from "../hooks/useAccount";
import { mascot } from "../mock/illustrations";

export default function SignupPage() {
  const signup = useSignup();

  return (
    <AuthLayout
      title="하루동화 시작하기"
      description="아이의 하루를 차곡차곡 모아 한 권의 동화로 만들어요."
      illustration={mascot.write}
    >
      <CredentialsForm
        submitLabel="가입하기"
        isNewPassword
        pending={signup.isPending}
        serverError={signup.isError ? errorMessage(signup.error) : null}
        onSubmit={(input) => signup.mutate(input)}
      />
      <p className="mt-6 text-center text-sm text-brown/60">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-medium text-coral-deep underline-offset-2 hover:underline">
          로그인
        </Link>
      </p>
    </AuthLayout>
  );
}
