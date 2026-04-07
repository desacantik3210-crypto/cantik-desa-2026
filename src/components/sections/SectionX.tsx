import React from "react";
import { SectionHeader, TextAreaField, RadioField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionX: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="X" title="RESUME" />
    <div className="divide-y divide-border">
      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">1001</p>
        <div className="space-y-4">
          <TextAreaField
            number=""
            label="a. Berdasarkan hasil identifikasi masalah desa/kelurahan yang sudah dilakukan, data apa saja yang dibutuhkan untuk menyusun program di desa/kelurahan?"
            value={data["1001a"] || ""}
            onChange={(v) => onChange("1001a", v)}
          />
          <TextAreaField
            number=""
            label="b. Kegiatan statistik apa yang dibutuhkan oleh desa/kelurahan untuk mendapatkan pendampingan BPS Kabupaten/Kota?"
            value={data["1001b"] || ""}
            onChange={(v) => onChange("1001b", v)}
          />
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">1002</p>
        <div className="space-y-4">
          {[
            { key: "1002a", label: "a. Apakah pembinaan yang akan dilakukan, akan ada kegiatan pembinaan pengelolaan data?" },
            { key: "1002b", label: "b. Apakah pembinaan yang akan dilakukan, akan ada kegiatan pembinaan pengumpulan/pemutakhiran data?" },
            { key: "1002c", label: "c. Apakah pembinaan yang akan dilakukan, akan ada kegiatan pembinaan analisis/pemanfaatan data?" },
            { key: "1002d", label: "d. Apakah pembinaan yang akan dilakukan, akan ada kegiatan pembinaan penyajian data?" },
            { key: "1002e", label: "e. Apakah pembinaan yang akan dilakukan, akan ada kegiatan pengelolaan Website/SID Desa/Kelurahan?" },
          ].map((item) => (
            <RadioField
              key={item.key}
              number=""
              label={item.label}
              options={[
                { value: "1", label: "1. Ya" },
                { value: "2", label: "2. Tidak" },
              ]}
              value={data[item.key] || ""}
              onChange={(v) => onChange(item.key, v)}
              vertical
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SectionX;
