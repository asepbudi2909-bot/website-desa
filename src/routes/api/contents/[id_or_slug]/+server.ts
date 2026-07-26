import { json, type RequestHandler } from '@sveltejs/kit';
import { getContentById, getContentBySlug, updateContent, deleteContent } from '$lib/server/db';

/**
 * GET /api/contents/[id_or_slug]
 * Retrieves single content item either by ID (if param is numeric) or by slug (if not numeric).
 */
export const GET: RequestHandler = async ({ params, platform }) => {
	try {
		const param = params.id_or_slug;
		if (!param) {
			return json({ success: false, message: 'Parameter ID atau Slug wajib diisi' }, { status: 400 });
		}

		let content: VillageContent | null = null;

		// Use strict digits regex to identify an integer ID to avoid parsing numerical-started slugs (like '2026-musrenbang') as IDs
		const isId = /^\d+$/.test(param);

		if (isId) {
			const id = parseInt(param, 10);
			content = await getContentById(platform, id);
		} else {
			content = await getContentBySlug(platform, param);
		}

		if (!content) {
			return json({ success: false, message: 'Konten tidak ditemukan' }, { status: 404 });
		}

		return json({ success: true, data: content });
	} catch (error: any) {
		console.error('Error getting single content via API:', error);
		return json({ success: false, message: error.message || 'Gagal memuat detail konten' }, { status: 500 });
	}
};

/**
 * PUT /api/contents/[id_or_slug]
 * Updates a content by ID.
 */
export const PUT: RequestHandler = async ({ params, request, platform }) => {
	try {
		const param = params.id_or_slug;
		if (!param) {
			return json({ success: false, message: 'Parameter ID wajib diisi' }, { status: 400 });
		}

		const isId = /^\d+$/.test(param);
		if (!isId) {
			return json({ success: false, message: 'Parameter ID harus berupa angka' }, { status: 400 });
		}
		const id = parseInt(param, 10);

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
			return json({ success: false, message: 'Gambar wajib disediakan' }, { status: 400 });
		}

		const success = await updateContent(platform, id, data);
		if (!success) {
			return json({ success: false, message: 'Konten tidak ditemukan atau gagal memperbarui' }, { status: 404 });
		}

		return json({ success: true, message: 'Konten berhasil diperbarui!' });
	} catch (error: any) {
		console.error('Error updating content via API:', error);
		return json({ success: false, message: error.message || 'Gagal memperbarui konten' }, { status: 500 });
	}
};

/**
 * DELETE /api/contents/[id_or_slug]
 * Deletes a content by ID.
 */
export const DELETE: RequestHandler = async ({ params, platform }) => {
	try {
		const param = params.id_or_slug;
		if (!param) {
			return json({ success: false, message: 'Parameter ID wajib diisi' }, { status: 400 });
		}

		const isId = /^\d+$/.test(param);
		if (!isId) {
			return json({ success: false, message: 'Parameter ID harus berupa angka' }, { status: 400 });
		}
		const id = parseInt(param, 10);

		const success = await deleteContent(platform, id);
		if (!success) {
			return json({ success: false, message: 'Konten tidak ditemukan atau gagal menghapus' }, { status: 404 });
		}

		return json({ success: true, message: 'Konten berhasil dihapus!' });
	} catch (error: any) {
		console.error('Error deleting content via API:', error);
		return json({ success: false, message: error.message || 'Gagal menghapus konten' }, { status: 500 });
	}
};
