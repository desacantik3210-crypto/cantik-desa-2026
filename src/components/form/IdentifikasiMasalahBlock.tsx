import React from "react";

interface Props {
  id: string;
  questionA: string;
  questionB: string;
  questionC: string;
  questionD: string;
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const IdentifikasiMasalahBlock: React.FC<Props> = ({
  id,
  questionA,
  questionB,
  questionC,
  questionD,
  data,
  onChange,
}) => {
  const showB = data.a === "1";
  const showC = data.b === "1";
  const showD = data.a === "3" || data.b === "2" || (data.b === "1" && data.c !== "");

  return (
    <div className="border border-border rounded-md mb-4 overflow-hidden">
      <div className="bg-muted px-4 py-2 font-semibold text-sm text-primary">{id}</div>

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-start gap-2 mb-2">
          <span className="question-number text-sm">a</span>
          <span className="question-label">{questionA}</span>
        </div>
        <div className="flex gap-4 ml-6">
          {[
            { value: "1", label: "1. Ada" },
            { value: "2", label: "2. Tidak Ada" },
            { value: "3", label: "3. Tidak Tahu" },
          ].map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name={`${id}-a`}
                value={opt.value}
                checked={data.a === opt.value}
                onChange={() => onChange("a", opt.value)}
                className="w-4 h-4 accent-primary"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {showB && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2 mb-2">
            <span className="question-number text-sm">b</span>
            <span className="question-label">{questionB}</span>
          </div>
          <div className="flex gap-4 ml-6">
            {[
              { value: "1", label: "1. Ya" },
              { value: "2", label: "2. Tidak" },
            ].map((opt) => (
              <label key={opt.value} className="radio-option">
                <input
                  type="radio"
                  name={`${id}-b`}
                  value={opt.value}
                  checked={data.b === opt.value}
                  onChange={() => onChange("b", opt.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {showB && showC && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2 mb-2">
            <span className="question-number text-sm">c</span>
            <span className="question-label">{questionC}</span>
          </div>
          <input
            type="text"
            className="form-input ml-6 max-w-md"
            value={data.c}
            onChange={(e) => onChange("c", e.target.value)}
            placeholder="Tuliskan sumber data..."
          />
        </div>
      )}

      {(data.a === "3" || data.b === "2" || data.c !== "") && (
        <div className="px-4 py-3">
          <div className="flex items-start gap-2 mb-2">
            <span className="question-number text-sm">d</span>
            <span className="question-label">{questionD}</span>
          </div>
          <div className="flex gap-4 ml-6">
            {[
              { value: "1", label: "1. Ya" },
              { value: "2", label: "2. Tidak" },
            ].map((opt) => (
              <label key={opt.value} className="radio-option">
                <input
                  type="radio"
                  name={`${id}-d`}
                  value={opt.value}
                  checked={data.d === opt.value}
                  onChange={() => onChange("d", opt.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentifikasiMasalahBlock;
