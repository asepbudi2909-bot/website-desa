<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Pre-fill state from existing content item
	let imageStorageMode = $state<'r2' | 'url'>(data.content.image_type || 'url');
	let imageUrl = $state(data.content.image_url || '');
	let externalUrlInput = $state(data.content.image_type === 'url' ? data.content.image_url : '');
	let isUploadingR2 = $state(false);
	let uploadError = $state('');
	let uploadSuccessMessage = $state('');
	let selectedCategory = $state<'berita' | 'acara' | 'pengumuman'>(data.content.category);

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
				uploadSuccessMessage = result.message || 'Gambar baru berhasil diunggah!';
			} else {
				uploadError = result.message || 'Gagal mengunggah gambar';
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
		uploadSuccessMessage = 'URL Gambar eksternal berhasil diperbarui!';
	}
</script>

<svelte:head>
	<title>Edit Konten #{data.content.id} - CMS Desa Sukamaju</title>
</svelte:head>

<div class="edit-page container animate-fade-in">
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
			<h2>✏️ Edit Konten #{data.content.id}</h2>
			<p>Perubahan akan langsung memperbarui baris data di database server.</p>
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
						value={data.content.title}
						class="form-input"
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
						value={data.content.author}
						class="form-input"
					/>
				</div>

				<!-- Event Date -->
				{#if selectedCategory === 'acara'}
					<div class="form-group flex-1">
						<label for="event_date" class="form-label">Tanggal Pelaksanaan Acara</label>
						<input
							type="date"
							id="event_date"
							name="event_date"
							value={data.content.event_date || ''}
							class="form-input"
						/>
					</div>
				{/if}
			</div>

			<!-- Dynamic Image Storage Option -->
			<div class="storage-option-card">
				<span class="form-label block-label">Opsi Penyimpanan Gambar Media <span class="required">*</span></span>

				<!-- Toggle Tabs -->
				<div class="mode-tabs">
					<button
						type="button"
						class="mode-btn {imageStorageMode === 'r2' ? 'active' : ''}"
						onclick={() => { imageStorageMode = 'r2'; uploadError = ''; }}
					>
						<span class="mode-icon">☁️</span>
						<span>Tersimpan di Server</span>
					</button>

					<button
						type="button"
						class="mode-btn {imageStorageMode === 'url' ? 'active' : ''}"
						onclick={() => { imageStorageMode = 'url'; uploadError = ''; }}
					>
						<span class="mode-icon">🌐</span>
						<span>URL Gambar External</span>
					</button>
				</div>

				<!-- Mode A: Unggah File -->
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
									<span>Mengunggah gambar...</span>
								{:else}
									<span class="upload-icon">📁</span>
									<span class="upload-text">Unggah gambar baru</span>
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
								placeholder="https://images.unsplash.com/..."
								class="form-input"
							/>
							<button type="button" class="btn btn-secondary" onclick={handleExternalUrlApply}>
								Perbarui URL
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
							<span>Gambar Saat Ini:</span>
							<span class="badge badge-{imageStorageMode}">
								{imageStorageMode === 'r2' ? 'Tersimpan di Server' : 'Tautan Eksternal'}
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
					required
				>{data.content.summary}</textarea>
			</div>

			<!-- Full Body Input -->
			<div class="form-group">
				<label for="body" class="form-label">Isi Lengkap Konten <span class="required">*</span></label>
				<textarea
					id="body"
					name="body"
					class="form-textarea"
					rows="8"
					required
				>{data.content.body}</textarea>
			</div>

			<!-- Submit Actions -->
			<div class="form-actions">
				<a href="/admin" class="btn btn-secondary">Batal</a>
				<button type="submit" class="btn btn-primary" disabled={!imageUrl}>
					💾 Perbarui & Simpan
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.edit-page {
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
