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
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
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
            onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
            disabled={currentSection === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {currentSection < SECTIONS.length - 1 ? (
            <Button
              onClick={() => setCurrentSection((p) => Math.min(SECTIONS.length - 1, p + 1))}
              className="gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => alert("Data kuesioner berhasil disimpan!")}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Simpan Kuesioner
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
