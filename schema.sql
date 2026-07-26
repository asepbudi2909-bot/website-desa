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

-- Tabel baru untuk konfigurasi identitas desa
CREATE TABLE IF NOT EXISTS village_config (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Hanya satu baris konfigurasi
    village_name TEXT NOT NULL DEFAULT 'Desa Sukamaju',
    village_code TEXT, -- Kode desa resmi
    district_name TEXT, -- Nama kecamatan
    regency_name TEXT, -- Nama kabupaten/kota
    province_name TEXT, -- Nama provinsi
    postal_code TEXT, -- Kode pos
    address TEXT, -- Alamat lengkap kantor desa
    phone TEXT, -- Nomor telepon
    email TEXT, -- Email resmi
    website TEXT, -- URL website
    head_of_village TEXT, -- Nama kepala desa
    head_title TEXT DEFAULT 'Kepala Desa', -- Gelar/jabatan kepala desa
    description TEXT, -- Deskripsi singkat desa
    logo_image_type TEXT CHECK(logo_image_type IN ('r2', 'url')) DEFAULT 'url',
    logo_image_url TEXT, -- URL logo desa
    banner_image_type TEXT CHECK(banner_image_type IN ('r2', 'url')) DEFAULT 'url',
    banner_image_url TEXT, -- URL banner/hero image
    primary_color TEXT DEFAULT '#059669', -- Warna utama (emerald-600)
    secondary_color TEXT DEFAULT '#0284c7', -- Warna sekunder (sky-600)
    social_media_facebook TEXT, -- Link Facebook
    social_media_instagram TEXT, -- Link Instagram
    social_media_twitter TEXT, -- Link Twitter/X
    social_media_youtube TEXT, -- Link YouTube
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indeks untuk mempercepat pencarian berdasarkan kategori & slug
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);

-- Data Awal Konfigurasi Desa (Default)
INSERT OR IGNORE INTO village_config (id, village_name, district_name, regency_name, province_name, head_of_village, description, logo_image_url, banner_image_url) 
VALUES (
    1,
    'Desa Sukamaju',
    'Kecamatan Majujaya',
    'Kabupaten Sejahtera',
    'Provinsi Makmur',
    'Bapak Ahmad Suryadi',
    'Desa Sukamaju adalah desa yang asri dan modern dengan komitmen terhadap pelayanan publik berbasis teknologi digital untuk kesejahteraan seluruh warga.',
    'https://images.unsplash.com/photo-1596483758362-e03c5e0d8b9f?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80'
);

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
