import React from "react";
import { SectionHeader } from "../form/FormField";
import IdentifikasiMasalahBlock from "../form/IdentifikasiMasalahBlock";

interface Props {
  data: Record<string, Record<string, string>>;
  onChange: (blockId: string, field: string, value: string) => void;
}

const blocks = [
  {
    id: "601",
    a: "Apakah ada penduduk di desa/kelurahan ini yang seharusnya menerima BPJS PBI namun tidak menerima?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang seharusnya menerima BPJS PBI namun tidak menerima?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah penduduk yang seharusnya menerima BPJS PBI namun tidak menerima tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "602",
    a: "Apakah ada keluarga di desa/kelurahan ini yang membutuhkan bantuan sosial (selain BPJS PBI) tetapi tidak mendapatkan?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang seharusnya menerima bantuan sosial (selain BPJS PBI) namun tidak menerima?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah penduduk yang seharusnya menerima bantuan sosial (selain BPJS PBI) namun tidak menerima tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "603",
    a: "Apakah ada penduduk di desa/kelurahan ini yang mengalami perubahan desil sehingga tidak menerima lagi bantuan sosial?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang mengalami perubahan desil sehingga tidak menerima lagi bantuan sosial?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah penduduk yang mengalami perubahan desil tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "604",
    a: "Apakah ada keluarga di desa/kelurahan ini yang memiliki rumah Tidak Layak Huni?",
    b: "Apakah desa/kelurahan memiliki data jumlah keluarga yang rumahnya tidak layak huni?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data rumah Tidak Layak Huni tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "605",
    a: "Apakah ada keluarga di desa/kelurahan ini yang memiliki sanitasi buruk?",
    b: "Apakah desa/kelurahan memiliki data jumlah keluarga yang memiliki sanitasi buruk?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah keluarga yang memiliki sanitasi buruk tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "606",
    a: "Apakah ada keluarga di desa/kelurahan ini yang memiliki sumber air minum buruk?",
    b: "Apakah desa/kelurahan memiliki data jumlah keluarga yang memiliki sumber air minum buruk?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah keluarga yang memiliki sumber air minum buruk tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "607",
    a: "Apakah ada penduduk yang stunting/kurang gizi di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang mengalami stunting/kurang gizi?",
    c: "Jika Ya, dari mana sumber data penduduk stunting/kurang gizi tersebut?",
    d: "Apakah data penduduk yang mengalami stunting/kurang gizi tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "608",
    a: "Apakah ada penduduk di desa/kelurahan ini yang menderita penyakit kronis?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk yang menderita penyakit kronis?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data jumlah penduduk yang menderita penyakit kronis tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "609",
    a: "Apakah ada penduduk disabilitas di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data jumlah penduduk disabilitas?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data penduduk disabilitas tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
  {
    id: "610",
    a: "Apakah ada keluarga yang seluruh anggotanya tidak bekerja (menganggur) di desa/kelurahan ini?",
    b: "Apakah desa/kelurahan memiliki data jumlah keluarga yang seluruh anggotanya tidak bekerja (menganggur)?",
    c: "Jika Ya, dari mana sumber data tersebut?",
    d: "Apakah data pengangguran tersebut dibutuhkan desa/kelurahan untuk penyusunan program?",
  },
];

const SectionVI: React.FC<Props> = ({ data, onChange }) => (
  <div className="form-card">
    <SectionHeader number="VI" title="IDENTIFIKASI PERMASALAHAN DESA/KELURAHAN" />
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

export default SectionVI;
