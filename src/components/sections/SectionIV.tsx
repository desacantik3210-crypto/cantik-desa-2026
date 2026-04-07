import React from "react";
import { SectionHeader, TextField, RadioField } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionIV: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="IV" title="IDENTIFIKASI PROFIL DESA/KELURAHAN" />
    <div className="divide-y divide-border">
      <RadioField
        number="401"
        label="Topografi sebagian besar wilayah desa/kelurahan"
        options={[
          { value: "1", label: "1. Puncak/tebing" },
          { value: "2", label: "2. Lereng" },
          { value: "3", label: "3. Dataran" },
          { value: "4", label: "4. Lembah" },
        ]}
        value={data["401"] || ""}
        onChange={(v) => onChange("401", v)}
      />

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">402 — Jumlah Penduduk</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[6rem]">a. Laki-laki</span>
            <input type="number" className="form-input" value={data["402a"] || ""} onChange={(e) => onChange("402a", e.target.value)} />
            <span className="text-sm text-muted-foreground">orang</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[6rem]">b. Perempuan</span>
            <input type="number" className="form-input" value={data["402b"] || ""} onChange={(e) => onChange("402b", e.target.value)} />
            <span className="text-sm text-muted-foreground">orang</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[6rem]">c. Jumlah keluarga</span>
            <input type="number" className="form-input" value={data["402c"] || ""} onChange={(e) => onChange("402c", e.target.value)} />
            <span className="text-sm text-muted-foreground">keluarga</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[6rem]">d. Keluarga pertanian</span>
            <input type="number" className="form-input" value={data["402d"] || ""} onChange={(e) => onChange("402d", e.target.value)} />
            <span className="text-sm text-muted-foreground">keluarga</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">403 — Jumlah Fasilitas Pendidikan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "403a", label: "a. TK/RA/BA" },
            { key: "403b", label: "b. SD/sederajat" },
            { key: "403c", label: "c. SMP/sederajat" },
            { key: "403d", label: "d. SMA/sederajat" },
            { key: "403e", label: "e. Akademi/Perguruan Tinggi" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-sm font-medium min-w-[10rem]">{item.label}</span>
              <input type="number" className="form-input" value={data[item.key] || ""} onChange={(e) => onChange(item.key, e.target.value)} />
              <span className="text-sm text-muted-foreground">unit</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 py-3">
        <p className="question-number mb-3">404 — Jumlah Fasilitas Kesehatan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "404a", label: "a. Rumah Sakit" },
            { key: "404b", label: "b. Puskesmas" },
            { key: "404c", label: "c. Puskesmas Pembantu" },
            { key: "404d", label: "d. Poliklinik" },
            { key: "404e", label: "e. Tempat praktik dokter" },
            { key: "404f", label: "f. Tempat praktik bidan" },
            { key: "404g", label: "g. Poskesdes" },
            { key: "404h", label: "h. Polindes" },
            { key: "404i", label: "i. Apotek" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-sm font-medium min-w-[10rem]">{item.label}</span>
              <input type="number" className="form-input" value={data[item.key] || ""} onChange={(e) => onChange(item.key, e.target.value)} />
              <span className="text-sm text-muted-foreground">unit</span>
            </div>
          ))}
        </div>
      </div>

      <RadioField
        number="405"
        label="Sumber penghasilan utama sebagian besar penduduk desa/kelurahan berasal dari lapangan usaha:"
        options={[
          { value: "1", label: "1. Pertanian, kehutanan, perikanan" },
          { value: "2", label: "2. Pertambangan dan penggalian" },
          { value: "3", label: "3. Industri pengolahan" },
          { value: "4", label: "4. Pengadaan listrik, gas, uap/air panas, dan udara dingin" },
          { value: "5", label: "5. Treatment air, air limbah, dan pemulihan material" },
          { value: "6", label: "6. Konstruksi" },
          { value: "7", label: "7. Perdagangan besar dan eceran" },
          { value: "8", label: "8. Pengangkutan dan pergudangan" },
          { value: "9", label: "9. Penyediaan akomodasi dan makan minum" },
          { value: "10", label: "10. Informasi dan komunikasi" },
          { value: "11", label: "11. Aktivitas keuangan dan asuransi" },
          { value: "12", label: "12. Real estat" },
          { value: "13", label: "13. Aktivitas profesional, ilmiah, dan teknis" },
          { value: "14", label: "14. Aktivitas penyewaan dan ketenagakerjaan" },
          { value: "15", label: "15. Administrasi pemerintahan" },
          { value: "16", label: "16. Pendidikan" },
          { value: "17", label: "17. Aktivitas kesehatan dan sosial" },
          { value: "18", label: "18. Kesenian, hiburan, dan rekreasi" },
          { value: "19", label: "19. Aktivitas jasa lainnya" },
          { value: "20", label: "20. Aktivitas keluarga sebagai pemberi kerja" },
          { value: "21", label: "21. Aktivitas badan internasional" },
        ]}
        value={data["405"] || ""}
        onChange={(v) => onChange("405", v)}
        vertical
      />
    </div>
  </div>
);

export default SectionIV;
