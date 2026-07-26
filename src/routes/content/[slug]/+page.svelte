<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d);
	}
</script>

<svelte:head>
	<title>{data.content.title} - Desa Sukamaju</title>
	<meta name="description" content={data.content.summary} />
</svelte:head>

<article class="article-page container animate-fade-in">
	<!-- Top Navigation Back Button -->
	<div class="breadcrumb">
		<a href="/" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="19" x2="5" y1="12" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Kembali ke Beranda
		</a>
	</div>

	<!-- Main Article Header -->
	<header class="article-header glass-panel">
		<div class="header-badges">
			<span class="badge badge-{data.content.category}">
				{data.content.category.toUpperCase()}
			</span>
			<span class="badge badge-{data.content.image_type}">
				{data.content.image_type === 'r2' ? '☁️ Stored in Cloudflare R2' : '🌐 External URL Source'}
			</span>
		</div>

		<h1 class="article-title">{data.content.title}</h1>

		<div class="article-meta">
			<div class="meta-item">
				<span class="meta-icon">👤</span>
				<span>Ditulis oleh <strong>{data.content.author}</strong></span>
			</div>
			<div class="meta-item">
				<span class="meta-icon">📅</span>
				<span>{formatDate(data.content.created_at)}</span>
			</div>
		</div>
	</header>

	<!-- Featured Media Image -->
	<div class="featured-image-box glass-panel">
		<img src={data.content.image_url} alt={data.content.title} class="featured-img" />
		<div class="image-caption">
			<span>Media Storage: <code>{data.content.image_url}</code></span>
		</div>
	</div>

	<!-- Acara Highlight Banner -->
	{#if data.content.category === 'acara' && data.content.event_date}
		<div class="event-details-banner glass-panel">
			<div class="event-icon">📅</div>
			<div class="event-info">
				<h3>Tanggal Agenda Kegiatan:</h3>
				<p>{formatDate(data.content.event_date)}</p>
			</div>
		</div>
	{/if}

	<!-- Article Body -->
	<div class="article-content-body glass-panel">
		<p class="article-summary-lead">{data.content.summary}</p>
		
		<div class="body-paragraphs">
			{#each data.content.body.split('\n\n') as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	<!-- Related Content Grid -->
	{#if data.related.length > 0}
		<section class="related-section">
			<h2 class="section-title">Publikasi Terkait Lainnya</h2>
			<div class="related-grid">
				{#each data.related as item}
					<a href="/content/{item.slug}" class="related-card glass-panel">
						<img src={item.image_url} alt={item.title} class="related-thumb" />
						<div class="related-info">
							<span class="badge badge-{item.category}">{item.category}</span>
							<h4>{item.title}</h4>
							<span class="related-date">{formatDate(item.created_at)}</span>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.article-page {
		padding: 2.5rem 1.5rem 4rem 1.5rem;
		max-width: 920px;
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
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--primary-500);
	}

	.article-header {
		padding: 2.5rem;
		margin-bottom: 2rem;
	}

	.header-badges {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.article-title {
		font-size: 2.35rem;
		line-height: 1.25;
		margin-bottom: 1.5rem;
	}

	.article-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1.75rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding-top: 1.25rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.featured-image-box {
		overflow: hidden;
		margin-bottom: 2rem;
	}

	.featured-img {
		width: 100%;
		max-height: 480px;
		object-fit: cover;
		display: block;
	}

	.image-caption {
		padding: 0.65rem 1.25rem;
		background: rgba(15, 23, 42, 0.9);
		font-size: 0.775rem;
		color: var(--text-muted);
		word-break: break-all;
	}

	.event-details-banner {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem;
		background: rgba(168, 85, 247, 0.12);
		border-left: 4px solid #c084fc;
		margin-bottom: 2rem;
	}

	.event-icon {
		font-size: 2.2rem;
	}

	.event-info h3 {
		font-size: 0.9rem;
		color: #e9d5ff;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.event-info p {
		font-size: 1.25rem;
		font-weight: 700;
		color: #ffffff;
	}

	.article-content-body {
		padding: 2.5rem;
		font-size: 1.05rem;
		line-height: 1.8;
		color: #e2e8f0;
	}

	.article-summary-lead {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--primary-200);
		line-height: 1.6;
		margin-bottom: 1.75rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.body-paragraphs p {
		margin-bottom: 1.25rem;
	}

	.related-section {
		margin-top: 3.5rem;
	}

	.section-title {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.25rem;
	}

	.related-card {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		transition: transform 0.2s ease;
	}

	.related-card:hover {
		transform: translateY(-2px);
	}

	.related-thumb {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.related-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.related-info h4 {
		font-size: 0.95rem;
		line-height: 1.3;
		margin: 0.35rem 0;
	}

	.related-date {
		font-size: 0.775rem;
		color: var(--text-muted);
	}
</style>
