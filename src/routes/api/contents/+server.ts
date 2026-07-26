import { json, type RequestHandler } from '@sveltejs/kit';
import { getAllContent, getAllContentForAdmin, createContent } from '$lib/server/db';

/**
 * GET /api/contents
 * Supports optional query params:
 * - category: 'berita' | 'acara' | 'pengumuman'
 * - admin: 'true' (to list unpublished/all content)
 */
export const GET: RequestHandler = async ({ url, platform }) => {
	try {
		const category = url.searchParams.get('category') || undefined;
		const admin = url.searchParams.get('admin') === 'true';

		let contents: VillageContent[];
		if (admin) {
			contents = await getAllContentForAdmin(platform);
		} else {
			contents = await getAllContent(platform, category);
		}

		return json({ success: true, data: contents });
	} catch (error: any) {
		console.error('Error fetching contents via API:', error);
		return json({ success: false, message: error.message || 'Gagal memuat konten' }, { status: 500 });
	}
};

/**
 * POST /api/contents
 * Creates a new content in Cloudflare D1
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const data = await request.json() as {
			title: string;
			category: 'berita' | 'acara' | 'pengumuman';
			summary: string;
			body: string;
			image_type: 'r2' | 'url';
			image_url: string;
			author?: string;
			event_date?: string | null;
		};

		if (!data.title || data.title.length < 5) {
			return json({ success: false, message: 'Judul harus diisi minimal 5 karakter' }, { status: 400 });
		}
		if (!data.category || !['berita', 'acara', 'pengumuman'].includes(data.category)) {
			return json({ success: false, message: 'Kategori tidak valid' }, { status: 400 });
		}
		if (!data.summary) {
			return json({ success: false, message: 'Ringkasan konten wajib diisi' }, { status: 400 });
		}
		if (!data.body) {
			return json({ success: false, message: 'Isi lengkap konten wajib diisi' }, { status: 400 });
		}
		if (!data.image_url) {
			return json({ success: false, message: 'Gambar wajib disediakan (Upload ke R2 atau masukkan URL)' }, { status: 400 });
		}

		const created = await createContent(platform, data);
		return json({ success: true, data: created, message: 'Konten berhasil disimpan ke database!' }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating content via API:', error);
		return json({ success: false, message: error.message || 'Gagal menyimpan konten' }, { status: 500 });
	}
};
