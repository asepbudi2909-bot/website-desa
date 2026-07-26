import { fail, redirect, type Actions } from '@sveltejs/kit';
import { createContent } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const category = formData.get('category')?.toString() as 'berita' | 'acara' | 'pengumuman';
		const summary = formData.get('summary')?.toString().trim();
		const body = formData.get('body')?.toString().trim();
		const author = formData.get('author')?.toString().trim() || 'Admin Desa';
		const event_date = formData.get('event_date')?.toString().trim() || null;
		const image_type = formData.get('image_type')?.toString() as 'r2' | 'url';
		const image_url = formData.get('image_url')?.toString().trim();

		// Form Validations
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
			return fail(400, { message: 'Gambar wajib disediakan (Upload ke R2 atau masukkan URL)' });
		}

		try {
			await createContent(platform, {
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
			console.error('Failed to create content in D1:', err);
			return fail(500, { message: err.message || 'Gagal menyimpan konten ke Cloudflare D1' });
		}

		throw redirect(303, '/admin');
	}
};
