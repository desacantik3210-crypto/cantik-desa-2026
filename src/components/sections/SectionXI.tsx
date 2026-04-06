import React from "react";
import { SectionHeader, TextAreaField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionXI: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="XI" title="CATATAN" />
    <div className="px-4 md:px-6 py-3">
      <TextAreaField
        number=""
        label="Catatan: Petugas dapat menanyakan pertanyaan lain yang diperlukan"
        value={data["catatan"] || ""}
        onChange={(v) => onChange("catatan", v)}
        placeholder="Tuliskan catatan tambahan di sini..."
      />
    </div>
  </div>
);

export default SectionXI;
