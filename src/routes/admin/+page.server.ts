import { getAllContentForAdmin, deleteContent } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const contents = await getAllContentForAdmin(platform);
	return {
		contents
	};
};

export const actions: Actions = {
	delete: async ({ request, platform }) => {
		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();

		if (!idStr) {
			return fail(400, { message: 'ID Konten tidak valid' });
		}

		const id = parseInt(idStr, 10);
		const success = await deleteContent(platform, id);

		if (!success) {
			return fail(500, { message: 'Gagal menghapus konten dari D1 Database' });
		}

		return { success: true, message: 'Konten berhasil dihapus dari Cloudflare D1!' };
	}
};
