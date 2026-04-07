import React from "react";
import { SectionHeader, RadioField, CheckboxField, TextField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  dataCheckbox: Record<string, string[]>;
  onChange: (field: string, value: string) => void;
  onChangeCheckbox: (field: string, values: string[]) => void;
}

const SectionIX: React.FC<Props> = ({ data, dataCheckbox, onChange, onChangeCheckbox }) => (
  <div className="form-card">
    <SectionHeader number="IX" title="INFRASTRUKTUR TEKNOLOGI INFORMASI DAN PENGELOLAAN DATA" />
    <div className="divide-y divide-border">
      <CheckboxField
        number="901"
        label="Bagaimana sistem pencatatan dan penyimpanan data di desa/kelurahan ini? (bisa lebih dari satu)"
        options={[
          { value: "A", label: "A. Disimpan dalam bentuk hardcopy" },
          { value: "B", label: "B. Disimpan dalam bentuk softcopy" },
          { value: "C", label: "C. Disimpan dalam website desa/kelurahan" },
        ]}
        values={dataCheckbox["901"] || []}
        onChange={(v) => onChangeCheckbox("901", v)}
      />

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">902</p>
        <div className="space-y-4">
          <RadioField
            number=""
            label="a. Apakah di desa/kelurahan ini sudah memiliki monografi/profil desa?"
            options={[
              { value: "1", label: "1. Ya" },
              { value: "2", label: "2. Tidak" },
            ]}
            value={data["902a"] || ""}
            onChange={(v) => onChange("902a", v)}
            vertical
          />
          {data["902a"] === "1" && (
            <RadioField
              number=""
              label="b. Apakah monografi/profil desa/kelurahan tersebut up to date?"
              options={[
                { value: "1", label: "1. Ya" },
                { value: "2", label: "2. Tidak" },
              ]}
              value={data["902b"] || ""}
              onChange={(v) => onChange("902b", v)}
              vertical
            />
          )}
          {data["902b"] === "2" && data["902a"] === "1" && (
            <RadioField
              number=""
              label="c. Jika monografi desa/kelurahan TIDAK up to date, apa penyebabnya?"
              options={[
                { value: "1", label: "1. Tidak ada SDM yang capable" },
                { value: "2", label: "2. Tidak ada sarana" },
                { value: "3", label: "3. Tidak ada anggaran" },
                { value: "4", label: "4. Tidak merasa perlu" },
                { value: "5", label: "5. Lainnya" },
              ]}
              value={data["902c"] || ""}
              onChange={(v) => onChange("902c", v)}
              vertical
            />
          )}
          {(data["902a"] === "2" || data["902b"] !== undefined) && (
            <RadioField
              number=""
              label="d. Menurut Bapak/Ibu, apakah desa/kelurahan perlu membuat monografi/profil desa/kelurahan?"
              options={[
                { value: "1", label: "1. Ya" },
                { value: "2", label: "2. Tidak" },
              ]}
              value={data["902d"] || ""}
              onChange={(v) => onChange("902d", v)}
              vertical
            />
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">903</p>
        <div className="space-y-4">
          <RadioField
            number=""
            label="a. Apakah di desa/kelurahan ini sudah mengelola Sistem Informasi Desa (SID)/Website Desa?"
            options={[
              { value: "1", label: "1. Ya" },
              { value: "2", label: "2. Tidak" },
            ]}
            value={data["903a"] || ""}
            onChange={(v) => onChange("903a", v)}
            vertical
          />
          {data["903a"] === "1" && (
            <TextField number="" label="b. Jika mengelola SID, apa alamat website-nya?" value={data["903b"] || ""} onChange={(v) => onChange("903b", v)} placeholder="https://..." />
          )}
          {data["903a"] === "1" && (
            <RadioField
              number=""
              label="c. Apakah terdapat data statistik pada SID/Website Desa?"
              options={[
                { value: "1", label: "1. Ya" },
                { value: "2", label: "2. Tidak" },
              ]}
              value={data["903c"] || ""}
              onChange={(v) => onChange("903c", v)}
              vertical
            />
          )}
          {data["903c"] === "1" && data["903a"] === "1" && (
            <RadioField
              number=""
              label="d. Apakah data statistik up to date?"
              options={[
                { value: "1", label: "1. Ya" },
                { value: "2", label: "2. Tidak" },
              ]}
              value={data["903d"] || ""}
              onChange={(v) => onChange("903d", v)}
              vertical
            />
          )}
          {data["903d"] === "2" && (
            <RadioField
              number=""
              label="e. Jika data statistik pada SID/Website tidak up to date, apa penyebabnya?"
              options={[
                { value: "1", label: "1. Tidak ada SDM yang capable" },
                { value: "2", label: "2. Tidak ada sarana" },
                { value: "3", label: "3. Tidak ada anggaran" },
                { value: "4", label: "4. Tidak merasa perlu" },
                { value: "5", label: "5. Lainnya" },
              ]}
              value={data["903e"] || ""}
              onChange={(v) => onChange("903e", v)}
              vertical
            />
          )}
          <RadioField
            number=""
            label="f. Menurut Bapak/Ibu, apakah saat ini desa/kelurahan membutuhkan data statistik yang up to date di SID/Website?"
            options={[
              { value: "1", label: "1. Ya" },
              { value: "2", label: "2. Tidak" },
            ]}
            value={data["903f"] || ""}
            onChange={(v) => onChange("903f", v)}
            vertical
          />
        </div>
      </div>
    </div>
  </div>
);

export default SectionIX;
