import { useId, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export default function TextField({ label, hint, error, className = "", ...inputProps }: TextFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brown">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={[
          "min-h-12 w-full rounded-xl border bg-white px-4 text-base text-brown outline-none transition-colors placeholder:text-brown/30 focus:ring-2",
          error
            ? "border-coral-deep focus:ring-coral/40"
            : "border-hairline focus:border-mint-deep focus:ring-mint/50",
        ].join(" ")}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-coral-deep">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-brown/50">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
