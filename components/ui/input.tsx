"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, Eye, EyeOff, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Text Input                                                         */
/*  Figma: States=Default|Focused|Filled|Error|Success|Disabled        */
/*  Container: h-48, rounded-12, border-[1.5px], px-16, gap-8         */
/*  Label: 12/16 medium, gap-4 above container                        */
/*  Value: 16/24 regular, tracking -0.9%                               */
/*  Helper: 12/16 regular, gap-4 below container                      */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
  label?: string;
  helper?: string;
  error?: string;
  success?: string;
  /** Show "Optional" tag next to label */
  optional?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helper,
      error,
      success,
      optional,
      leadingIcon,
      trailingIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const isError = Boolean(error);
    const isSuccess = Boolean(success);

    const borderClass = isError
      ? "border-error-border"
      : isSuccess
        ? "border-success-border"
        : disabled
          ? "border-border-primary bg-surface-secondary"
          : "border-border-primary focus-within:border-on-surface-primary";

    return (
      <div className="flex w-full flex-col gap-4">
        {/* Label row */}
        {label && (
          <div className="flex items-center gap-8">
            <label
              htmlFor={inputId}
              className="text-[12px] font-medium leading-[16px] text-on-surface-primary"
            >
              {label}
            </label>
            {optional && (
              <span className="text-[11px] font-normal leading-[16px] tracking-[0.005em] text-on-surface-tertiary">
                Optional
              </span>
            )}
          </div>
        )}

        {/* Container */}
        <div
          className={cn(
            "flex h-48 items-center gap-8 rounded-12 border-[1.5px] px-16 transition-colors",
            borderClass
          )}
        >
          {leadingIcon && (
            <div className="shrink-0 text-on-surface-tertiary">{leadingIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "h-full w-full bg-transparent text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none",
              "placeholder:text-on-surface-tertiary",
              "disabled:text-on-surface-tertiary disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={isError}
            aria-describedby={
              helper || error || success ? `${inputId}-desc` : undefined
            }
            {...props}
          />
          {trailingIcon && (
            <div className="shrink-0 text-on-surface-tertiary">{trailingIcon}</div>
          )}
        </div>

        {/* Helper / Error / Success */}
        {(helper || error || success) && (
          <p
            id={`${inputId}-desc`}
            className={cn(
              "text-[12px] font-normal leading-[16px]",
              isError
                ? "text-error-on-light"
                : isSuccess
                  ? "text-success-on-light"
                  : "text-on-surface-secondary"
            )}
          >
            {error ?? success ?? helper}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ------------------------------------------------------------------ */
/*  Search Input                                                       */
/*  Figma: Pill-shaped (rounded-full), leading search icon 24px        */
/*  Trailing X clear icon on focus/filled                              */
/* ------------------------------------------------------------------ */

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, disabled, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div
        className={cn(
          "flex h-48 w-full items-center gap-8 rounded-full border-[1.5px] bg-surface-primary px-16 transition-colors",
          disabled
            ? "border-border-primary !bg-surface-secondary"
            : "border-border-primary focus-within:border-on-surface-primary"
        )}
      >
        <Search className="h-24 w-24 shrink-0 text-on-surface-tertiary" />
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          className={cn(
            "h-full w-full bg-transparent text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none",
            "placeholder:text-on-surface-tertiary",
            "disabled:text-on-surface-tertiary disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            onClick={onClear}
            className="shrink-0 text-on-surface-tertiary"
            aria-label="Clear search"
          >
            <X className="h-16 w-16" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

/* ------------------------------------------------------------------ */
/*  Masked Input (Password)                                            */
/*  Figma: Same as TextInput + trailing eye toggle                     */
/* ------------------------------------------------------------------ */

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size" | "type"> {
  label?: string;
  helper?: string;
  error?: string;
  success?: string;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, label, helper, error, success, disabled, id, ...props }, ref) => {
    const [masked, setMasked] = React.useState(true);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const isError = Boolean(error);
    const isSuccess = Boolean(success);

    const borderClass = isError
      ? "border-error-border"
      : isSuccess
        ? "border-success-border"
        : disabled
          ? "border-border-primary bg-surface-secondary"
          : "border-border-primary focus-within:border-on-surface-primary";

    const EyeIcon = masked ? EyeOff : Eye;

    return (
      <div className="flex w-full flex-col gap-4">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium leading-[16px] text-on-surface-primary"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex h-48 items-center gap-8 rounded-12 border-[1.5px] px-16 transition-colors",
            borderClass
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type={masked ? "password" : "text"}
            disabled={disabled}
            className={cn(
              "h-full w-full bg-transparent text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none",
              "placeholder:text-on-surface-tertiary",
              "disabled:text-on-surface-tertiary",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setMasked(!masked)}
            className="shrink-0 text-on-surface-tertiary"
            aria-label={masked ? "Show password" : "Hide password"}
          >
            <EyeIcon className="h-24 w-24" />
          </button>
        </div>

        {(helper || error || success) && (
          <p
            className={cn(
              "text-[12px] font-normal leading-[16px]",
              isError
                ? "text-error-on-light"
                : isSuccess
                  ? "text-success-on-light"
                  : "text-on-surface-secondary"
            )}
          >
            {error ?? success ?? helper}
          </p>
        )}
      </div>
    );
  }
);
MaskedInput.displayName = "MaskedInput";

/* ------------------------------------------------------------------ */
/*  Code Input                                                         */
/*  Figma: 4 individual 48×48 boxes, rounded-12, gap-8                */
/* ------------------------------------------------------------------ */

export interface CodeInputProps {
  value?: string;
  length?: number;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CodeInput({
  value = "",
  length = 4,
  onChange,
  label,
  error,
  disabled = false,
  className,
}: CodeInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const isError = Boolean(error);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const newDigits = [...digits];
    newDigits[index] = char;
    const newValue = newDigits.join("").trim();
    onChange?.(newValue);
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {label && (
        <span className="text-[12px] font-medium leading-[16px] text-on-surface-primary">
          {label}
        </span>
      )}
      <div className="flex gap-8">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "flex h-48 w-48 items-center justify-center rounded-12 border-[1.5px] bg-surface-primary text-center text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none transition-colors",
              isError
                ? "border-error-border"
                : disabled
                  ? "border-border-primary bg-surface-secondary text-on-surface-tertiary"
                  : "border-border-primary focus:border-on-surface-primary"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-[12px] font-normal leading-[16px] text-error-on-light">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Multiline Input (Textarea)                                         */
/*  Figma node 132:876                                                 */
/*  Container: min-h-96, rounded-12, border-[1.5px], px-16 py-12      */
/*  Value: 16/24 regular, tracking -0.9%                               */
/* ------------------------------------------------------------------ */

export interface MultilineInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "prefix"> {
  label?: string;
  helper?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  /** Show character count. Pass maxLength to set limit. */
  showCharacterCount?: boolean;
}

export const MultilineInput = React.forwardRef<HTMLTextAreaElement, MultilineInputProps>(
  ({ className, label, helper, error, success, optional, showCharacterCount, disabled, id, maxLength, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [charCount, setCharCount] = React.useState(0);
    const isError = Boolean(error);
    const isSuccess = Boolean(success);

    const borderClass = isError
      ? "border-error-border"
      : isSuccess
        ? "border-success-border"
        : disabled
          ? "border-border-primary bg-surface-secondary"
          : "border-border-primary focus-within:border-on-surface-primary";

    return (
      <div className="flex w-full flex-col gap-4">
        {label && (
          <div className="flex items-center gap-8">
            <label htmlFor={inputId} className="text-[12px] font-medium leading-[16px] text-on-surface-primary">
              {label}
            </label>
            {optional && (
              <span className="text-[11px] font-normal leading-[16px] tracking-[0.005em] text-on-surface-tertiary">
                Optional
              </span>
            )}
          </div>
        )}
        <div className={cn("flex min-h-[96px] rounded-12 border-[1.5px] px-16 py-12 transition-colors", borderClass)}>
          <textarea
            ref={ref}
            id={inputId}
            disabled={disabled}
            maxLength={maxLength}
            onChange={(e) => {
              setCharCount(e.target.value.length);
              props.onChange?.(e);
            }}
            className={cn(
              "w-full resize-none bg-transparent text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none",
              "placeholder:text-on-surface-tertiary",
              "disabled:text-on-surface-tertiary disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={isError}
            {...props}
          />
        </div>
        {(helper || error || success || showCharacterCount) && (
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-[12px] font-normal leading-[16px]",
              isError ? "text-error-on-light" : isSuccess ? "text-success-on-light" : "text-on-surface-secondary"
            )}>
              {error ?? success ?? helper}
            </p>
            {showCharacterCount && (
              <span className="text-[12px] font-normal leading-[16px] text-on-surface-tertiary">
                {charCount}{maxLength ? `/${maxLength}` : ''}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
MultilineInput.displayName = "MultilineInput";

/* ------------------------------------------------------------------ */
/*  Phone Input                                                        */
/*  Figma node 136:192                                                 */
/*  Container: h-48, rounded-12, border-[1.5px]                       */
/*  Country prefix + divider + phone number input                      */
/* ------------------------------------------------------------------ */

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size" | "type"> {
  label?: string;
  helper?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  /** Country code e.g. "+1", "+44" */
  countryCode?: string;
  /** Country flag emoji e.g. "\u{1F1FA}\u{1F1F8}", "\u{1F1EC}\u{1F1E7}" */
  countryFlag?: string;
  /** Allow changing country */
  changeCountry?: boolean;
  /** Called when country selector is pressed */
  onCountryPress?: () => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label = "Phone number", helper, error, success, optional, countryCode = "+1", countryFlag = "\u{1F1FA}\u{1F1F8}", changeCountry = true, onCountryPress, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const isError = Boolean(error);
    const isSuccess = Boolean(success);

    const borderClass = isError
      ? "border-error-border"
      : isSuccess
        ? "border-success-border"
        : disabled
          ? "border-border-primary bg-surface-secondary"
          : "border-border-primary focus-within:border-on-surface-primary";

    return (
      <div className="flex w-full flex-col gap-4">
        {label && (
          <div className="flex items-center gap-8">
            <label htmlFor={inputId} className="text-[12px] font-medium leading-[16px] text-on-surface-primary">
              {label}
            </label>
            {optional && (
              <span className="text-[11px] font-normal leading-[16px] tracking-[0.005em] text-on-surface-tertiary">
                Optional
              </span>
            )}
          </div>
        )}
        <div className={cn("flex h-48 items-center rounded-12 border-[1.5px] transition-colors", borderClass)}>
          {/* Country prefix */}
          <button
            type="button"
            onClick={onCountryPress}
            disabled={disabled || !changeCountry}
            className={cn(
              "flex h-full shrink-0 items-center gap-4 pl-16 pr-12",
              changeCountry && !disabled && "cursor-pointer"
            )}
          >
            <span className="text-[16px]">{countryFlag}</span>
            <span className="text-[16px] font-medium leading-[24px] text-on-surface-primary">
              {countryCode}
            </span>
            {changeCountry && (
              <ChevronDown className="h-16 w-16 text-on-surface-tertiary" />
            )}
          </button>
          {/* Vertical divider */}
          <div className="h-24 w-px bg-border-primary" />
          {/* Phone input */}
          <input
            ref={ref}
            id={inputId}
            type="tel"
            disabled={disabled}
            className={cn(
              "h-full w-full bg-transparent px-12 text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-primary outline-none",
              "placeholder:text-on-surface-tertiary",
              "disabled:text-on-surface-tertiary disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={isError}
            {...props}
          />
        </div>
        {(helper || error || success) && (
          <p className={cn(
            "text-[12px] font-normal leading-[16px]",
            isError ? "text-error-on-light" : isSuccess ? "text-success-on-light" : "text-on-surface-secondary"
          )}>
            {error ?? success ?? helper}
          </p>
        )}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
