import React from "react";
import { SectionHeader, TextField, RadioField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionI: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="I" title="PENGENALAN TEMPAT" />
    <div className="divide-y divide-border">
      <TextField number="101" label="Provinsi" value={data["101"] || ""} onChange={(v) => onChange("101", v)} />
      <TextField number="102" label="Kabupaten/Kota *)" value={data["102"] || ""} onChange={(v) => onChange("102", v)} />
      <TextField number="103" label="Kecamatan" value={data["103"] || ""} onChange={(v) => onChange("103", v)} />
      <TextField number="104" label="Desa/Kelurahan *)" value={data["104"] || ""} onChange={(v) => onChange("104", v)} />
      <RadioField
        number="105"
        label="Status Daerah"
        options={[
          { value: "1", label: "1. Perkotaan" },
          { value: "2", label: "2. Perdesaan" },
        ]}
        value={data["105"] || ""}
        onChange={(v) => onChange("105", v)}
      />
    </div>
  </div>
);

export default SectionI;
