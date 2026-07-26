# Website Desa Sukamaju - Cloud Native SvelteKit & Cloudflare Stack

Situs web resmi dan Sistem Manajemen Konten (CMS) untuk desa berbasis **SvelteKit**, yang memanfaatkan arsitektur cloud native **Cloudflare Pages**, **Cloudflare Functions**, **D1 Database** (SQLite di edge), dan **R2 Storage** (Object Storage).

---

## 🚀 Fitur Utama

1. **Architecture Cloud Native**:
   - Dideploy langsung ke Cloudflare Pages dengan SvelteKit Adapter (`@sveltejs/adapter-cloudflare`).
   - Serverless Functions menggunakan Cloudflare Workers/Functions runtime.
2. **Penyimpanan Data D1 (Edge SQLite)**:
   - Seluruh konten dinamis (Berita, Acara, Pengumuman) disimpan dan dikelola melalui Cloudflare D1.
   - Performa kueri instan dari lokasi edge terdekat pengguna.
3. **Opsi Ganda Storage Gambar (R2 & External URL)**:
   - **Mode A (Cloudflare R2)**: Pengunggahan berkas gambar langsung ke R2 Bucket (`env.BUCKET.put`) dan di-stream melalui endpoint edge `/api/images/[key]` dengan *http metadata* & *cache-control*.
   - **Mode B (URL Eksternal)**: Opsi menggunakan URL gambar publik eksternal.
4. **Sistem CMS Admin Terpadu (`/admin`)**:
   - Dashboard statistik publikasi desa (Jumlah Berita, Acara, Pengumuman, dan R2 Media).
   - Form pembuat dan pengedit konten (`/admin/create` & `/admin/edit/[id]`) dengan pratinjau gambar *live*.
   - Aksi Hapus (*Delete*) dengan konfirmasi dan *enhancement form*.
5. **Tampilan Publik Modern & Responsif**:
   - Desain estetis bertema *Vibrant Emerald & Slate* dengan elemen *glassmorphism*, indikator kategori dinamis, pencarian real-time, dan tata letak berita yang responsif.

---

## 🛠️ Langkah Pengaturan & Deployment

### 1. Inisialisasi Cloudflare D1 Database & R2 Bucket
Jalankan perintah Wrangler berikut melalui terminal:

```bash
# 1. Buat Database D1
npx wrangler d1 create website_desa_db

# 2. Buat Bucket R2 untuk Gambar
npx wrangler r2 bucket create website-desa-media

# 3. Jalankan Migrasi Schema SQL ke D1
npx wrangler d1 execute website_desa_db --file=schema.sql
```

### 2. Konfigurasi `wrangler.jsonc`
Pastikan `database_id` hasil pembuatan D1 dimasukkan ke dalam `wrangler.jsonc`:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "website_desa_db",
    "database_id": "<YOUR_D1_DATABASE_ID>"
  }
],
"r2_buckets": [
  {
    "binding": "BUCKET",
    "bucket_name": "website-desa-media"
  }
]
```

### 3. Jalankan Pengujian Lokal (Local Development)

```bash
# Mode pengembangan Vite
npm run dev

# Mode preview lokal dengan bindings Cloudflare Wrangler
npm run preview
```

### 4. Deploy ke Cloudflare Pages

```bash
# Kompilasi bundel produksi dan deploy via Wrangler
npm run deploy
```

---

## 📁 Struktur Direktori Utama

```
website-desa/
├── schema.sql                         # Schema SQL untuk tabel D1 & Seed Data Demo
├── wrangler.jsonc                     # Konfigurasi Cloudflare Pages, D1, dan R2 Bindings
├── svelte.config.js                   # Konfigurasi SvelteKit dengan adapter-cloudflare
├── src/
│   ├── app.d.ts                       # Definisi Tipe App.Platform (env.DB & env.BUCKET)
│   ├── app.css                        # Design System CSS (Emerald/Slate, Glassmorphism)
│   ├── lib/
│   │   └── server/
│   │       ├── db.ts                  # Service D1 Database (CRUD Operations & Fallback)
│   │       └── storage.ts             # Helper Penyimpanan Gambar R2
│   └── routes/
│       ├── +layout.svelte             # Header Navigasi & Footer Desa
│       ├── +page.svelte & .server.ts  # Halaman Depan Publik & Filter Kategori
│       ├── content/[slug]/            # Detail Baca Berita / Acara / Pengumuman
│       ├── admin/                     # Dashboard CMS Admin (Tabel & Statistik)
│       │   ├── create/                # Form Tambah Konten + Dual Image Upload
│       │   └── edit/[id]/             # Form Edit Konten + Dual Image Upload
│       └── api/
│           ├── upload/+server.ts      # Endpoint Unggah Gambar R2 / URL Processing
│           └── images/[...key]/       # Endpoint Stream Gambar dari Cloudflare R2
```
