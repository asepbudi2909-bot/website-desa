/**
 * Storage Helper Module for Cloudflare R2
 * Handles local fallback storage for dev environment
 */

const localR2Store = new Map<string, { body: Uint8Array; contentType: string }>();

export function saveLocalMockR2(key: string, body: Uint8Array, contentType: string) {
	localR2Store.set(key, { body, contentType });
}

export function getLocalMockR2(key: string) {
	return localR2Store.get(key);
}
