<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// State for dual image storage mode: 'r2' | 'url'
	let imageStorageMode = $state<'r2' | 'url'>('r2');
	let imageUrl = $state('');
	let externalUrlInput = $state('');
	let isUploadingR2 = $state(false);
	let uploadError = $state('');
	let uploadSuccessMessage = $state('');
	let selectedCategory = $state<'berita' | 'acara' | 'pengumuman'>('berita');

	async function handleR2FileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const file = input.files[0];
		isUploadingR2 = true;
		uploadError = '';
		uploadSuccessMessage = '';

		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = (await res.json()) as { success: boolean; image_url?: string; message?: string };

			if (result.success && result.image_url) {
				imageUrl = result.image_url;
				uploadSuccessMessage = result.message || 'Gambar berhasil diunggah ke R2 Bucket!';
			} else {
				uploadError = result.message || 'Gagal mengunggah gambar ke Cloudflare R2';
			}
		} catch {
			uploadError = 'Terjadi kesalahan saat mengunggah berkas.';
		} finally {
			isUploadingR2 = false;
		}
	}

	function handleExternalUrlApply() {
		if (!externalUrlInput) {
			uploadError = 'Masukkan URL gambar eksternal yang valid';
			return;
		}
		uploadError = '';
		imageUrl = externalUrlInput.trim();
		uploadSuccessMessage = 'URL Gambar eksternal berhasil diterapkan!';
	}
</script>

<svelte:head>
	<title>Tambah Konten Baru - CMS Desa Sukamaju</title>
</svelte:head>

