// App definitions for Cloudflare bindings (D1 Database and R2 Storage)
declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				BUCKET: R2Bucket;
				ADMIN_SECRET?: string;
			};
			cf: Record<string, unknown>;
			ctx: {
				waitUntil(promise: Promise<unknown>): void;
				passThroughOnException(): void;
			};
		}
	}

	// Content Data Model for Desa CMS
	interface VillageContent {
		id: number;
		slug: string;
		title: string;
		category: 'berita' | 'acara' | 'pengumuman';
		summary: string;
		body: string;
		image_type: 'r2' | 'url';
		image_url: string;
		author: string;
		is_published: number;
		event_date?: string | null;
		created_at: string;
		updated_at: string;
	}
}

export {};