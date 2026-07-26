import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { getContentById, updateContent } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	if (!params.id) {
		throw error(400, 'ID Konten tidak valid');
	}
	const id = parseInt(params.id, 10);
	if (isNaN(id)) {
		throw error(400, 'ID Konten tidak valid');
	}

	const content = await getContentById(platform, id);

	if (!content) {
		throw error(404, 'Konten tidak ditemukan di Cloudflare D1 Database');
	}

	return {
		content
	};
};

export const actions: Actions = {
	default: async ({ params, request, platform }) => {
		if (!params.id) {
			return fail(400, { message: 'ID Konten tidak valid' });
		}

		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			return fail(400, { message: 'ID Konten tidak valid' });
		}

		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const category = formData.get('category')?.toString() as 'berita' | 'acara' | 'pengumuman';
		const summary = formData.get('summary')?.toString().trim();
		const body = formData.get('body')?.toString().trim();
		const author = formData.get('author')?.toString().trim() || 'Admin Desa';
		const event_date = formData.get('event_date')?.toString().trim() || null;
		const image_type = formData.get('image_type')?.toString() as 'r2' | 'url';
		const image_url = formData.get('image_url')?.toString().trim();

		// Validation
		if (!title || title.length < 5) {
			return fail(400, { message: 'Judul harus diisi minimal 5 karakter' });
		}
		if (!category || !['berita', 'acara', 'pengumuman'].includes(category)) {
			return fail(400, { message: 'Kategori tidak valid' });
		}
		if (!summary) {
			return fail(400, { message: 'Ringkasan konten wajib diisi' });
		}
		if (!body) {
			return fail(400, { message: 'Isi lengkap konten wajib diisi' });
		}
		if (!image_url) {
			return fail(400, { message: 'Gambar wajib diisi' });
		}

		try {
			await updateContent(platform, id, {
				title,
				category,
				summary,
				body,
				author,
				event_date,
				image_type: image_type || 'url',
				image_url
			});
		} catch (err: any) {
			console.error('Error updating D1 content:', err);
			return fail(500, { message: err.message || 'Gagal menguraikan pembaruan ke Cloudflare D1' });
		}

		throw redirect(303, '/admin');
	}
};