<div class="create-page container animate-fade-in">
	<div class="breadcrumb">
		<a href="/admin" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="19" x2="5" y1="12" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Kembali ke Dashboard Admin
		</a>
	</div>

	<div class="form-container glass-panel">
		<div class="form-header">
			<h2>➕ Tambah Konten Desa Baru</h2>
			<p>Konten yang dibuat akan langsung tersimpan di Cloudflare D1 Database.</p>
		</div>

		{#if form?.message}
			<div class="alert alert-danger glass-panel">
				⚠️ {form.message}
			</div>
		{/if}

		<form method="POST" use:enhance class="cms-form">
			<input type="hidden" name="image_type" value={imageStorageMode} />
			<input type="hidden" name="image_url" value={imageUrl} />

			<div class="form-row">
				<!-- Title Input -->
				<div class="form-group flex-2">
					<label for="title" class="form-label">Judul Konten / Berita <span class="required">*</span></label>
					<input
						type="text"
						id="title"
						name="title"
						class="form-input"
						placeholder="Contoh: Peresmian Jalan Tani Desa Sukamaju"
						required
					/>
				</div>

				<!-- Category Dropdown -->
				<div class="form-group flex-1">
					<label for="category" class="form-label">Kategori Publikasi <span class="required">*</span></label>
					<select id="category" name="category" bind:value={selectedCategory} class="form-select">
						<option value="berita">📰 Berita Desa</option>
						<option value="acara">📅 Agenda / Acara</option>
						<option value="pengumuman">📢 Pengumuman Resmi</option>
					</select>
				</div>
			</div>

			<div class="form-row">
				<!-- Author -->
				<div class="form-group flex-1">
					<label for="author" class="form-label">Penulis / Instansi</label>
					<input
						type="text"
						id="author"
						name="author"
						class="form-input"
						placeholder="Contoh: Sekretaris Desa / Humas"
					/>
				</div>

				<!-- Event Date (Conditional if category == 'acara') -->
				{#if selectedCategory === 'acara'}
					<div class="form-group flex-1">
						<label for="event_date" class="form-label">Tanggal Pelaksanaan Acara</label>
						<input type="date" id="event_date" name="event_date" class="form-input" />
					</div>
				{/if}
			</div>

			<!-- Dynamic Image Storage Option (Step 4 Requirement) -->
			<div class="storage-option-card">
				<span class="form-label block-label">Opsi Penyimpanan Gambar Media <span class="required">*</span></span>
				<p class="option-desc">Pilih metode penyimpanan gambar untuk publikasi ini (Cloudflare R2 atau External URL):</p>

				<!-- Toggle Tabs -->
				<div class="mode-tabs">
					<button
						type="button"
						class="mode-btn {imageStorageMode === 'r2' ? 'active' : ''}"
						onclick={() => { imageStorageMode = 'r2'; uploadError = ''; }}
					>
						<span class="mode-icon">☁️</span>
						<span>Simpan Gambar ke Cloudflare R2</span>
					</button>

					<button
						type="button"
						class="mode-btn {imageStorageMode === 'url' ? 'active' : ''}"
						onclick={() => { imageStorageMode = 'url'; uploadError = ''; }}
					>
						<span class="mode-icon">🌐</span>
						<span>Gunakan Link/URL Gambar External</span>
					</button>
				</div>

				<!-- Mode A: R2 File Upload -->
				{#if imageStorageMode === 'r2'}
					<div class="upload-box">
						<div class="drop-zone">
							<input
								type="file"
								id="r2_file"
								accept="image/*"
								onchange={handleR2FileUpload}
								disabled={isUploadingR2}
								class="file-input-hidden"
							/>
							<label for="r2_file" class="drop-zone-label">
								{#if isUploadingR2}
									<div class="spinner"></div>
									<span>Mengunggah gambar ke Cloudflare R2 Bucket...</span>
								{:else}
									<span class="upload-icon">📁</span>
									<span class="upload-text">Klik atau seret file gambar ke sini</span>
									<span class="upload-hint">Format: JPG, PNG, WebP (Maksimal 10MB)</span>
								{/if}
							</label>
						</div>
					</div>
				{/if}

				<!-- Mode B: External URL Input -->
				{#if imageStorageMode === 'url'}
					<div class="url-input-box">
						<div class="url-input-group">
							<input
								type="url"
								bind:value={externalUrlInput}
								placeholder="https://images.unsplash.com/... atau URL gambar publik"
								class="form-input"
							/>
							<button type="button" class="btn btn-secondary" onclick={handleExternalUrlApply}>
								Terapkan URL
							</button>
						</div>
					</div>
				{/if}

				<!-- Feedback Messages -->
				{#if uploadError}
					<div class="msg-box msg-error">⚠️ {uploadError}</div>
				{/if}
				{#if uploadSuccessMessage}
					<div class="msg-box msg-success">✅ {uploadSuccessMessage}</div>
				{/if}

				<!-- Image Live Preview -->
				{#if imageUrl}
					<div class="preview-box">
						<div class="preview-header">
							<span>Pratinjau Gambar:</span>
							<span class="badge badge-{imageStorageMode}">
								{imageStorageMode === 'r2' ? 'Cloudflare R2 Bucket' : 'External Image URL'}
							</span>
						</div>
						<img src={imageUrl} alt="Preview" class="preview-img" />
						<div class="preview-path"><code>{imageUrl}</code></div>
					</div>
				{/if}
			</div>

			<!-- Summary Input -->
			<div class="form-group">
				<label for="summary" class="form-label">Ringkasan Singkat (Summary) <span class="required">*</span></label>
				<textarea
					id="summary"
					name="summary"
					class="form-textarea"
					rows="3"
					placeholder="Tuliskan 1-2 kalimat ringkasan yang akan tampil di halaman depan..."
					required
				></textarea>
			</div>

			<!-- Full Body Input -->
			<div class="form-group">
				<label for="body" class="form-label">Isi Lengkap Konten <span class="required">*</span></label>
				<textarea
					id="body"
					name="body"
					class="form-textarea"
					rows="8"
					placeholder="Tuliskan isi konten secara lengkap di sini. Gunakan baris baru untuk memisahkan paragraf."
					required
				></textarea>
			</div>

			<!-- Submit Actions -->
			<div class="form-actions">
				<a href="/admin" class="btn btn-secondary">Batal</a>
				<button type="submit" class="btn btn-primary" disabled={!imageUrl}>
					💾 Simpan & Publikasikan ke D1
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.create-page {
		padding: 2.5rem 1.5rem 4rem 1.5rem;
		max-width: 860px;
	}

	.breadcrumb {
		margin-bottom: 1.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.back-link:hover {
		color: var(--primary-500);
	}

	.form-container {
		padding: 2.5rem;
	}

	.form-header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.form-header h2 {
		font-size: 1.75rem;
		margin-bottom: 0.35rem;
	}

	.form-header p {
		color: var(--text-secondary);
		font-size: 0.925rem;
	}

	.alert-danger {
		padding: 1rem;
		background: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
		margin-bottom: 1.5rem;
	}

	.cms-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-row {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.flex-1 { flex: 1; min-width: 240px; }
	.flex-2 { flex: 2; min-width: 300px; }

	.required {
		color: #ef4444;
	}

	.block-label {
		display: block;
		margin-bottom: 0.4rem;
	}

	.storage-option-card {
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid var(--border-dark);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		margin: 0.5rem 0;
	}

	.option-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
	}

	.mode-tabs {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.mode-btn {
		flex: 1;
		min-width: 220px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.85rem 1rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--border-dark);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mode-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
	}

	.mode-btn.active {
		background: rgba(16, 185, 129, 0.15);
		border-color: var(--primary-500);
		color: #ffffff;
		box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
	}

	.drop-zone {
		position: relative;
		border: 2px dashed rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		padding: 2rem;
		text-align: center;
		background: rgba(0, 0, 0, 0.2);
		transition: border-color 0.2s ease;
	}

	.drop-zone:hover {
		border-color: var(--primary-500);
	}

	.file-input-hidden {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}

	.drop-zone-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		pointer-events: none;
	}

	.upload-icon {
		font-size: 2.2rem;
	}

	.upload-text {
		font-weight: 600;
		color: #ffffff;
	}

	.upload-hint {
		font-size: 0.775rem;
		color: var(--text-muted);
	}

	.url-input-group {
		display: flex;
		gap: 0.75rem;
	}

	.preview-box {
		margin-top: 1.25rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		margin-bottom: 0.75rem;
	}

	.preview-img {
		width: 100%;
		max-height: 260px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.preview-path {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-top: 0.5rem;
		word-break: break-all;
	}

	.msg-box {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		margin-top: 1rem;
	}

	.msg-error {
		background: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
	}

	.msg-success {
		background: rgba(16, 185, 129, 0.15);
		color: #34d399;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(255,255,255,0.2);
		border-top-color: var(--primary-500);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
