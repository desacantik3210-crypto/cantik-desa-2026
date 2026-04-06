import React from "react";
import { SectionHeader, TextField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionII: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="II" title="KETERANGAN PETUGAS" />
    <div className="divide-y divide-border">
      <TextField number="201" label="Nama Petugas" value={data["201"] || ""} onChange={(v) => onChange("201", v)} />
      <TextField number="202" label="Jabatan" value={data["202"] || ""} onChange={(v) => onChange("202", v)} />
      <TextField number="203" label="Tanggal Kunjungan" value={data["203"] || ""} onChange={(v) => onChange("203", v)} type="text" placeholder="dd/mm/yyyy" />
      <TextField number="204" label="Tanda Tangan" value={data["204"] || ""} onChange={(v) => onChange("204", v)} placeholder="Ketik nama sebagai tanda tangan" />
    </div>
  </div>
);

export default SectionII;
