/**
 * Data Service Layer for village identity config.
 *
 * Same pattern as db.ts: Cloudflare D1 when the binding exists, in-memory
 * fallback for local dev and for runtimes without a D1 binding.
 */

export interface VillageConfig {
	id: number;
	village_name: string;
	village_code: string | null;
	district_name: string | null;
	regency_name: string | null;
	province_name: string | null;
	postal_code: string | null;
	address: string | null;
	phone: string | null;
	email: string | null;
	website: string | null;
	head_of_village: string | null;
	head_title: string | null;
	description: string | null;
	logo_image_type: string;
	logo_image_url: string | null;
	banner_image_type: string;
	banner_image_url: string | null;
	primary_color: string;
	secondary_color: string;
	social_media_facebook: string | null;
	social_media_instagram: string | null;
	social_media_twitter: string | null;
	social_media_youtube: string | null;
	updated_at: string;
}

export type VillageConfigInput = Omit<VillageConfig, 'id' | 'updated_at'>;

const defaultConfig: VillageConfig = {
	id: 1,
	village_name: 'Desa Sukamaju',
	village_code: null,
	district_name: 'Kecamatan Majujaya',
	regency_name: 'Kabupaten Sejahtera',
	province_name: 'Provinsi Makmur',
	postal_code: null,
	address: null,
	phone: null,
	email: null,
	website: null,
	head_of_village: 'Bapak Ahmad Suryadi',
	head_title: 'Kepala Desa',
	description:
		'Desa Sukamaju adalah desa yang asri dan modern dengan komitmen terhadap pelayanan publik berbasis teknologi digital untuk kesejahteraan seluruh warga.',
	logo_image_type: 'url',
	logo_image_url:
		'https://images.unsplash.com/photo-1596483758362-e03c5e0d8b9f?auto=format&fit=crop&w=200&q=80',
	banner_image_type: 'url',
	banner_image_url: null,
	primary_color: '#059669',
	secondary_color: '#0284c7',
	social_media_facebook: null,
	social_media_instagram: null,
	social_media_twitter: null,
	social_media_youtube: null,
	updated_at: new Date().toISOString()
};

let memoryConfig: VillageConfig = { ...defaultConfig };

export async function getVillageConfig(
	platform?: App.Platform
): Promise<VillageConfig | null> {
	if (platform?.env?.DB) {
		const row = await platform.env.DB.prepare(
			'SELECT * FROM village_config WHERE id = 1'
		).first();
		return (row as unknown as VillageConfig) || null;
	}

	return memoryConfig;
}

export async function saveVillageConfig(
	platform: App.Platform | undefined,
	data: VillageConfigInput
): Promise<boolean> {
	const now = new Date().toISOString();

	if (platform?.env?.DB) {
		const columns = Object.keys(data) as (keyof VillageConfigInput)[];
		const updates = columns.map((c) => `${c} = excluded.${c}`).join(', ');
		const placeholders = columns.map(() => '?').join(', ');

		const stmt = platform.env.DB.prepare(`
			INSERT INTO village_config (id, ${columns.join(', ')}, updated_at)
			VALUES (1, ${placeholders}, ?)
			ON CONFLICT(id) DO UPDATE SET ${updates}, updated_at = excluded.updated_at
		`);

		const res = await stmt.bind(...columns.map((c) => data[c]), now).run();
		return res.success;
	}

	memoryConfig = { ...memoryConfig, ...data, updated_at: now };
	return true;
}
