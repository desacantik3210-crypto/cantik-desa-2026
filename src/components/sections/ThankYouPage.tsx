import React, { useRef, useState } from "react";
import { CheckCircle, Edit, PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ThankYouPageProps {
  formData: Record<string, Record<string, string>>;
  blockData: Record<string, Record<string, Record<string, string>>>;
  checkboxData: Record<string, Record<string, string[]>>;
  onEdit: () => void;
  onNewEntry: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  "101": "Provinsi", "102": "Kabupaten/Kota", "103": "Kecamatan", "104": "Desa/Kelurahan", "105": "Status Daerah",
  "201": "Nama Petugas", "202": "Jabatan Petugas", "203": "Tanggal Kunjungan", "204": "Tanda Tangan Petugas",
  "301": "Nama Narasumber", "302": "Jabatan Narasumber", "303": "Nomor HP/WA", "304": "Tanda Tangan Narasumber",
  "401": "Topografi",
  "402a": "Penduduk Laki-laki (orang)", "402b": "Penduduk Perempuan (orang)", "402c": "Jumlah Keluarga (keluarga)", "402d": "Keluarga Pertanian (keluarga)",
  "403a": "Fasilitas Pendidikan: TK/RA/BA (unit)", "403b": "Fasilitas Pendidikan: SD/sederajat (unit)", "403c": "Fasilitas Pendidikan: SMP/sederajat (unit)", "403d": "Fasilitas Pendidikan: SMA/sederajat (unit)", "403e": "Fasilitas Pendidikan: Akademi/PT (unit)",
  "404a": "Fasilitas Kesehatan: Rumah Sakit (unit)", "404b": "Fasilitas Kesehatan: Puskesmas (unit)", "404c": "Fasilitas Kesehatan: Puskesmas Pembantu (unit)", "404d": "Fasilitas Kesehatan: Poliklinik (unit)", "404e": "Fasilitas Kesehatan: Praktik Dokter (unit)",
  "404f": "Fasilitas Kesehatan: Praktik Bidan (unit)", "404g": "Fasilitas Kesehatan: Poskesdes (unit)", "404h": "Fasilitas Kesehatan: Polindes (unit)", "404i": "Fasilitas Kesehatan: Apotek (unit)", "405": "Sumber Penghasilan Utama",
  "501a": "Penduduk Bekerja (orang)", "501b": "Penduduk Tidak Bekerja (orang)",
  "502a": "Pendidikan: Tidak Tamat SD (orang)", "502b": "Pendidikan: Tamat SD (orang)", "502c": "Pendidikan: Tamat SMP (orang)", "502d": "Pendidikan: Tamat SMA (orang)", "502e": "Pendidikan: Tamat Akademi/PT (orang)",
  "503a": "Bantuan Sosial: BPNT (orang)", "503b": "Bantuan Sosial: PKH (orang)", "503c": "Bantuan Sosial: BLT Desa (orang)", "503d": "Bantuan Sosial: Subsidi Listrik (orang)", "503e": "Bantuan Sosial: PIP (orang)", "503f": "Bantuan Sosial: BPJS PBI (orang)", "503g": "Bantuan Sosial: Bantuan Provinsi (orang)", "503h": "Bantuan Sosial: Bantuan Kab/Kota (orang)",
  "504a": "Industri: Makanan (unit)", "504b": "Industri: Alat Rumah Tangga (unit)", "504c": "Industri: Material Bangunan (unit)", "504d": "Industri: Alat Pertanian (unit)", "504e": "Industri: Kerajinan (unit)", "504f": "Industri: Rumah Makan (unit)", "504g": "Industri: Lainnya (unit)",
  "801a": "Total Aparatur", "801b": "Mampu Komputer", "801c": "Mampu Olah Data", "801d": "Mampu Monografi", "801e": "Menguasai IT",
  "902a": "Punya Monografi", "902b": "Monografi Up to Date", "902c": "Penyebab Tidak Up to Date", "902d": "Perlu Monografi",
  "903a": "Punya SID/Website", "903b": "Alamat Website", "903c": "Ada Data Statistik", "903d": "Data Up to Date", "903e": "Penyebab Tidak Up to Date", "903f": "Butuh Data Statistik",
  "1001a": "Data Dibutuhkan", "1001b": "Kegiatan Statistik Dibutuhkan",
  "1002a": "Pembinaan Pengelolaan Data", "1002b": "Pembinaan Pengumpulan Data", "1002c": "Pembinaan Analisis Data", "1002d": "Pembinaan Penyajian Data", "1002e": "Pembinaan Website/SID",
  "catatan": "Catatan",
};

const VALUE_MAP: Record<string, Record<string, string>> = {
  "105": { "1": "Perkotaan", "2": "Perdesaan" },
  "401": { "1": "Puncak/tebing", "2": "Lereng", "3": "Dataran", "4": "Lembah" },
  "902c": { "1": "Tidak ada SDM", "2": "Tidak ada sarana", "3": "Tidak ada anggaran", "4": "Tidak merasa perlu", "5": "Lainnya" },
  "903e": { "1": "Tidak ada SDM", "2": "Tidak ada sarana", "3": "Tidak ada anggaran", "4": "Tidak merasa perlu", "5": "Lainnya" },
};

const YES_NO_FIELDS = ["902a", "902b", "902d", "903a", "903c", "903d", "903f", "1002a", "1002b", "1002c", "1002d", "1002e"];

const BLOCK_LABELS: Record<string, string> = {
  "601": "601. BPJS PBI tidak menerima", "602": "602. Bantuan sosial tidak menerima", "603": "603. Perubahan desil",
  "604": "604. Rumah tidak layak huni", "605": "605. Sanitasi buruk", "606": "606. Sumber air minum buruk",
  "607": "607. Stunting/kurang gizi", "608": "608. Penyakit kronis", "609": "609. Disabilitas", "610": "610. Pengangguran keluarga",
  "611": "611. Penduduk sebatang kara", "612": "612. Lansia", "613": "613. Wilayah tanpa akses internet",
};

const SUB_LABELS: Record<string, string> = { a: "a. Ada masalah/potensi", b: "b. Punya data", c: "c. Sumber data", d: "d. Data dibutuhkan" };

function formatValue(key: string, val: string): string {
  if (VALUE_MAP[key]) return VALUE_MAP[key][val] || val;
  if (YES_NO_FIELDS.includes(key)) return val === "1" ? "Ya" : val === "2" ? "Tidak" : val;
  return val;
}

function formatBlockValue(val: string): string {
  if (val === "1") return "Ya / Ada";
  if (val === "2") return "Tidak / Tidak Ada";
  if (val === "3") return "Tidak Tahu";
  return val;
}

const SummarySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <div className="bg-muted px-4 py-2 font-semibold text-sm">{title}</div>
    <div className="divide-y divide-border">{children}</div>
  </div>
);

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between px-4 py-2 text-sm gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value || "-"}</span>
  </div>
);

