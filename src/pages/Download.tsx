import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FIELD_LABELS: Record<string, string> = {
  timestamp: "Waktu Pengisian",
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
  "901": "Sistem Pencatatan",
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

const SECTIONS: { title: string; keys: string[] }[] = [
  { title: "I. PENGENALAN TEMPAT", keys: ["101", "102", "103", "104", "105"] },
  { title: "II. KETERANGAN PETUGAS", keys: ["201", "202", "203", "204"] },
  { title: "III. KETERANGAN NARASUMBER", keys: ["301", "302", "303", "304"] },
  { title: "IV. PROFIL DESA/KELURAHAN", keys: ["401", "402a", "402b", "402c", "402d", "403a", "403b", "403c", "403d", "403e", "404a", "404b", "404c", "404d", "404e", "404f", "404g", "404h", "404i", "405"] },
  { title: "V. KONDISI SOSIAL EKONOMI", keys: ["501a", "501b", "502a", "502b", "502c", "502d", "502e", "503a", "503b", "503c", "503d", "503e", "503f", "503g", "503h", "504a", "504b", "504c", "504d", "504e", "504f", "504g"] },
  { title: "VIII. APARATUR PEMERINTAHAN", keys: ["801a", "801b", "801c", "801d", "801e"] },
  { title: "IX. INFRASTRUKTUR TI", keys: ["901", "902a", "902b", "902c", "902d", "903a", "903b", "903c", "903d", "903e", "903f"] },
  { title: "X. RESUME", keys: ["1001a", "1001b", "1002a", "1002b", "1002c", "1002d", "1002e"] },
  { title: "XI. CATATAN", keys: ["catatan"] },
];

const VI_BLOCKS = ["601", "602", "603", "604", "605", "606", "607", "608", "609", "610"];
const VII_BLOCKS = ["611", "612", "613"];

function formatValue(key: string, val: string): string {
  if (!val) return "-";
  if (VALUE_MAP[key]) return VALUE_MAP[key][val] || val;
  if (YES_NO_FIELDS.includes(key)) return val === "1" ? "Ya" : val === "2" ? "Tidak" : val;
  return val;
}

function formatBlockValue(val: string): string {
  if (val === "1") return "Ya / Ada";
  if (val === "2") return "Tidak / Tidak Ada";
  if (val === "3") return "Tidak Tahu";
  return val || "-";
}

function formatTimestamp(val: string): string {
  if (!val) return "-";
  try {
    const d = new Date(val);
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return val;
  }
}

const Download: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<Record<string, string>[]>([]);
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("read-sheet");
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setRecords(data?.records || []);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(records.length - 1, i + 1)), [records.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  const record = records[index];

  const renderRow = (key: string, label: string, value: string) => (
    <div key={key} className="flex justify-between px-4 py-2 text-sm gap-4 border-b border-border last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-words">{value || "-"}</span>
    </div>
  );

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 font-semibold text-sm">{title}</div>
      <div>{content}</div>
    </div>
  );

  const renderBlocks = (title: string, blockIds: string[]) => {
    if (!record) return null;
    const rows = blockIds
      .map((id) => {
        const subs = ["a", "b", "c", "d"]
          .map((s) => ({ s, v: record[`${id}${s}`] }))
          .filter((x) => x.v);
        if (subs.length === 0) return null;
        return (
          <div key={id} className="px-4 py-2 border-b border-border last:border-b-0">
            <p className="text-sm font-medium mb-1">{BLOCK_LABELS[id] || id}</p>
            {subs.map(({ s, v }) => (
              <div key={s} className="flex justify-between text-sm ml-4 gap-4">
                <span className="text-muted-foreground">{SUB_LABELS[s] || s}</span>
                <span className="text-right">{formatBlockValue(v)}</span>
              </div>
            ))}
          </div>
        );
      })
      .filter(Boolean);
    if (rows.length === 0) return null;
    return renderSection(title, rows);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Data Kuesioner</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Hasil Pengisian Kuesioner</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Geser ke kiri/kanan atau gunakan tombol untuk berpindah antar record
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">Belum ada data kuesioner yang tersimpan.</p>
          </div>
        ) : (
          <>
            {/* Navigator */}
            <div className="flex items-center justify-between mb-4 bg-card border border-border rounded-lg px-2 py-2">
              <Button variant="ghost" size="sm" onClick={goPrev} disabled={index === 0} className="gap-1">
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="text-sm font-medium">
                Record <span className="text-primary">{index + 1}</span> dari {records.length}
              </div>
              <Button variant="ghost" size="sm" onClick={goNext} disabled={index === records.length - 1} className="gap-1">
                Berikutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Swipeable record card */}
            <div
              className="space-y-4 select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground">Disimpan pada</p>
                <p className="text-sm font-medium">{formatTimestamp(record?.timestamp || "")}</p>
              </div>

              {SECTIONS.map((sec) =>
                renderSection(
                  sec.title,
                  sec.keys.map((k) => renderRow(k, FIELD_LABELS[k] || k, formatValue(k, record?.[k] || "")))
                )
              )}

              {renderBlocks("VI. IDENTIFIKASI PERMASALAHAN", VI_BLOCKS)}
              {renderBlocks("VII. IDENTIFIKASI POTENSI", VII_BLOCKS)}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={goPrev} disabled={index === 0}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {index + 1} / {records.length}
              </span>
              <Button variant="outline" size="sm" onClick={goNext} disabled={index === records.length - 1}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
