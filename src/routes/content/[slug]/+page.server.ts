import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/contents/${params.slug}`);
	const result = await res.json() as { success: boolean; data?: VillageContent; message?: string };

	if (!result.success || !result.data) {
		throw error(404, { message: result.message || 'Konten berita atau pengumuman tidak ditemukan.' });
	}

	const content = result.data;

	// Fetch related content items in the same category
	const relatedRes = await fetch(`/api/contents?category=${content.category}`);
	const relatedResult = await relatedRes.json() as { success: boolean; data: VillageContent[] };

	const allCategoryItems = relatedResult.success ? relatedResult.data : [];
	const related = allCategoryItems.filter((i) => i.id !== content.id).slice(0, 3);

	return {
		content,
		related
	};
};
