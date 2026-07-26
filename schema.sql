-- Schema SQL untuk Database D1 Cloudflare Website Desa
-- Jalankan: wrangler d1 execute website_desa_db --file=schema.sql

CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT CHECK(category IN ('berita', 'acara', 'pengumuman')) NOT NULL DEFAULT 'berita',
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    image_type TEXT CHECK(image_type IN ('r2', 'url')) NOT NULL DEFAULT 'url',
    image_url TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Admin Desa',
    is_published INTEGER NOT NULL DEFAULT 1,
    event_date TEXT, -- Khusus untuk kategori 'acara' (YYYY-MM-DD)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indeks untuk mempercepat pencarian berdasarkan kategori & slug
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);

-- Data Awal (Seed Data Demo Desa Sukamaju)
INSERT OR IGNORE INTO contents (id, slug, title, category, summary, body, image_type, image_url, author, is_published, event_date) 
VALUES 
(
    1,
    'peresmian-pusat-digital-desa-sukamaju',
    'Peresmian Pusat Pelayanan Digital Desa Sukamaju',
    'berita',
    'Pemerintah Desa Sukamaju resmi meluncurkan layanan digital berbasis cloud untuk mempercepat pengurusan dokumen administrasi warga.',
    'Pemerintah Desa Sukamaju meluncurkan inovasi layanan publik berbasis teknologi cloud modern. Layanan ini mencakup pengurusan surat pengantar online, transparansi anggaran desa, serta integrasi data kependudukan secara real-time.\n\nKepala Desa menyampaikan bahwa digitalisasi ini bertujuan untuk memberikan kemudahan akses bagi seluruh warga tanpa terbatas jam operasional kantor desa.',
    'url',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
    'Sekretaris Desa',
    1,
    NULL
),
(
    2,
    'musyawarah-pembangunan-desa-2026',
    'Musyawarah Pembangunan Desa (Musrenbangdes) 2026',
    'acara',
    'Undangan bagi seluruh tokoh masyarakat dan RT/RW untuk menghadiri Musrenbangdes perencana proyek sarana publik.',
    'Diimbau kepada seluruh Ketua RT, Ketua RW, Lembaga Pemberdayaan Masyarakat Desa (LPMD), dan tokoh masyarakat untuk menghadiri Musyawarah Pembangunan Desa tahun anggaran 2026.\n\nAgenda utama:\n1. Pembahasan perbaikan jalan tani\n2. Pembangunan jaringan air bersih Dusun II\n3. Alokasi dana pemberdayaan UMKM lokal.',
    'url',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    'Panitia Musrenbang',
    1,
    '2026-08-10'
),
(
    3,
    'penyaluran-bantuan-langsung-tunai-blt-tahap-3',
    'Pengumuman Penyaluran BLT Dana Desa Tahap III',
    'pengumuman',
    'Jadwal pengambilan Bantuan Langsung Tunai (BLT) bagi Keluarga Penerima Manfaat (KPM) di Balai Desa Sukamaju.',
    'Diberitahukan kepada KPM Penerima BLT Dana Desa bahwa penyaluran dana Tahap III akan dilaksanakan pada hari Jumat di Balai Desa.\n\nPersyaratan pengambilan:\n- Membawa KTP Asli dan Fotokopi KK\n- Membawa Kartu Kendali Penerima BLT\n\nBagi penerima lansia yang berhalangan hadir, petugas desa akan mengantarkan bantuan secara langsung ke rumah.',
    'url',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'Kaur Kesra',
    1,
    NULL
);
