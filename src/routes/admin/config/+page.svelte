<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { config }: PageData = $props();

	let villageName = config?.village_name || '';
	let villageCode = config?.village_code || '';
	let districtName = config?.district_name || '';
	let regencyName = config?.regency_name || '';
	let provinceName = config?.province_name || '';
	let postalCode = config?.postal_code || '';
	let address = config?.address || '';
	let phone = config?.phone || '';
	let email = config?.email || '';
	let website = config?.website || '';
	let headOfVillage = config?.head_of_village || '';
	let headTitle = config?.head_title || 'Kepala Desa';
	let description = config?.description || '';
	let logoImageType = config?.logo_image_type || 'url';
	let logoImageUrl = config?.logo_image_url || '';
	let bannerImageType = config?.banner_image_type || 'url';
	let bannerImageUrl = config?.banner_image_url || '';
	let primaryColor = config?.primary_color || '#059669';
	let secondaryColor = config?.secondary_color || '#0284c7';
	let socialMediaFacebook = config?.social_media_facebook || '';
	let socialMediaInstagram = config?.social_media_instagram || '';
	let socialMediaTwitter = config?.social_media_twitter || '';
	let socialMediaYoutube = config?.social_media_youtube || '';

	let saving = false;
	let successMessage = '';
	let errorMessage = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		saving = true;
		successMessage = '';
		errorMessage = '';

		const formData = new FormData(event.target as HTMLFormElement);

		try {
			const response = await fetch('?/default', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				successMessage = result.message || 'Konfigurasi berhasil disimpan!';
				// Reset pesan setelah 3 detik
				setTimeout(() => {
					successMessage = '';
				}, 3000);
			} else {
				errorMessage = result.error || 'Gagal menyimpan konfigurasi';
			}
		} catch (error) {
			errorMessage = 'Terjadi kesalahan saat menyimpan';
			console.error(error);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Konfigurasi Identitas Desa - Admin</title>
</svelte:head>

<div class="config-container">
	<div class="config-header">
		<h1>🏛️ Konfigurasi Identitas Desa</h1>
		<p>Atur informasi profil, kontak, dan tampilan desa Anda</p>
	</div>

	{#if successMessage}
		<div class="alert alert-success">
			<span class="alert-icon">✓</span>
			{successMessage}
		</div>
	{/if}

	{#if errorMessage}
		<div class="alert alert-error">
			<span class="alert-icon">⚠</span>
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="config-form">
		<!-- Section: Informasi Dasar -->
		<div class="form-section">
			<h2>📋 Informasi Dasar Desa</h2>
			
			<div class="form-grid">
				<div class="form-group full-width">
					<label for="village_name">Nama Desa <span class="required">*</span></label>
					<input 
						type="text" 
						id="village_name" 
						name="village_name" 
						bind:value={villageName}
						placeholder="Contoh: Desa Sukamaju"
						required
					/>
				</div>

				<div class="form-group">
					<label for="village_code">Kode Desa</label>
					<input 
						type="text" 
						id="village_code" 
						name="village_code" 
						bind:value={villageCode}
						placeholder="Contoh: 3201234567"
					/>
				</div>

				<div class="form-group">
					<label for="head_title">Jabatan Kepala</label>
					<input 
						type="text" 
						id="head_title" 
						name="head_title" 
						bind:value={headTitle}
						placeholder="Kepala Desa"
					/>
				</div>

				<div class="form-group full-width">
					<label for="head_of_village">Nama Kepala Desa</label>
					<input 
						type="text" 
						id="head_of_village" 
						name="head_of_village" 
						bind:value={headOfVillage}
						placeholder="Contoh: Bapak Ahmad Suryadi"
					/>
				</div>

				<div class="form-group full-width">
					<label for="description">Deskripsi Desa</label>
					<textarea 
						id="description" 
						name="description" 
						bind:value={description}
						rows="3"
						placeholder="Deskripsi singkat tentang desa Anda..."
					></textarea>
				</div>
			</div>
		</div>

		<!-- Section: Wilayah Administratif -->
		<div class="form-section">
			<h2>🗺️ Wilayah Administratif</h2>
			
			<div class="form-grid">
				<div class="form-group">
					<label for="district_name">Kecamatan</label>
					<input 
						type="text" 
						id="district_name" 
						name="district_name" 
						bind:value={districtName}
						placeholder="Nama kecamatan"
					/>
				</div>

				<div class="form-group">
					<label for="regency_name">Kabupaten/Kota</label>
					<input 
						type="text" 
						id="regency_name" 
						name="regency_name" 
						bind:value={regencyName}
						placeholder="Nama kabupaten/kota"
					/>
				</div>

				<div class="form-group">
					<label for="province_name">Provinsi</label>
					<input 
						type="text" 
						id="province_name" 
						name="province_name" 
						bind:value={provinceName}
						placeholder="Nama provinsi"
					/>
				</div>

				<div class="form-group">
					<label for="postal_code">Kode Pos</label>
					<input 
						type="text" 
						id="postal_code" 
						name="postal_code" 
						bind:value={postalCode}
						placeholder="Contoh: 45678"
					/>
				</div>
			</div>
		</div>

		<!-- Section: Kontak -->
		<div class="form-section">
			<h2>📞 Informasi Kontak</h2>
			
			<div class="form-grid">
				<div class="form-group full-width">
					<label for="address">Alamat Kantor Desa</label>
					<textarea 
						id="address" 
						name="address" 
						bind:value={address}
						rows="2"
						placeholder="Alamat lengkap kantor desa..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="phone">Nomor Telepon</label>
					<input 
						type="tel" 
						id="phone" 
						name="phone" 
						bind:value={phone}
						placeholder="Contoh: 021-1234567"
					/>
				</div>

				<div class="form-group">
					<label for="email">Email Resmi</label>
					<input 
						type="email" 
						id="email" 
						name="email" 
						bind:value={email}
						placeholder="desa@contoh.go.id"
					/>
				</div>

				<div class="form-group full-width">
					<label for="website">Website</label>
					<input 
						type="url" 
						id="website" 
						name="website" 
						bind:value={website}
						placeholder="https://desa.contoh.go.id"
					/>
				</div>
			</div>
		</div>

		<!-- Section: Logo & Banner -->
		<div class="form-section">
			<h2>🎨 Logo & Tampilan</h2>
			
			<div class="form-grid">
				<div class="form-group">
					<label for="logo_image_type">Sumber Logo</label>
					<select id="logo_image_type" name="logo_image_type" bind:value={logoImageType}>
						<option value="url">Tautan URL</option>
						<option value="r2">Server</option>
					</select>
				</div>

				<div class="form-group full-width">
					<label for="logo_image_url">URL Logo Desa</label>
					<input 
						type="url" 
						id="logo_image_url" 
						name="logo_image_url" 
						bind:value={logoImageUrl}
						placeholder="https://example.com/logo.png"
					/>
					{#if logoImageUrl}
						<div class="image-preview">
							<img src={logoImageUrl} alt="Preview Logo" />
						</div>
					{/if}
				</div>

				<div class="form-group">
					<label for="banner_image_type">Sumber Banner</label>
					<select id="banner_image_type" name="banner_image_type" bind:value={bannerImageType}>
						<option value="url">Tautan URL</option>
						<option value="r2">Server</option>
					</select>
				</div>

				<div class="form-group full-width">
					<label for="banner_image_url">URL Banner/Hero Image</label>
					<input 
						type="url" 
						id="banner_image_url" 
						name="banner_image_url" 
						bind:value={bannerImageUrl}
						placeholder="https://example.com/banner.jpg"
					/>
					{#if bannerImageUrl}
						<div class="image-preview banner">
							<img src={bannerImageUrl} alt="Preview Banner" />
						</div>
					{/if}
				</div>

				<div class="form-group">
					<label for="primary_color">Warna Utama</label>
					<div class="color-input">
						<input 
							type="color" 
							id="primary_color" 
							name="primary_color" 
							bind:value={primaryColor}
						/>
						<input 
							type="text" 
							bind:value={primaryColor}
							placeholder="#059669"
						/>
					</div>
				</div>

				<div class="form-group">
					<label for="secondary_color">Warna Sekunder</label>
					<div class="color-input">
						<input 
							type="color" 
							id="secondary_color" 
							name="secondary_color" 
							bind:value={secondaryColor}
						/>
						<input 
							type="text" 
							bind:value={secondaryColor}
							placeholder="#0284c7"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Section: Media Sosial -->
		<div class="form-section">
			<h2>🌐 Media Sosial</h2>
			
			<div class="form-grid">
				<div class="form-group full-width">
					<label for="social_media_facebook">Facebook</label>
					<input 
						type="url" 
						id="social_media_facebook" 
						name="social_media_facebook" 
						bind:value={socialMediaFacebook}
						placeholder="https://facebook.com/desaanda"
					/>
				</div>

				<div class="form-group full-width">
					<label for="social_media_instagram">Instagram</label>
					<input 
						type="url" 
						id="social_media_instagram" 
						name="social_media_instagram" 
						bind:value={socialMediaInstagram}
						placeholder="https://instagram.com/desaanda"
					/>
				</div>

				<div class="form-group full-width">
					<label for="social_media_twitter">Twitter / X</label>
					<input 
						type="url" 
						id="social_media_twitter" 
						name="social_media_twitter" 
						bind:value={socialMediaTwitter}
						placeholder="https://twitter.com/desaanda"
					/>
				</div>

				<div class="form-group full-width">
					<label for="social_media_youtube">YouTube</label>
					<input 
						type="url" 
						id="social_media_youtube" 
						name="social_media_youtube" 
						bind:value={socialMediaYoutube}
						placeholder="https://youtube.com/@desaanda"
					/>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="form-actions">
			<button type="submit" class="btn-primary" disabled={saving}>
				{#if saving}
					<span class="spinner"></span>
					Menyimpan...
				{:else}
					💾 Simpan Konfigurasi
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.config-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.config-header {
		margin-bottom: 2rem;
	}

	.config-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 0.5rem;
	}

	.config-header p {
		color: #64748b;
		font-size: 1rem;
	}

	.alert {
		padding: 1rem 1.5rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		animation: slideIn 0.3s ease-out;
	}

	.alert-success {
		background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
		border: 2px solid #86efac;
		color: #166534;
	}

	.alert-error {
		background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
		border: 2px solid #fca5a5;
		color: #991b1b;
	}

	.alert-icon {
		font-size: 1.25rem;
		font-weight: bold;
	}

	.config-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-section {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
		border: 1px solid #e2e8f0;
	}

	.form-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid #e2e8f0;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	label {
		font-weight: 500;
		color: #475569;
		font-size: 0.95rem;
	}

	.required {
		color: #ef4444;
	}

	input[type="text"],
	input[type="email"],
	input[type="tel"],
	input[type="url"],
	input[type="color"],
	select,
	textarea {
		padding: 0.75rem 1rem;
		border: 2px solid #e2e8f0;
		border-radius: 10px;
		font-size: 1rem;
		transition: all 0.3s ease;
		background: white;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #059669;
		box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.color-input {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.color-input input[type="color"] {
		width: 50px;
		height: 45px;
		padding: 0;
		cursor: pointer;
	}

	.color-input input[type="text"] {
		flex: 1;
	}

	.image-preview {
		margin-top: 0.75rem;
		border-radius: 10px;
		overflow: hidden;
		border: 2px solid #e2e8f0;
	}

	.image-preview img {
		width: 100%;
		height: auto;
		display: block;
		max-height: 200px;
		object-fit: cover;
	}

	.image-preview.banner img {
		max-height: 150px;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		padding-top: 1rem;
	}

	.btn-primary {
		background: linear-gradient(135deg, #059669 0%, #10b981 100%);
		color: white;
		padding: 1rem 2.5rem;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px -1px rgba(5, 150, 105, 0.4);
	}

	.btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.config-container {
			padding: 1rem;
		}

		.form-section {
			padding: 1.5rem;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
