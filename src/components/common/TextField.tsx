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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brown">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={[
          "min-h-13 w-full rounded-2xl border bg-white px-4 text-base text-brown outline-none transition-colors placeholder:text-brown/30 focus:ring-4",
          error
            ? "border-error focus:ring-error/15"
            : "border-hairline focus:border-ocean focus:ring-ocean/15",
        ].join(" ")}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error">
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
