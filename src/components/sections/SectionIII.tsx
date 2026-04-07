import React from "react";
import { SectionHeader, TextField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionIII: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="III" title="KETERANGAN NARASUMBER" />
    <div className="divide-y divide-border">
      <TextField number="301" label="Nama Narasumber (Aparat Desa/Kelurahan)" value={data["301"] || ""} onChange={(v) => onChange("301", v)} />
      <TextField number="302" label="Jabatan" value={data["302"] || ""} onChange={(v) => onChange("302", v)} />
      <TextField number="303" label="Nomor HP/WA" value={data["303"] || ""} onChange={(v) => onChange("303", v)} />
      <TextField number="304" label="Tanda Tangan" value={data["304"] || ""} onChange={(v) => onChange("304", v)} placeholder="Ketik nama sebagai tanda tangan" />
    </div>
  </div>
);

export default SectionIII;
