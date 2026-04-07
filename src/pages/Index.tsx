import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import SectionI from "@/components/sections/SectionI";
import SectionII from "@/components/sections/SectionII";
import SectionIII from "@/components/sections/SectionIII";
import SectionIV from "@/components/sections/SectionIV";
import SectionV from "@/components/sections/SectionV";
import SectionVI from "@/components/sections/SectionVI";
import SectionVII from "@/components/sections/SectionVII";
import SectionVIII from "@/components/sections/SectionVIII";
import SectionIX from "@/components/sections/SectionIX";
import SectionX from "@/components/sections/SectionX";
import SectionXI from "@/components/sections/SectionXI";
import ThankYouPage from "@/components/sections/ThankYouPage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SECTIONS = [
  { num: "I", title: "Pengenalan Tempat" },
  { num: "II", title: "Keterangan Petugas" },
  { num: "III", title: "Keterangan Narasumber" },
  { num: "IV", title: "Profil Desa/Kelurahan" },
  { num: "V", title: "Kondisi Sosial Ekonomi" },
  { num: "VI", title: "Permasalahan" },
  { num: "VII", title: "Potensi" },
  { num: "VIII", title: "Aparatur Pemerintahan" },
  { num: "IX", title: "Infrastruktur TI" },
  { num: "X", title: "Resume" },
  { num: "XI", title: "Catatan" },
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>(
    {
      I: {
        101: "JAWA BARAT",
        102: "MAJALENGKA",
      },
    }
  );
  const [blockData, setBlockData] = useState<Record<string, Record<string, Record<string, string>>>>({});
  const [checkboxData, setCheckboxData] = useState<Record<string, Record<string, string[]>>>({});

  const updateField = useCallback((section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const updateBlockField = useCallback((section: string, blockId: string, field: string, value: string) => {
    setBlockData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [blockId]: { ...prev[section]?.[blockId], [field]: value },
      },
    }));
  }, []);

  const updateCheckbox = useCallback((section: string, field: string, values: string[]) => {
    setCheckboxData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: values },
    }));
  }, []);

  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Section-specific validation
  const validateCurrentSection = (sectionIndex: number): string[] => {
    const errors: string[] = [];

    const sectionValidations: Record<number, () => string[]> = {
      0: () => {
        // Section I
        const required: Record<string, string> = {
          "I_101": "[101] Provinsi",
          "I_102": "[102] Kabupaten/Kota",
          "I_103": "[103] Kecamatan",
          "I_104": "[104] Desa/Kelurahan",
          "I_105": "[105] Status Daerah",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
      1: () => {
        // Section II
        const required: Record<string, string> = {
          "II_201": "[201] Nama Petugas",
          "II_202": "[202] Jabatan Petugas",
          "II_203": "[203] Tanggal Kunjungan",
          "II_204": "[204] Tanda Tangan Petugas",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
      2: () => {
        // Section III
        const required: Record<string, string> = {
          "III_301": "[301] Nama Narasumber",
          "III_302": "[302] Jabatan Narasumber",
          "III_303": "[303] Nomor HP/WA",
          "III_304": "[304] Tanda Tangan Narasumber",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
      3: () => {
        // Section IV
        const sectionErrors: string[] = [];
        
        // 401: Topografi (required)
        if (!formData["IV"]?.["401"]) {
          sectionErrors.push("[401] Topografi");
        }
        
        // 402: Jumlah Penduduk (all sub-fields required)
        const pop402Fields = ["402a", "402b", "402c", "402d"];
        pop402Fields.forEach((field) => {
          if (!formData["IV"]?.[field]) {
            const labels: Record<string, string> = {
              "402a": "[402a] Jumlah Penduduk - Laki-laki",
              "402b": "[402b] Jumlah Penduduk - Perempuan",
              "402c": "[402c] Jumlah Keluarga",
              "402d": "[402d] Keluarga Pertanian",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        // 403: Fasilitas Pendidikan (all sub-fields required to have at least 0 or be filled)
        const edu403Fields = ["403a", "403b", "403c", "403d", "403e"];
        edu403Fields.forEach((field) => {
          if (formData["IV"]?.[field] === undefined || formData["IV"]?.[field] === "") {
            const labels: Record<string, string> = {
              "403a": "[403a] Fasilitas - TK/RA/BA",
              "403b": "[403b] Fasilitas - SD/sederajat",
              "403c": "[403c] Fasilitas - SMP/sederajat",
              "403d": "[403d] Fasilitas - SMA/sederajat",
              "403e": "[403e] Fasilitas - Akademi/Perguruan Tinggi",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        // 404: Fasilitas Kesehatan (all sub-fields required)
        const health404Fields = ["404a", "404b", "404c", "404d", "404e", "404f", "404g", "404h", "404i"];
        health404Fields.forEach((field) => {
          if (formData["IV"]?.[field] === undefined || formData["IV"]?.[field] === "") {
            const labels: Record<string, string> = {
              "404a": "[404a] Fasilitas - Rumah Sakit",
              "404b": "[404b] Fasilitas - Puskesmas",
              "404c": "[404c] Fasilitas - Puskesmas Pembantu",
              "404d": "[404d] Fasilitas - Poliklinik",
              "404e": "[404e] Fasilitas - Tempat praktik dokter",
              "404f": "[404f] Fasilitas - Tempat praktik bidan",
              "404g": "[404g] Fasilitas - Poskesdes",
              "404h": "[404h] Fasilitas - Polindes",
              "404i": "[404i] Fasilitas - Apotek",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        // 405: Sumber Penghasilan Utama (required)
        if (!formData["IV"]?.["405"]) {
          sectionErrors.push("[405] Sumber Penghasilan Utama");
        }
        
        return sectionErrors;
      },
      4: () => {
        // Section V
        const sectionErrors: string[] = [];
        
        // 501: Status Pekerjaan (required)
        if (!formData["V"]?.["501a"]) sectionErrors.push("[501a] Penduduk Bekerja");
        if (!formData["V"]?.["501b"]) sectionErrors.push("[501b] Penduduk Tidak Bekerja");
        
        // 502: Pendidikan (all required)
        const edu502Fields = ["502a", "502b", "502c", "502d", "502e"];
        edu502Fields.forEach((field) => {
          if (!formData["V"]?.[field]) {
            const labels: Record<string, string> = {
              "502a": "[502a] Tidak tamat SD",
              "502b": "[502b] Tamat SD",
              "502c": "[502c] Tamat SMP",
              "502d": "[502d] Tamat SMA",
              "502e": "[502e] Tamat Akademi/PT",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        // 503: Bantuan Sosial (all required)
        const social503Fields = ["503a", "503b", "503c", "503d", "503e", "503f", "503g", "503h"];
        social503Fields.forEach((field) => {
          if (!formData["V"]?.[field]) {
            const labels: Record<string, string> = {
              "503a": "[503a] Bantuan - BPNT",
              "503b": "[503b] Bantuan - PKH",
              "503c": "[503c] Bantuan - BLT Desa",
              "503d": "[503d] Bantuan - Subsidi Listrik",
              "503e": "[503e] Bantuan - Indonesia Pintar",
              "503f": "[503f] Bantuan - BPJS PBI",
              "503g": "[503g] Bantuan - Prov",
              "503h": "[503h] Bantuan - Kab/Kota",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        // 504: Industri Kecil Menengah (all required)
        const industry504Fields = ["504a", "504b", "504c", "504d", "504e", "504f", "504g"];
        industry504Fields.forEach((field) => {
          if (!formData["V"]?.[field]) {
            const labels: Record<string, string> = {
              "504a": "[504a] Industri - Makanan",
              "504b": "[504b] Industri - Alat Rumah Tangga",
              "504c": "[504c] Industri - Material Bahan",
              "504d": "[504d] Industri - Alat Pertanian",
              "504e": "[504e] Industri - Kerajinan",
              "504f": "[504f] Industri - Rumah Makan",
              "504g": "[504g] Industri - Lainnya",
            };
            sectionErrors.push(labels[field]);
          }
        });
        
        return sectionErrors;
      },
      5: () => {
        // Section VI - Identifikasi Masalah
        const sectionErrors: string[] = [];
        const blocks = ["601", "602", "603", "604", "605", "606", "607", "608", "609", "610"];
        blocks.forEach((blockId) => {
          const blockData_section = blockData["VI"]?.[blockId];
          // Field a is always required
          if (!blockData_section?.["a"]) {
            sectionErrors.push(`[VI.${blockId}] Pertanyaan A`);
          }
          // If a === "1" (Ada), then b is required
          if (blockData_section?.["a"] === "1" && !blockData_section?.["b"]) {
            sectionErrors.push(`[VI.${blockId}] Pertanyaan B`);
          }
          // If a === "1" and b === "1", then c is required
          if (blockData_section?.["a"] === "1" && blockData_section?.["b"] === "1" && !blockData_section?.["c"]) {
            sectionErrors.push(`[VI.${blockId}] Pertanyaan C`);
          }
          // If d is visible, it's required: a === "3" OR b === "2" OR (b === "1" && c !== "")
          const showD = blockData_section?.["a"] === "3" || blockData_section?.["b"] === "2" || (blockData_section?.["b"] === "1" && blockData_section?.["c"]);
          if (showD && !blockData_section?.["d"]) {
            sectionErrors.push(`[VI.${blockId}] Pertanyaan D`);
          }
        });
        return sectionErrors;
      },
      6: () => {
        // Section VII - Identifikasi Potensi
        const sectionErrors: string[] = [];
        const blocks = ["611", "612", "613"];
        blocks.forEach((blockId) => {
          const blockData_section = blockData["VII"]?.[blockId];
          // Field a is always required
          if (!blockData_section?.["a"]) {
            sectionErrors.push(`[VII.${blockId}] Pertanyaan A`);
          }
          // If a === "1" (Ada), then b is required
          if (blockData_section?.["a"] === "1" && !blockData_section?.["b"]) {
            sectionErrors.push(`[VII.${blockId}] Pertanyaan B`);
          }
          // If a === "1" and b === "1", then c is required
          if (blockData_section?.["a"] === "1" && blockData_section?.["b"] === "1" && !blockData_section?.["c"]) {
            sectionErrors.push(`[VII.${blockId}] Pertanyaan C`);
          }
          // If d is visible, it's required: a === "3" OR b === "2" OR (b === "1" && c !== "")
          const showD = blockData_section?.["a"] === "3" || blockData_section?.["b"] === "2" || (blockData_section?.["b"] === "1" && blockData_section?.["c"]);
          if (showD && !blockData_section?.["d"]) {
            sectionErrors.push(`[VII.${blockId}] Pertanyaan D`);
          }
        });
        return sectionErrors;
      },
      7: () => {
        // Section VIII
        const required: Record<string, string> = {
          "VIII_801a": "[801a] Jumlah Aparatur",
          "VIII_801b": "[801b] Aparatur - Komputer",
          "VIII_801c": "[801c] Aparatur - Olah Data",
          "VIII_801d": "[801d] Aparatur - Monografi",
          "VIII_801e": "[801e] Aparatur - IT/Website",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
      8: () => {
        // Section IX - Infrastruktur TI
        const sectionErrors: string[] = [];
        
        // 901: Checkbox - at least one should be selected (optional for now, user can continue)
        // No validation needed if empty
        
        // 902: Monografi/Profil Desa
        if (!formData["IX"]?.["902a"]) {
          sectionErrors.push("[902a] Apakah ada monografi/profil desa?");
        } else if (formData["IX"]["902a"] === "1") {
          // If a = "1" (Ada), then b is required
          if (!formData["IX"]?.["902b"]) {
            sectionErrors.push("[902b] Apakah monografi up to date?");
          } else if (formData["IX"]["902b"] === "2") {
            // If b = "2" (Tidak), then c is required
            if (!formData["IX"]?.["902c"]) {
              sectionErrors.push("[902c] Apa penyebabnya tidak up to date?");
            }
          }
        }
        
        // 902d: visible if a = "2" or b !== undefined (always show if a has value)
        if (formData["IX"]["902a"] === "2" || formData["IX"]?.["902b"] !== undefined) {
          if (!formData["IX"]?.["902d"]) {
            sectionErrors.push("[902d] Apakah perlu membuat monografi desa?");
          }
        }
        
        // 903: SID/Website Desa
        if (!formData["IX"]?.["903a"]) {
          sectionErrors.push("[903a] Apakah ada SID/Website Desa?");
        } else if (formData["IX"]["903a"] === "1") {
          // If a = "1", then b and c are required
          if (!formData["IX"]?.["903b"]) {
            sectionErrors.push("[903b] Apa alamat website-nya?");
          }
          if (!formData["IX"]?.["903c"]) {
            sectionErrors.push("[903c] Apakah terdapat data statistik pada SID?");
          } else if (formData["IX"]["903c"] === "1") {
            // If c = "1" (ada data statistik), then d is required
            if (!formData["IX"]?.["903d"]) {
              sectionErrors.push("[903d] Apakah data statistik up to date?");
            } else if (formData["IX"]["903d"] === "2") {
              // If d = "2" (tidak up to date), then e is required
              if (!formData["IX"]?.["903e"]) {
                sectionErrors.push("[903e] Apa penyebabnya data tidak up to date?");
              }
            }
          }
        }
        
        // 903f: Always required
        if (!formData["IX"]?.["903f"]) {
          sectionErrors.push("[903f] Apakah desa membutuhkan data statistik up to date?");
        }
        
        return sectionErrors;
      },
      9: () => {
        // Section X - Resume
        const required: Record<string, string> = {
          "X_1001a": "[1001a] Resume 1001.a - Data untuk Program",
          "X_1001b": "[1001b] Resume 1001.b - Kegiatan Statistik",
          "X_1002a": "[1002a] Resume 1002.a - Pembinaan Pengelolaan Data",
          "X_1002b": "[1002b] Resume 1002.b - Pembinaan Pengumpulan Data",
          "X_1002c": "[1002c] Resume 1002.c - Pembinaan Analisis Data",
          "X_1002d": "[1002d] Resume 1002.d - Pembinaan Penyajian Data",
          "X_1002e": "[1002e] Resume 1002.e - Pembinaan Website/SID",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
      10: () => {
        // Section XI - Catatan
        const required: Record<string, string> = {
          "XI_catatan": "[XI] Catatan Tambahan",
        };
        const sectionErrors: string[] = [];
        Object.entries(required).forEach(([key, label]) => {
          const [section, field] = key.split("_");
          if (!formData[section]?.[field]) sectionErrors.push(label);
        });
        return sectionErrors;
      },
    };

    return sectionValidations[sectionIndex]?.() || [];
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Section I
    const required1: Record<string, string> = {
      "I_101": "[101] Provinsi",
      "I_102": "[102] Kabupaten/Kota",
      "I_103": "[103] Kecamatan",
      "I_104": "[104] Desa/Kelurahan",
      "I_105": "[105] Status Daerah",
    };
    Object.entries(required1).forEach(([key, label]) => {
      const [section, field] = key.split("_");
      if (!formData[section]?.[field]) errors.push(label);
    });

    // Section II
    const required2: Record<string, string> = {
      "II_201": "[201] Nama Petugas",
      "II_202": "[202] Jabatan Petugas",
      "II_203": "[203] Tanggal Kunjungan",
      "II_204": "[204] Tanda Tangan Petugas",
    };
    Object.entries(required2).forEach(([key, label]) => {
      const [section, field] = key.split("_");
      if (!formData[section]?.[field]) errors.push(label);
    });

    // Section III
    const required3: Record<string, string> = {
      "III_301": "[301] Nama Narasumber",
      "III_302": "[302] Jabatan Narasumber",
      "III_303": "[303] Nomor HP/WA",
      "III_304": "[304] Tanda Tangan Narasumber",
    };
    Object.entries(required3).forEach(([key, label]) => {
      const [section, field] = key.split("_");
      if (!formData[section]?.[field]) errors.push(label);
    });

    // Section IV - with all sub-fields
    if (!formData["IV"]?.["401"]) errors.push("[401] Topografi");
    const pop402Fields = ["402a", "402b", "402c", "402d"];
    pop402Fields.forEach((field) => {
      if (!formData["IV"]?.[field]) {
        const labels: Record<string, string> = {
          "402a": "[402a] Jumlah Penduduk - Laki-laki",
          "402b": "[402b] Jumlah Penduduk - Perempuan",
          "402c": "[402c] Jumlah Keluarga",
          "402d": "[402d] Keluarga Pertanian",
        };
        errors.push(labels[field]);
      }
    });
    const edu403Fields = ["403a", "403b", "403c", "403d", "403e"];
    edu403Fields.forEach((field) => {
      if (formData["IV"]?.[field] === undefined || formData["IV"]?.[field] === "") {
        const labels: Record<string, string> = {
          "403a": "[403a] Fasilitas - TK/RA/BA",
          "403b": "[403b] Fasilitas - SD/sederajat",
          "403c": "[403c] Fasilitas - SMP/sederajat",
          "403d": "[403d] Fasilitas - SMA/sederajat",
          "403e": "[403e] Fasilitas - Akademi/Perguruan Tinggi",
        };
        errors.push(labels[field]);
      }
    });
    const health404Fields = ["404a", "404b", "404c", "404d", "404e", "404f", "404g", "404h", "404i"];
    health404Fields.forEach((field) => {
      if (formData["IV"]?.[field] === undefined || formData["IV"]?.[field] === "") {
        const labels: Record<string, string> = {
          "404a": "[404a] Fasilitas - Rumah Sakit",
          "404b": "[404b] Fasilitas - Puskesmas",
          "404c": "[404c] Fasilitas - Puskesmas Pembantu",
          "404d": "[404d] Fasilitas - Poliklinik",
          "404e": "[404e] Fasilitas - Tempat praktik dokter",
          "404f": "[404f] Fasilitas - Tempat praktik bidan",
          "404g": "[404g] Fasilitas - Poskesdes",
          "404h": "[404h] Fasilitas - Polindes",
          "404i": "[404i] Fasilitas - Apotek",
        };
        errors.push(labels[field]);
      }
    });
    if (!formData["IV"]?.["405"]) errors.push("[405] Sumber Penghasilan Utama");

    // Section V - with all sub-fields
    if (!formData["V"]?.["501a"]) errors.push("[501a] Penduduk Bekerja");
    if (!formData["V"]?.["501b"]) errors.push("[501b] Penduduk Tidak Bekerja");
    const edu502Fields = ["502a", "502b", "502c", "502d", "502e"];
    edu502Fields.forEach((field) => {
      if (!formData["V"]?.[field]) {
        const labels: Record<string, string> = {
          "502a": "[502a] Tidak tamat SD",
          "502b": "[502b] Tamat SD",
          "502c": "[502c] Tamat SMP",
          "502d": "[502d] Tamat SMA",
          "502e": "[502e] Tamat Akademi/PT",
        };
        errors.push(labels[field]);
      }
    });
    const social503Fields = ["503a", "503b", "503c", "503d", "503e", "503f", "503g", "503h"];
    social503Fields.forEach((field) => {
      if (!formData["V"]?.[field]) {
        const labels: Record<string, string> = {
          "503a": "[503a] Bantuan - BPNT",
          "503b": "[503b] Bantuan - PKH",
          "503c": "[503c] Bantuan - BLT Desa",
          "503d": "[503d] Bantuan - Subsidi Listrik",
          "503e": "[503e] Bantuan - Indonesia Pintar",
          "503f": "[503f] Bantuan - BPJS PBI",
          "503g": "[503g] Bantuan - Prov",
          "503h": "[503h] Bantuan - Kab/Kota",
        };
        errors.push(labels[field]);
      }
    });
    const industry504Fields = ["504a", "504b", "504c", "504d", "504e", "504f", "504g"];
    industry504Fields.forEach((field) => {
      if (!formData["V"]?.[field]) {
        const labels: Record<string, string> = {
          "504a": "[504a] Industri - Makanan",
          "504b": "[504b] Industri - Alat Rumah Tangga",
          "504c": "[504c] Industri - Material Bahan",
          "504d": "[504d] Industri - Alat Pertanian",
          "504e": "[504e] Industri - Kerajinan",
          "504f": "[504f] Industri - Rumah Makan",
          "504g": "[504g] Industri - Lainnya",
        };
        errors.push(labels[field]);
      }
    });

    // Section VIII
    const required8: Record<string, string> = {
      "VIII_801a": "[801a] Jumlah Aparatur",
      "VIII_801b": "[801b] Aparatur - Komputer",
      "VIII_801c": "[801c] Aparatur - Olah Data",
      "VIII_801d": "[801d] Aparatur - Monografi",
      "VIII_801e": "[801e] Aparatur - IT/Website",
    };
    Object.entries(required8).forEach(([key, label]) => {
      const [section, field] = key.split("_");
      if (!formData[section]?.[field]) errors.push(label);
    });

    // Check SectionVI fields (Identifikasi Masalah - blocks 601-610)
    const section6Blocks = ["601", "602", "603", "604", "605", "606", "607", "608", "609", "610"];
    section6Blocks.forEach((blockId) => {
      const blockData_section = blockData["VI"]?.[blockId];
      if (!blockData_section?.["a"]) {
        errors.push(`[VI.${blockId}] Pertanyaan A`);
      }
      if (blockData_section?.["a"] === "1" && !blockData_section?.["b"]) {
        errors.push(`[VI.${blockId}] Pertanyaan B`);
      }
      if (blockData_section?.["a"] === "1" && blockData_section?.["b"] === "1" && !blockData_section?.["c"]) {
        errors.push(`[VI.${blockId}] Pertanyaan C`);
      }
      const showD = blockData_section?.["a"] === "3" || blockData_section?.["b"] === "2" || (blockData_section?.["b"] === "1" && blockData_section?.["c"]);
      if (showD && !blockData_section?.["d"]) {
        errors.push(`[VI.${blockId}] Pertanyaan D`);
      }
    });

    // Check SectionVII fields (Potensi - blocks 611-613)
    const section7Blocks = ["611", "612", "613"];
    section7Blocks.forEach((blockId) => {
      const blockData_section = blockData["VII"]?.[blockId];
      if (!blockData_section?.["a"]) {
        errors.push(`[VII.${blockId}] Pertanyaan A`);
      }
      if (blockData_section?.["a"] === "1" && !blockData_section?.["b"]) {
        errors.push(`[VII.${blockId}] Pertanyaan B`);
      }
      if (blockData_section?.["a"] === "1" && blockData_section?.["b"] === "1" && !blockData_section?.["c"]) {
        errors.push(`[VII.${blockId}] Pertanyaan C`);
      }
      const showD = blockData_section?.["a"] === "3" || blockData_section?.["b"] === "2" || (blockData_section?.["b"] === "1" && blockData_section?.["c"]);
      if (showD && !blockData_section?.["d"]) {
        errors.push(`[VII.${blockId}] Pertanyaan D`);
      }
    });

    // Check Section IX fields (Infrastruktur TI - conditional)
    if (!formData["IX"]?.["902a"]) {
      errors.push("[902a] Apakah ada monografi/profil desa?");
    } else if (formData["IX"]["902a"] === "1") {
      if (!formData["IX"]?.["902b"]) {
        errors.push("[902b] Apakah monografi up to date?");
      } else if (formData["IX"]["902b"] === "2") {
        if (!formData["IX"]?.["902c"]) {
          errors.push("[902c] Apa penyebabnya tidak up to date?");
        }
      }
    }
    if (formData["IX"]["902a"] === "2" || formData["IX"]?.["902b"] !== undefined) {
      if (!formData["IX"]?.["902d"]) {
        errors.push("[902d] Apakah perlu membuat monografi desa?");
      }
    }
    
    if (!formData["IX"]?.["903a"]) {
      errors.push("[903a] Apakah ada SID/Website Desa?");
    } else if (formData["IX"]["903a"] === "1") {
      if (!formData["IX"]?.["903b"]) {
        errors.push("[903b] Apa alamat website-nya?");
      }
      if (!formData["IX"]?.["903c"]) {
        errors.push("[903c] Apakah terdapat data statistik pada SID?");
      } else if (formData["IX"]["903c"] === "1") {
        if (!formData["IX"]?.["903d"]) {
          errors.push("[903d] Apakah data statistik up to date?");
        } else if (formData["IX"]["903d"] === "2") {
          if (!formData["IX"]?.["903e"]) {
            errors.push("[903e] Apa penyebabnya data tidak up to date?");
          }
        }
      }
    }
    if (!formData["IX"]?.["903f"]) {
      errors.push("[903f] Apakah desa membutuhkan data statistik up to date?");
    }

    // Section X - Resume
    const required10: Record<string, string> = {
      "X_1001a": "[1001a] Resume 1001.a - Data untuk Program",
      "X_1001b": "[1001b] Resume 1001.b - Kegiatan Statistik",
      "X_1002a": "[1002a] Resume 1002.a - Pembinaan Pengelolaan Data",
      "X_1002b": "[1002b] Resume 1002.b - Pembinaan Pengumpulan Data",
      "X_1002c": "[1002c] Resume 1002.c - Pembinaan Analisis Data",
      "X_1002d": "[1002d] Resume 1002.d - Pembinaan Penyajian Data",
      "X_1002e": "[1002e] Resume 1002.e - Pembinaan Website/SID",
    };
    Object.entries(required10).forEach(([key, label]) => {
      const [section, field] = key.split("_");
      if (!formData[section]?.[field]) errors.push(label);
    });

    // Section XI - Catatan
    if (!formData["XI"]?.["catatan"]) {
      errors.push("[XI] Catatan Tambahan");
    }

    return errors.sort();
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error(`Ada ${errors.length} field yang wajib diisi!`);
      return;
    }
    setValidationErrors([]);
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("write-sheet", {
        body: { formData, blockData, checkboxData },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Data berhasil disimpan ke spreadsheet!");
      setSubmitted(true);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Gagal menyimpan: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: return <SectionI data={formData["I"] || {}} onChange={(f, v) => updateField("I", f, v)} />;
      case 1: return <SectionII data={formData["II"] || {}} onChange={(f, v) => updateField("II", f, v)} />;
      case 2: return <SectionIII data={formData["III"] || {}} onChange={(f, v) => updateField("III", f, v)} />;
      case 3: return <SectionIV data={formData["IV"] || {}} onChange={(f, v) => updateField("IV", f, v)} />;
      case 4: return <SectionV data={formData["V"] || {}} onChange={(f, v) => updateField("V", f, v)} />;
      case 5: return <SectionVI data={blockData["VI"] || {}} onChange={(bId, f, v) => updateBlockField("VI", bId, f, v)} />;
      case 6: return <SectionVII data={blockData["VII"] || {}} onChange={(bId, f, v) => updateBlockField("VII", bId, f, v)} />;
      case 7: return <SectionVIII data={formData["VIII"] || {}} onChange={(f, v) => updateField("VIII", f, v)} />;
      case 8: return <SectionIX data={formData["IX"] || {}} dataCheckbox={checkboxData["IX"] || {}} onChange={(f, v) => updateField("IX", f, v)} onChangeCheckbox={(f, vs) => updateCheckbox("IX", f, vs)} />;
      case 9: return <SectionX data={formData["X"] || {}} onChange={(f, v) => updateField("X", f, v)} />;
      case 10: return <SectionXI data={formData["XI"] || {}} onChange={(f, v) => updateField("XI", f, v)} />;
      default: return null;
    }
  };

  if (submitted) {
    return (
      <ThankYouPage
        formData={formData}
        blockData={blockData}
        checkboxData={checkboxData}
        onEdit={() => setSubmitted(false)}
        onNewEntry={() => {
          setFormData({});
          setBlockData({});
          setCheckboxData({});
          setCurrentSection(0);
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Instrumen Kebutuhan Desa/Kelurahan Cantik Tahun 2026
              </h1>
              <p className="text-sm opacity-80 mt-1">
                Identifikasi Kebutuhan Desa/Kelurahan Cinta Statistik
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <div className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {SECTIONS.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSection(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  idx === currentSection
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  idx === currentSection
                    ? "bg-primary-foreground/20"
                    : "bg-muted"
                }`}>
                  {idx + 1}
                </span>
                <span className="hidden md:inline">{sec.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderSection()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pb-8">
          <Button
            variant="outline"
            onClick={() => {
              setValidationErrors([]);
              setCurrentSection((p) => Math.max(0, p - 1));
            }}
            disabled={currentSection === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {currentSection < SECTIONS.length - 1 ? (
            <div className="flex flex-col items-end gap-3">
              <Button
                onClick={() => {
                  const errors = validateCurrentSection(currentSection);
                  if (errors.length > 0) {
                    setValidationErrors(errors);
                    toast.error(`Ada ${errors.length} field wajib diisi pada bagian ini!`);
                  } else {
                    setValidationErrors([]);
                    setCurrentSection((p) => Math.min(SECTIONS.length - 1, p + 1));
                  }
                }}
                className="gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
              {validationErrors.length > 0 && (
                <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-semibold text-red-900 mb-2 text-sm">⚠ Kolom yang belum diisi (wajib):</h3>
                  <ul className="space-y-1 text-xs text-red-800 ml-2">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-end gap-3">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {saving ? "Menyimpan..." : "Simpan Kuesioner"}
              </Button>
              {validationErrors.length > 0 && (
                <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-semibold text-red-900 mb-2 text-sm">⚠ Kolom yang belum diisi (wajib):</h3>
                  <ul className="space-y-1 text-xs text-red-800 ml-2">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
