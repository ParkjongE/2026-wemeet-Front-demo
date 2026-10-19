import { useState, type FormEvent } from "react";
import type { Credentials } from "../../api";
import Button from "../common/Button";
import TextField from "../common/TextField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CredentialsFormProps {
  submitLabel: string;
  isNewPassword: boolean;
  pending: boolean;
  serverError: string | null;
  onSubmit: (input: Credentials) => void;
}

export default function CredentialsForm({
  submitLabel,
  isNewPassword,
  pending,
  serverError,
  onSubmit,
}: CredentialsFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = !EMAIL_PATTERN.test(email.trim()) ? "이메일 형식을 확인해 주세요." : undefined;
  const passwordError = password.length < 8 ? "비밀번호는 8자 이상이어야 해요." : undefined;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (emailError || passwordError || pending) return;
    onSubmit({ email: email.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="이메일"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="parent@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={submitted ? emailError : undefined}
      />
      <TextField
        label="비밀번호"
        type="password"
        autoComplete={isNewPassword ? "new-password" : "current-password"}
        placeholder="8자 이상"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint={isNewPassword ? "8자 이상으로 만들어 주세요." : undefined}
        error={submitted ? passwordError : undefined}
      />
      {serverError && (
        <p role="alert" className="rounded-xl bg-coral-light/60 px-4 py-3 text-sm text-brown">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={pending} className="mt-1 w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
