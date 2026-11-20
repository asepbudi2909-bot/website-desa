import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getVillageConfig,
	saveVillageConfig,
	type VillageConfigInput
} from '$lib/server/config';

function readConfig(formData: FormData): VillageConfigInput {
	const value = (name: string, fallback = '') =>
		(formData.get(name) as string | null)?.trim() || fallback;

	return {
		village_name: value('village_name'),
		village_code: value('village_code') || null,
		district_name: value('district_name') || null,
		regency_name: value('regency_name') || null,
		province_name: value('province_name') || null,
		postal_code: value('postal_code') || null,
		address: value('address') || null,
		phone: value('phone') || null,
		email: value('email') || null,
		website: value('website') || null,
		head_of_village: value('head_of_village') || null,
		head_title: value('head_title', 'Kepala Desa'),
		description: value('description') || null,
		logo_image_type: value('logo_image_type', 'url'),
		logo_image_url: value('logo_image_url') || null,
		banner_image_type: value('banner_image_type', 'url'),
		banner_image_url: value('banner_image_url') || null,
		primary_color: value('primary_color', '#059669'),
		secondary_color: value('secondary_color', '#0284c7'),
		social_media_facebook: value('social_media_facebook') || null,
		social_media_instagram: value('social_media_instagram') || null,
		social_media_twitter: value('social_media_twitter') || null,
		social_media_youtube: value('social_media_youtube') || null
	};
}

export const load: PageServerLoad = async ({ platform }) => {
	return {
		config: await getVillageConfig(platform)
	};
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const data = readConfig(await request.formData());

		if (!data.village_name) {
			return fail(400, {
				error: 'Nama desa wajib diisi',
				data
			});
		}

		try {
			await saveVillageConfig(platform, data);
			return {
				success: true,
				message: 'Konfigurasi identitas desa berhasil disimpan!'
			};
		} catch (error) {
			console.error('Error saving config:', error);
			return fail(500, {
				error: 'Gagal menyimpan konfigurasi. Silakan coba lagi.',
				data
			});
		}
	}
};
