import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const db = locals.db;
	
	// Ambil konfigurasi desa
	const config = await db
		.select('SELECT * FROM village_config WHERE id = 1')
		.first();
	
	return {
		config: config || null
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const db = locals.db;
		const formData = await request.formData();
		
		const data = {
			village_name: formData.get('village_name') as string || '',
			village_code: formData.get('village_code') as string || '',
			district_name: formData.get('district_name') as string || '',
			regency_name: formData.get('regency_name') as string || '',
			province_name: formData.get('province_name') as string || '',
			postal_code: formData.get('postal_code') as string || '',
			address: formData.get('address') as string || '',
			phone: formData.get('phone') as string || '',
			email: formData.get('email') as string || '',
			website: formData.get('website') as string || '',
			head_of_village: formData.get('head_of_village') as string || '',
			head_title: formData.get('head_title') as string || 'Kepala Desa',
			description: formData.get('description') as string || '',
			logo_image_type: formData.get('logo_image_type') as string || 'url',
			logo_image_url: formData.get('logo_image_url') as string || '',
			banner_image_type: formData.get('banner_image_type') as string || 'url',
			banner_image_url: formData.get('banner_image_url') as string || '',
			primary_color: formData.get('primary_color') as string || '#059669',
			secondary_color: formData.get('secondary_color') as string || '#0284c7',
			social_media_facebook: formData.get('social_media_facebook') as string || '',
			social_media_instagram: formData.get('social_media_instagram') as string || '',
			social_media_twitter: formData.get('social_media_twitter') as string || '',
			social_media_youtube: formData.get('social_media_youtube') as string || ''
		};
		
		// Validasi sederhana
		if (!data.village_name) {
			return fail(400, { 
				error: 'Nama desa wajib diisi',
				data 
			});
		}
		
		try {
			// Cek apakah konfigurasi sudah ada
			const existing = await db
				.select('SELECT id FROM village_config WHERE id = 1')
				.first();
			
			if (existing) {
				// Update konfigurasi yang ada
				await db.run(`
					UPDATE village_config SET
						village_name = ?,
						village_code = ?,
						district_name = ?,
						regency_name = ?,
						province_name = ?,
						postal_code = ?,
						address = ?,
						phone = ?,
						email = ?,
						website = ?,
						head_of_village = ?,
						head_title = ?,
						description = ?,
						logo_image_type = ?,
						logo_image_url = ?,
						banner_image_type = ?,
						banner_image_url = ?,
						primary_color = ?,
						secondary_color = ?,
						social_media_facebook = ?,
						social_media_instagram = ?,
						social_media_twitter = ?,
						social_media_youtube = ?,
						updated_at = CURRENT_TIMESTAMP
					WHERE id = 1
				`, [
					data.village_name,
					data.village_code,
					data.district_name,
					data.regency_name,
					data.province_name,
					data.postal_code,
					data.address,
					data.phone,
					data.email,
					data.website,
					data.head_of_village,
					data.head_title,
					data.description,
					data.logo_image_type,
					data.logo_image_url,
					data.banner_image_type,
					data.banner_image_url,
					data.primary_color,
					data.secondary_color,
					data.social_media_facebook,
					data.social_media_instagram,
					data.social_media_twitter,
					data.social_media_youtube
				]);
			} else {
				// Insert konfigurasi baru
				await db.run(`
					INSERT INTO village_config (
						id, village_name, village_code, district_name, regency_name,
						province_name, postal_code, address, phone, email, website,
						head_of_village, head_title, description, logo_image_type,
						logo_image_url, banner_image_type, banner_image_url,
						primary_color, secondary_color, social_media_facebook,
						social_media_instagram, social_media_twitter, social_media_youtube
					) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				`, [
					data.village_name,
					data.village_code,
					data.district_name,
					data.regency_name,
					data.province_name,
					data.postal_code,
					data.address,
					data.phone,
					data.email,
					data.website,
					data.head_of_village,
					data.head_title,
					data.description,
					data.logo_image_type,
					data.logo_image_url,
					data.banner_image_type,
					data.banner_image_url,
					data.primary_color,
					data.secondary_color,
					data.social_media_facebook,
					data.social_media_instagram,
					data.social_media_twitter,
					data.social_media_youtube
				]);
			}
			
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
