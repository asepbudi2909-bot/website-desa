import { getAllContent } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, platform }) => {
	const category = url.searchParams.get('category') || undefined;
	const search = url.searchParams.get('search')?.toLowerCase() || '';

	let contents = await getAllContent(platform, category);

	if (search) {
		contents = contents.filter(
			(item) => item.title.toLowerCase().includes(search) || item.summary.toLowerCase().includes(search)
		);
	}

	return {
		contents,
		selectedCategory: category || 'all',
		searchQuery: search
	};
};
