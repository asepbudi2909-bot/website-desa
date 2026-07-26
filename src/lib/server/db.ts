/**
 * Data Service Layer for Cloudflare D1 Database
 * 
 * Interacts directly with Cloudflare D1 (SQLite at edge).
 * When running in local development mode without D1 binding attached,
 * it provides an in-memory mock fallback so developers can test immediately.
 */

// Memory fallback store for local development preview without wrangler d1
let memoryStore: VillageContent[] = [
	{
		id: 1,
		slug: 'peresmian-pusat-digital-desa-sukamaju',
		title: 'Peresmian Pusat Pelayanan Digital Desa Sukamaju',
		category: 'berita',
		summary: 'Pemerintah Desa Sukamaju resmi meluncurkan layanan digital berbasis cloud untuk mempercepat pengurusan dokumen administrasi warga.',
		body: 'Pemerintah Desa Sukamaju meluncurkan inovasi layanan publik berbasis teknologi cloud modern. Layanan ini mencakup pengurusan surat pengantar online, transparansi anggaran desa, serta integrasi data kependudukan secara real-time.\n\nKepala Desa menyampaikan bahwa digitalisasi ini bertujuan untuk memberikan kemudahan akses bagi seluruh warga tanpa terbatas jam operasional kantor desa.',
		image_type: 'url',
		image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
		author: 'Sekretaris Desa',
		is_published: 1,
		event_date: null,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 2,
		slug: 'musyawarah-pembangunan-desa-2026',
		title: 'Musyawarah Pembangunan Desa (Musrenbangdes) 2026',
		category: 'acara',
		summary: 'Undangan bagi seluruh tokoh masyarakat dan RT/RW untuk menghadiri Musrenbangdes perencana proyek sarana publik.',
		body: 'Diimbau kepada seluruh Ketua RT, Ketua RW, Lembaga Pemberdayaan Masyarakat Desa (LPMD), dan tokoh masyarakat untuk menghadiri Musyawarah Pembangunan Desa tahun anggaran 2026.\n\nAgenda utama:\n1. Pembahasan perbaikan jalan tani\n2. Pembangunan jaringan air bersih Dusun II\n3. Alokasi dana pemberdayaan UMKM lokal.',
		image_type: 'url',
		image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
		author: 'Panitia Musrenbang',
		is_published: 1,
		event_date: '2026-08-10',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 3,
		slug: 'penyaluran-bantuan-langsung-tunai-blt-tahap-3',
		title: 'Pengumuman Penyaluran BLT Dana Desa Tahap III',
		category: 'pengumuman',
		summary: 'Jadwal pengambilan Bantuan Langsung Tunai (BLT) bagi Keluarga Penerima Manfaat (KPM) di Balai Desa Sukamaju.',
		body: 'Diberitahukan kepada KPM Penerima BLT Dana Desa bahwa penyaluran dana Tahap III akan dilaksanakan pada hari Jumat di Balai Desa.\n\nPersyaratan pengambilan:\n- Membawa KTP Asli dan Fotokopi KK\n- Membawa Kartu Kendali Penerima BLT\n\nBagi penerima lansia yang berhalangan hadir, petugas desa akan mengantarkan bantuan secara langsung ke rumah.',
		image_type: 'url',
		image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
		author: 'Kaur Kesra',
		is_published: 1,
		event_date: null,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

let nextId = 4;

/**
 * Utility to generate clean URL slug from title
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Fetch all contents, optionally filtered by category
 */
export async function getAllContent(platform?: App.Platform, category?: string): Promise<VillageContent[]> {
	// If Cloudflare D1 binding is present, execute SQL query against D1
	if (platform?.env?.DB) {
		let query = 'SELECT * FROM contents WHERE is_published = 1';
		const params: string[] = [];

		if (category && ['berita', 'acara', 'pengumuman'].includes(category)) {
			query += ' AND category = ?';
			params.push(category);
		}

		query += ' ORDER BY created_at DESC';

		const stmt = platform.env.DB.prepare(query);
		const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
		return (results || []) as unknown as VillageContent[];
	}

	// Fallback for local Vite dev
	let filtered = memoryStore.filter((item) => item.is_published === 1);
	if (category && ['berita', 'acara', 'pengumuman'].includes(category)) {
		filtered = filtered.filter((item) => item.category === category);
	}
	return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Fetch all contents including unpublished (for Admin CMS view)
 */
export async function getAllContentForAdmin(platform?: App.Platform): Promise<VillageContent[]> {
	if (platform?.env?.DB) {
		const { results } = await platform.env.DB.prepare('SELECT * FROM contents ORDER BY created_at DESC').all();
		return (results || []) as unknown as VillageContent[];
	}

	return [...memoryStore].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Fetch single content item by slug
 */
export async function getContentBySlug(platform: App.Platform | undefined, slug: string): Promise<VillageContent | null> {
	if (platform?.env?.DB) {
		const result = await platform.env.DB.prepare('SELECT * FROM contents WHERE slug = ?').bind(slug).first();
		return (result as unknown as VillageContent) || null;
	}

	const item = memoryStore.find((i) => i.slug === slug);
	return item || null;
}

/**
 * Fetch single content item by ID (for Admin Edit)
 */
export async function getContentById(platform: App.Platform | undefined, id: number): Promise<VillageContent | null> {
	if (platform?.env?.DB) {
		const result = await platform.env.DB.prepare('SELECT * FROM contents WHERE id = ?').bind(id).first();
		return (result as unknown as VillageContent) || null;
	}

	const item = memoryStore.find((i) => i.id === id);
	return item || null;
}

/**
 * Create a new content record in D1
 */
export async function createContent(
	platform: App.Platform | undefined,
	data: {
		title: string;
		category: 'berita' | 'acara' | 'pengumuman';
		summary: string;
		body: string;
		image_type: 'r2' | 'url';
		image_url: string;
		author?: string;
		event_date?: string | null;
	}
): Promise<VillageContent> {
	let slug = slugify(data.title);
	// Handle duplicate slug by appending timestamp if needed
	const existing = await getContentBySlug(platform, slug);
	if (existing) {
		slug = `${slug}-${Date.now().toString().slice(-4)}`;
	}

	const author = data.author?.trim() || 'Admin Desa';
	const eventDate = data.category === 'acara' ? data.event_date || null : null;
	const now = new Date().toISOString();

	if (platform?.env?.DB) {
		const stmt = platform.env.DB.prepare(`
			INSERT INTO contents (slug, title, category, summary, body, image_type, image_url, author, is_published, event_date, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
		`);

		const info = await stmt.bind(
			slug,
			data.title,
			data.category,
			data.summary,
			data.body,
			data.image_type,
			data.image_url,
			author,
			eventDate,
			now,
			now
		).run();

		const created = await getContentBySlug(platform, slug);
		if (created) return created;
	}

	// Fallback local memory store
	const newContent: VillageContent = {
		id: nextId++,
		slug,
		title: data.title,
		category: data.category,
		summary: data.summary,
		body: data.body,
		image_type: data.image_type,
		image_url: data.image_url,
		author,
		is_published: 1,
		event_date: eventDate,
		created_at: now,
		updated_at: now
	};

	memoryStore.unshift(newContent);
	return newContent;
}

/**
 * Update an existing content record in D1
 */
export async function updateContent(
	platform: App.Platform | undefined,
	id: number,
	data: {
		title: string;
		category: 'berita' | 'acara' | 'pengumuman';
		summary: string;
		body: string;
		image_type: 'r2' | 'url';
		image_url: string;
		author?: string;
		event_date?: string | null;
	}
): Promise<boolean> {
	const now = new Date().toISOString();
	const author = data.author?.trim() || 'Admin Desa';
	const eventDate = data.category === 'acara' ? data.event_date || null : null;

	if (platform?.env?.DB) {
		const stmt = platform.env.DB.prepare(`
			UPDATE contents 
			SET title = ?, category = ?, summary = ?, body = ?, image_type = ?, image_url = ?, author = ?, event_date = ?, updated_at = ?
			WHERE id = ?
		`);
		const res = await stmt.bind(
			data.title,
			data.category,
			data.summary,
			data.body,
			data.image_type,
			data.image_url,
			author,
			eventDate,
			now,
			id
		).run();

		return res.success;
	}

	// Fallback memory store
	const index = memoryStore.findIndex((item) => item.id === id);
	if (index !== -1) {
		memoryStore[index] = {
			...memoryStore[index],
			title: data.title,
			category: data.category,
			summary: data.summary,
			body: data.body,
			image_type: data.image_type,
			image_url: data.image_url,
			author,
			event_date: eventDate,
			updated_at: now
		};
		return true;
	}
	return false;
}

/**
 * Delete a content record from D1
 */
export async function deleteContent(platform: App.Platform | undefined, id: number): Promise<boolean> {
	if (platform?.env?.DB) {
		const res = await platform.env.DB.prepare('DELETE FROM contents WHERE id = ?').bind(id).run();
		return res.success;
	}

	const initialLen = memoryStore.length;
	memoryStore = memoryStore.filter((item) => item.id !== id);
	return memoryStore.length < initialLen;
}
