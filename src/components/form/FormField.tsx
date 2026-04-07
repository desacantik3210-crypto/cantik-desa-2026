import React from "react";

interface TextFieldProps {
  number?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  suffix?: string;
  type?: "text" | "number";
  stack?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  number,
  label,
  value,
  onChange,
  placeholder = "",
  suffix,
  type = "text",
  stack = false,
}) => {
  const rowClass = stack ? "question-row-stack" : "question-row";
  return (
    <div className={rowClass}>
      {number && <span className="question-number">{number}</span>}
      <label className="question-label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {suffix && <span className="text-sm text-muted-foreground whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
};

interface RadioFieldProps {
  number?: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  vertical?: boolean;
  stack?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  number,
  label,
  options,
  value,
  onChange,
  vertical = false,
  stack = false,
}) => {
  const rowClass = vertical || stack ? "question-row-stack" : "question-row";
  return (
    <div className={rowClass}>
      {number && <span className="question-number">{number}</span>}
      <label className="question-label">{label}</label>
      <div className={vertical ? "flex flex-col gap-2 mt-1" : "flex flex-wrap gap-4"}>
        {options.map((opt) => (
          <label key={opt.value} className="radio-option">
            <input
              type="radio"
              name={`${number}-${label}`}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 accent-primary"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface CheckboxFieldProps {
  number?: string;
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (vals: string[]) => void;
  stack?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  number,
  label,
  options,
  values,
  onChange,
  stack = false,
}) => {
  const rowClass = stack ? "question-row-stack" : "question-row";
  return (
    <div className={rowClass}>
      {number && <span className="question-number">{number}</span>}
      <label className="question-label">{label}</label>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="radio-option">
            <input
              type="checkbox"
              value={opt.value}
              checked={values.includes(opt.value)}
              onChange={(e) => {
                if (e.target.checked) onChange([...values, opt.value]);
                else onChange(values.filter((v) => v !== opt.value));
              }}
              className="w-4 h-4 accent-primary"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  number: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, number }) => (
  <div className="section-header flex items-center gap-3">
    <span className="bg-primary-foreground/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
      {number}
    </span>
    <span>{title}</span>
  </div>
);

interface TextAreaFieldProps {
  number?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  stack?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  number,
  label,
  value,
  onChange,
  placeholder = "",
  stack = false,
}) => {
  const rowClass = stack ? "question-row-stack" : "question-row";
  return (
    <div className={rowClass}>
      {number && <span className="question-number">{number}</span>}
      <label className="question-label">{label}</label>
      <textarea
        className="form-input min-h-[80px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
