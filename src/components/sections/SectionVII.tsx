import React from "react";
import { SectionHeader } from "../form/FormField";
import IdentifikasiMasalahBlock from "../form/IdentifikasiMasalahBlock";

interface Props {
  data: Record<string, Record<string, string>>;
  onChange: (blockId: string, field: string, value: string) => void;
}

const blocks = [
  {
    id: "611",
    a: "Apakah ada penduduk yang tinggal sebatang kara (kesulitan untuk memenuhi kebutuhan hidupnya) di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang tinggal sebatang kara?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah penduduk yang tinggal sebatang kara tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "612",
    a: "Apakah ada lansia yang tinggal di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data jumlah lansia?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah lansia tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "613",
    a: "Apakah ada wilayah tanpa akses internet di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data wilayah tanpa akses internet?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah wilayah tanpa akses internet tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
];

const SectionVII: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="VII" title="IDENTIFIKASI POTENSI DI DESA/KELURAHAN" />
    <div className="p-4 md:p-6 space-y-2">
      {blocks.map((block) => (
        <IdentifikasiMasalahBlock
          key={block.id}
          id={block.id}
          questionA={block.a}
          questionB={block.b}
          questionC={block.c}
          questionD={block.d}
          data={data[block.id] || { a: "", b: "", c: "", d: "" }}
          onChange={(field, value) => onChange(block.id, field, value)}
        />
      ))}
    </div>
  </div>
);

export default SectionVII;
