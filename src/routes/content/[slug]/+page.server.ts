import { error } from '@sveltejs/kit';
import { getContentBySlug, getAllContent } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const content = await getContentBySlug(platform, params.slug);

	if (!content) {
		throw error(404, { message: 'Konten berita atau pengumuman tidak ditemukan.' });
	}

	// Fetch related content items in the same category
	const allCategoryItems = await getAllContent(platform, content.category);
	const related = allCategoryItems.filter((i) => i.id !== content.id).slice(0, 3);

	return {
		content,
		related
	};
};
