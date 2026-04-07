import React from "react";
import { SectionHeader } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const numField = (
  label: string,
  key: string,
  suffix: string,
  data: Record<string, string>,
  onChange: (f: string, v: string) => void
) => (
  <div key={key} className="flex items-center gap-2">
    <span className="text-sm font-medium min-w-[16rem]">{label}</span>
    <input type="number" className="form-input max-w-[8rem]" value={data[key] || ""} onChange={(e) => onChange(key, e.target.value)} />
    <span className="text-sm text-muted-foreground">{suffix}</span>
  </div>
);

const SectionV: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="V" title="IDENTIFIKASI KONDISI SOSIAL EKONOMI DESA/KELURAHAN" />
    <div className="divide-y divide-border">
      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">501 — Jumlah penduduk usia kerja (15-64 tahun) menurut status pekerjaan</p>
        <div className="grid grid-cols-1 gap-3">
          {numField("a. Bekerja", "501a", "orang", data, onChange)}
          {numField("b. Tidak bekerja", "501b", "orang", data, onChange)}
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">502 — Jumlah penduduk usia kerja (15-64 tahun) menurut pendidikan terakhir</p>
        <div className="grid grid-cols-1 gap-3">
          {numField("a. Tidak tamat SD", "502a", "orang", data, onChange)}
          {numField("b. Tamat SD/sederajat", "502b", "orang", data, onChange)}
          {numField("c. Tamat SMP/sederajat", "502c", "orang", data, onChange)}
          {numField("d. Tamat SMA/sederajat", "502d", "orang", data, onChange)}
          {numField("e. Tamat Akademi/Perguruan Tinggi", "502e", "orang", data, onChange)}
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">503 — Jumlah penduduk menurut bantuan sosial ekonomi yang diterima</p>
        <div className="grid grid-cols-1 gap-3">
          {numField("a. Program Bantuan Sosial Sembako/BPNT", "503a", "orang", data, onChange)}
          {numField("b. Program Keluarga Harapan (PKH)", "503b", "orang", data, onChange)}
          {numField("c. Program Bantuan Langsung Tunai (BLT) Desa", "503c", "orang", data, onChange)}
          {numField("d. Program Subsidi Listrik", "503d", "orang", data, onChange)}
          {numField("e. Program Indonesia Pintar (PIP)", "503e", "orang", data, onChange)}
          {numField("f. Program BPJS PBI", "503f", "orang", data, onChange)}
          {numField("g. Bantuan Pemerintah Daerah Provinsi", "503g", "orang", data, onChange)}
          {numField("h. Bantuan Pemerintah Daerah Kab/Kota", "503h", "orang", data, onChange)}
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">504 — Jumlah industri kecil dan menengah</p>
        <div className="grid grid-cols-1 gap-3">
          {numField("a. Industri makanan", "504a", "unit", data, onChange)}
          {numField("b. Industri alat rumah tangga", "504b", "unit", data, onChange)}
          {numField("c. Industri material bahan bangunan", "504c", "unit", data, onChange)}
          {numField("d. Industri alat pertanian", "504d", "unit", data, onChange)}
          {numField("e. Industri kerajinan", "504e", "unit", data, onChange)}
          {numField("f. Rumah makan dan restoran", "504f", "unit", data, onChange)}
          {numField("g. Lainnya", "504g", "unit", data, onChange)}
        </div>
      </div>
    </div>
  </div>
);

export default SectionV;