const ThankYouPage: React.FC<ThankYouPageProps> = ({ formData, blockData, checkboxData, onEdit, onNewEntry }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // First page
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      // Additional pages
      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      const desa = formData["I"]?.["104"] || "desa";
      const kec = formData["I"]?.["103"] || "";
      pdf.save(`Kuesioner_DesaCantik_${desa}_${kec}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const renderFormSection = (sectionKey: string, title: string, fieldKeys: string[]) => {
    const data = formData[sectionKey] || {};
    const hasData = fieldKeys.some((k) => data[k]);
    if (!hasData) return null;
    return (
      <SummarySection title={title}>
        {fieldKeys.map((k) => data[k] ? <SummaryRow key={k} label={FIELD_LABELS[k] || k} value={formatValue(k, data[k])} /> : null)}
      </SummarySection>
    );
  };

  const renderBlockSection = (sectionKey: string, title: string) => {
    const data = blockData[sectionKey] || {};
    const blockIds = Object.keys(data).filter((id) => Object.values(data[id]).some(Boolean));
    if (blockIds.length === 0) return null;
    return (
      <SummarySection title={title}>
        {blockIds.map((id) => (
          <div key={id} className="px-4 py-2">
            <p className="text-sm font-medium mb-1">{BLOCK_LABELS[id] || id}</p>
            {Object.entries(data[id]).filter(([, v]) => v).map(([sub, v]) => (
              <div key={sub} className="flex justify-between text-sm ml-4 gap-4">
                <span className="text-muted-foreground">{SUB_LABELS[sub] || sub}</span>
                <span className="text-right">{formatBlockValue(v)}</span>
              </div>
            ))}
          </div>
        ))}
      </SummarySection>
    );
  };

  const renderCheckbox = () => {
    const cb = checkboxData["IX"] || {};
    if (!cb["901"] || cb["901"].length === 0) return null;
    const labels: Record<string, string> = { A: "Hardcopy", B: "Softcopy", C: "Website Desa" };
    return (
      <SummaryRow label="901. Sistem Pencatatan" value={cb["901"].map((v) => labels[v] || v).join(", ")} />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Terima Kasih!</h1>
          <p className="text-muted-foreground mt-2">Data kuesioner berhasil disimpan. Berikut ringkasan data yang telah diisi.</p>
        </div>

        {/* PDF content area */}
        <div ref={contentRef} className="space-y-4 mb-8 bg-background p-2">
          <div className="text-center mb-4 border-b border-border pb-4">
            <h2 className="text-lg font-bold text-foreground">INSTRUMEN IDENTIFIKASI KEBUTUHAN</h2>
            <h3 className="text-base font-semibold text-foreground">DESA/KELURAHAN CINTA STATISTIK (CANTIK)</h3>
            <p className="text-sm text-muted-foreground mt-1">TAHUN 2026</p>
          </div>

          {renderFormSection("I", "I. PENGENALAN TEMPAT", ["101", "102", "103", "104", "105"])}
          {renderFormSection("II", "II. KETERANGAN PETUGAS", ["201", "202", "203", "204"])}
          {renderFormSection("III", "III. KETERANGAN NARASUMBER", ["301", "302", "303", "304"])}
          {renderFormSection("IV", "IV. PROFIL DESA/KELURAHAN", ["401", "402a", "402b", "402c", "402d", "403a", "403b", "403c", "403d", "403e", "404a", "404b", "404c", "404d", "404e", "404f", "404g", "404h", "404i", "405"])}
          {renderFormSection("V", "V. KONDISI SOSIAL EKONOMI", ["501a", "501b", "502a", "502b", "502c", "502d", "502e", "503a", "503b", "503c", "503d", "503e", "503f", "503g", "503h", "504a", "504b", "504c", "504d", "504e", "504f", "504g"])}
          {renderBlockSection("VI", "VI. IDENTIFIKASI PERMASALAHAN")}
          {renderBlockSection("VII", "VII. IDENTIFIKASI POTENSI")}
          {renderFormSection("VIII", "VIII. APARATUR PEMERINTAHAN", ["801a", "801b", "801c", "801d", "801e"])}
          <SummarySection title="IX. INFRASTRUKTUR TI">
            {renderCheckbox()}
            {["902a", "902b", "902c", "902d", "903a", "903b", "903c", "903d", "903e", "903f"].map((k) =>
              (formData["IX"] || {})[k] ? <SummaryRow key={k} label={FIELD_LABELS[k] || k} value={formatValue(k, formData["IX"][k])} /> : null
            )}
          </SummarySection>
          {renderFormSection("X", "X. RESUME", ["1001a", "1001b", "1002a", "1002b", "1002c", "1002d", "1002e"])}
          {renderFormSection("XI", "XI. CATATAN", ["catatan"])}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Data
          </Button>
          <Button onClick={handleDownloadPDF} disabled={downloading} className="gap-2" variant="secondary">
            <Download className="w-4 h-4" />
            {downloading ? "Mengunduh..." : "Unduh PDF"}
          </Button>
          <Button onClick={onNewEntry} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Isi Data Baru
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
