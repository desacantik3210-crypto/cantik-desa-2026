import React from "react";
import { SectionHeader } from "../form/FormField";

interface Props {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const SectionVIII: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="VIII" title="KETERANGAN APARATUR PEMERINTAHAN DESA/KELURAHAN" />
    <div className="px-4 md:px-6 py-4">
      <p className="question-number mb-4">801</p>
      <div className="grid grid-cols-1 gap-4">
        {[
          { key: "801a", label: "a. Berapa jumlah seluruh aparatur di kantor desa/kelurahan ini? (termasuk kepala desa/kelurahan dan sekretaris desa/kelurahan)" },
          { key: "801b", label: "b. Dari sejumlah aparatur tersebut, ada berapa orang yang mampu mengoperasikan komputer/laptop?" },
          { key: "801c", label: "c. Dari sejumlah aparatur tersebut, ada berapa orang yang mampu mengolah data (membuat grafik, tabulasi data, dsb)?" },
          { key: "801d", label: "d. Dari sejumlah aparatur tersebut, ada berapa orang yang memiliki kemampuan menyusun monografi/profil desa/kelurahan?" },
          { key: "801e", label: "e. Dari sejumlah aparatur tersebut, ada berapa orang yang menguasai IT (mampu menyusun website)?" },
        ].map((item) => (
          <div key={item.key} className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="text-sm font-medium flex-1">{item.label}</span>
            <div className="flex items-center gap-2">
              <input type="number" className="form-input max-w-[8rem]" value={data[item.key] || ""} onChange={(e) => onChange(item.key, e.target.value)} />
              <span className="text-sm text-muted-foreground">orang</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SectionVIII;
