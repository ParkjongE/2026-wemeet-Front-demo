import { Link } from "react-router-dom";
import { errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import CredentialsForm from "../components/Auth/CredentialsForm";
import { useSignup } from "../hooks/useAccount";
import { brandArt } from "../assets/art";

export default function SignupPage() {
  const signup = useSignup();

  return (
    <AuthLayout
      title="하루동화를 시작해요"
      description="아이의 하루를 차곡차곡 모아, 아이가 주인공인 그림동화로 만들어 드려요."
      illustration={brandArt.hero}
    >
      <CredentialsForm
        submitLabel="무료로 시작하기"
        isNewPassword
        pending={signup.isPending}
        serverError={signup.isError ? errorMessage(signup.error) : null}
        onSubmit={(input) => signup.mutate(input)}
      />
      <p className="mt-4 text-center text-xs leading-relaxed text-brown/45">
        가입하면 서비스 이용약관과 개인정보 처리방침에 동의하게 돼요.
      </p>
      <p className="mt-6 text-center text-sm text-brown/60">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-semibold text-ocean-deep underline-offset-2 hover:underline">
          로그인
        </Link>
      </p>
    </AuthLayout>
  );
}
