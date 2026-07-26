import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/contents?admin=true');
	const result = await res.json() as { success: boolean; data: VillageContent[] };
	const contents = result.success ? result.data : [];

	return {
		contents
	};
};

export const actions: Actions = {
	delete: async ({ request, fetch }) => {
		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();

		if (!idStr) {
			return fail(400, { message: 'ID Konten tidak valid' });
		}

		const res = await fetch(`/api/contents/${idStr}`, {
			method: 'DELETE'
		});
		const result = await res.json() as { success: boolean; message?: string };

		if (!result.success) {
			return fail(500, { message: result.message || 'Gagal menghapus konten dari D1 Database' });
		}

		return { success: true, message: 'Konten berhasil dihapus dari Cloudflare D1!' };
	}
};
