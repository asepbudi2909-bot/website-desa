<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state(data.searchQuery || '');
	let activeCategory = $state(data.selectedCategory || 'all');

	// Get config or use defaults
	const config = data.config;
	const villageName = config?.village_name || 'Desa Sukamaju';
	const heroImage = config?.banner_image_url || '';
	const primaryColor = config?.primary_color || '#059669';

	$effect(() => {
		searchQuery = data.searchQuery || '';
		activeCategory = data.selectedCategory || 'all';
	});

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d);
	}
</script>

<svelte:head>
	<title>Portal Informasi {villageName} - Berita, Acara & Pengumuman</title>
</svelte:head>

<div class="home-page animate-fade-in">
	<!-- Hero Section -->
	<section class="hero-section" style={heroImage ? `background-image: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.75) 100%), url('${heroImage}')` : ''}>
		<div class="container hero-container">
			<div class="hero-badge">
				<span class="pulse-dot"></span>
				Portal Informasi Digital Desa
			</div>
			<h1 class="hero-title">
				Selamat Datang di Portal Resmi <br />
				<span class="gradient-text">{villageName}</span>
			</h1>
			<p class="hero-subtitle">
				Transparansi, Kecepatan Informasi, dan Akses Pengumuman Publik untuk Masyarakat Desa.
			</p>

			<!-- Village Key Stats -->
			<div class="stats-grid">
				<div class="stat-card glass-panel">
					<div class="stat-value">4,520</div>
					<div class="stat-label">Jiwa Penduduk</div>
				</div>
				<div class="stat-card glass-panel">
					<div class="stat-value">5</div>
					<div class="stat-label">Wilayah Dusun</div>
				</div>
				<div class="stat-card glass-panel">
					<div class="stat-value">18</div>
					<div class="stat-label">RT / RW</div>
				</div>
				<div class="stat-card glass-panel highlight-stat">
					<div class="stat-value">100%</div>
					<div class="stat-label">Layanan Digital</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Filter & Search Toolbar -->
	<section class="filter-section">
		<div class="container">
			<div class="toolbar glass-panel">
				<!-- Category Buttons -->
				<div class="category-tabs">
					<a href="/" class="tab-btn {activeCategory === 'all' ? 'active' : ''}">
						Semua ({data.contents.length})
					</a>
					<a href="/?category=berita" class="tab-btn {activeCategory === 'berita' ? 'active' : ''}">
						📰 Berita
					</a>
					<a href="/?category=acara" class="tab-btn {activeCategory === 'acara' ? 'active' : ''}">
						📅 Acara
					</a>
					<a href="/?category=pengumuman" class="tab-btn {activeCategory === 'pengumuman' ? 'active' : ''}">
						📢 Pengumuman
					</a>
				</div>

				<!-- Search Form -->
				<form method="GET" action="/" class="search-form">
					{#if activeCategory !== 'all'}
						<input type="hidden" name="category" value={activeCategory} />
					{/if}
					<div class="search-input-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
							<circle cx="11" cy="11" r="8"/>
							<path d="m21 21-4.3-4.3"/>
						</svg>
						<input
							type="text"
							name="search"
							bind:value={searchQuery}
							placeholder="Cari berita atau pengumuman..."
							class="form-input search-input"
						/>
						{#if searchQuery}
							<a href={activeCategory !== 'all' ? `/?category=${activeCategory}` : '/'} class="clear-btn">✕</a>
						{/if}
					</div>
				</form>
			</div>
		</div>
	</section>

	<!-- Content Grid Section -->
	<section class="content-section">
		<div class="container">
			{#if data.contents.length === 0}
				<div class="empty-state glass-panel">
					<div class="empty-icon">🔍</div>
					<h3>Tidak ada konten ditemukan</h3>
					<p>Belum ada publikasi untuk kategori atau kata kunci yang dicari.</p>
					<a href="/" class="btn btn-secondary btn-sm" style="margin-top: 1rem;">Lihat Semua Konten</a>
				</div>
			{:else}
				<div class="content-grid">
					{#each data.contents as item (item.id)}
						<article class="content-card glass-panel">
							<div class="card-image-wrapper">
								<img src={item.image_url} alt={item.title} class="card-image" loading="lazy" />
								<div class="card-badges">
									<span class="badge badge-{item.category}">
										{item.category.toUpperCase()}
									</span>
									<span class="badge badge-{item.image_type}">
										{item.image_type === 'r2' ? '☁️ Tersimpan di Server' : '🌐 Tautan Eksternal'}
									</span>
								</div>
							</div>

							<div class="card-body">
								<div class="card-meta">
									<span class="meta-author">👤 {item.author}</span>
									<span class="meta-dot">•</span>
									<span class="meta-date">{formatDate(item.created_at)}</span>
								</div>

								<h2 class="card-title">
									<a href="/content/{item.slug}">{item.title}</a>
								</h2>

								<p class="card-summary">{item.summary}</p>

								{#if item.category === 'acara' && item.event_date}
									<div class="event-banner">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
											<line x1="16" x2="16" y1="2" y2="6"/>
											<line x1="8" x2="8" y1="2" y2="6"/>
											<line x1="3" x2="21" y1="10" y2="10"/>
										</svg>
										<span>Pelaksanaan: <strong>{formatDate(item.event_date)}</strong></span>
									</div>
								{/if}

								<div class="card-footer">
									<a href="/content/{item.slug}" class="read-more-link">
										Baca Selengkapnya
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<line x1="5" x2="19" y1="12" y2="12"/>
											<polyline points="12 5 19 12 12 19"/>
										</svg>
									</a>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	.hero-section {
		padding: 6rem 0 4rem 0;
		text-align: center;
		position: relative;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		min-height: 500px;
		display: flex;
		align-items: center;
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.75) 100%);
		z-index: 1;
	}

	.hero-container {
		position: relative;
		z-index: 2;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 1rem;
		background: rgba(16, 185, 129, 0.12);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: var(--radius-full);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--primary-500);
		margin-bottom: 1.5rem;
	}

	.pulse-dot {
		width: 8px;
		height: 8px;
		background: var(--primary-500);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--primary-500);
	}

	.hero-title {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.15;
		margin-bottom: 1.25rem;
	}

	.gradient-text {
		background: linear-gradient(135deg, #10b981 0%, #60a5fa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.hero-subtitle {
		font-size: 1.125rem;
		color: var(--text-secondary);
		max-width: 680px;
		margin: 0 auto 2.5rem auto;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.25rem;
		max-width: 960px;
		margin: 0 auto;
	}

	.stat-card {
		padding: 1.25rem;
		text-align: center;
		border-radius: var(--radius-md);
	}

	.highlight-stat {
		border-color: rgba(16, 185, 129, 0.3);
		background: rgba(16, 185, 129, 0.08);
	}

	.stat-value {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 800;
		color: #ffffff;
	}

	.stat-label {
		font-size: 0.825rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.filter-section {
		margin: 2.5rem 0 2rem 0;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.85rem 1.25rem;
	}

	.category-tabs {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
	}

	.tab-btn {
		padding: 0.5rem 1rem;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.tab-btn:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.05);
	}

	.tab-btn.active {
		background: var(--primary-600);
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 260px;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		color: var(--text-muted);
	}

	.search-input {
		padding-left: 2.35rem;
		padding-right: 2rem;
		height: 40px;
		font-size: 0.875rem;
	}

	.clear-btn {
		position: absolute;
		right: 10px;
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 1.75rem;
	}

	.content-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: transform 0.25s ease, box-shadow 0.25s ease;
	}

	.content-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-xl);
		border-color: rgba(255, 255, 255, 0.18);
	}

	.card-image-wrapper {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.3);
	}

	.card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.content-card:hover .card-image {
		transform: scale(1.05);
	}

	.card-badges {
		position: absolute;
		top: 12px;
		left: 12px;
		right: 12px;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.card-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
		margin-bottom: 0.65rem;
	}

	.card-title {
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1.35;
		margin-bottom: 0.65rem;
	}

	.card-title a:hover {
		color: var(--primary-500);
	}

	.card-summary {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 1.25rem;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.event-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.85rem;
		background: rgba(168, 85, 247, 0.1);
		border-left: 3px solid #c084fc;
		border-radius: var(--radius-sm);
		font-size: 0.825rem;
		color: #e9d5ff;
		margin-bottom: 1rem;
	}

	.card-footer {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.read-more-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary-500);
		transition: gap 0.2s ease;
	}

	.read-more-link:hover {
		gap: 0.6rem;
		color: var(--primary-200);
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.2rem;
		}
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}
		.search-input-wrapper {
			width: 100%;
		}
	}
</style>
