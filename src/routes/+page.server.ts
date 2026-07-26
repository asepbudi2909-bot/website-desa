import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const category = url.searchParams.get('category') || undefined;
	const search = url.searchParams.get('search')?.toLowerCase() || '';

	let apiUrl = '/api/contents';
	if (category) {
		apiUrl += `?category=${category}`;
	}

	const res = await fetch(apiUrl);
	const result = await res.json() as { success: boolean; data: VillageContent[]; message?: string };

	let contents = result.success ? result.data : [];

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
