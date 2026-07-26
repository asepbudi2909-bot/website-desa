/**
 * Data Service Layer for Cloudflare D1 Database
 * 
 * Interacts directly with Cloudflare D1 (SQLite at edge).
 * All queries are executed against D1; if the binding is missing,
 * it will throw an informative error.
 */

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
 * Ensures that the Cloudflare D1 Database binding exists
 */
function ensureD1(platform: App.Platform | undefined): D1Database {
	if (!platform?.env?.DB) {
		throw new Error('Cloudflare D1 Database binding ("DB") is not configured or unavailable in the current platform environment.');
	}
	return platform.env.DB;
}

/**
 * Fetch all contents, optionally filtered by category
 */
export async function getAllContent(platform?: App.Platform, category?: string): Promise<VillageContent[]> {
	const db = ensureD1(platform);
	let query = 'SELECT * FROM contents WHERE is_published = 1';
	const params: string[] = [];

	if (category && ['berita', 'acara', 'pengumuman'].includes(category)) {
		query += ' AND category = ?';
		params.push(category);
	}

	query += ' ORDER BY created_at DESC';

	const stmt = db.prepare(query);
	const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
	return (results || []) as unknown as VillageContent[];
}

/**
 * Fetch all contents including unpublished (for Admin CMS view)
 */
export async function getAllContentForAdmin(platform?: App.Platform): Promise<VillageContent[]> {
	const db = ensureD1(platform);
	const { results } = await db.prepare('SELECT * FROM contents ORDER BY created_at DESC').all();
	return (results || []) as unknown as VillageContent[];
}

/**
 * Fetch single content item by slug
 */
export async function getContentBySlug(platform: App.Platform | undefined, slug: string): Promise<VillageContent | null> {
	const db = ensureD1(platform);
	const result = await db.prepare('SELECT * FROM contents WHERE slug = ?').bind(slug).first();
	return (result as unknown as VillageContent) || null;
}

/**
 * Fetch single content item by ID (for Admin Edit)
 */
export async function getContentById(platform: App.Platform | undefined, id: number): Promise<VillageContent | null> {
	const db = ensureD1(platform);
	const result = await db.prepare('SELECT * FROM contents WHERE id = ?').bind(id).first();
	return (result as unknown as VillageContent) || null;
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
	const db = ensureD1(platform);
	let slug = slugify(data.title);

	// Handle duplicate slug by appending timestamp if needed
	const existing = await getContentBySlug(platform, slug);
	if (existing) {
		slug = `${slug}-${Date.now().toString().slice(-4)}`;
	}

	const author = data.author?.trim() || 'Admin Desa';
	const eventDate = data.category === 'acara' ? data.event_date || null : null;
	const now = new Date().toISOString();

	const stmt = db.prepare(`
		INSERT INTO contents (slug, title, category, summary, body, image_type, image_url, author, is_published, event_date, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
	`);

	await stmt.bind(
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
	if (!created) {
		throw new Error('Gagal memverifikasi pembuatan konten baru di Cloudflare D1.');
	}
	return created;
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
	const db = ensureD1(platform);
	const now = new Date().toISOString();
	const author = data.author?.trim() || 'Admin Desa';
	const eventDate = data.category === 'acara' ? data.event_date || null : null;

	const stmt = db.prepare(`
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

/**
 * Delete a content record from D1
 */
export async function deleteContent(platform: App.Platform | undefined, id: number): Promise<boolean> {
	const db = ensureD1(platform);
	const res = await db.prepare('DELETE FROM contents WHERE id = ?').bind(id).run();
	return res.success;
}
