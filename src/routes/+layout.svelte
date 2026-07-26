<script lang="ts">
	import '../app.css';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<svelte:head>
	<title>Website Resmi Desa Sukamaju - Cloud Native CMS</title>
	<meta name="description" content="Portal Berita, Acara, dan Pengumuman Resmi Desa Sukamaju berbasis Cloudflare Pages, D1 Database, dan R2 Bucket Storage." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="app-shell">
	<!-- Top Bar / Navigation Header -->
	<header class="glass-nav sticky-nav">
		<div class="container nav-container">
			<a href="/" class="brand">
				<div class="brand-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
						<polyline points="9 22 9 12 15 12 15 22"/>
					</svg>
				</div>
				<div class="brand-text">
					<span class="brand-title">DESA SUKAMAJU</span>
					<span class="brand-subtitle">Cloudflare Pages & D1 Engine</span>
				</div>
			</a>

			<nav class="desktop-nav">
				<a href="/" class="nav-link">Beranda</a>
				<a href="/?category=berita" class="nav-link">Berita</a>
				<a href="/?category=acara" class="nav-link">Acara</a>
				<a href="/?category=pengumuman" class="nav-link">Pengumuman</a>
				<a href="/admin" class="btn btn-primary btn-sm admin-btn">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect width="18" height="18" x="3" y="3" rx="2"/>
						<path d="M7 7h10"/>
						<path d="M7 12h10"/>
						<path d="M7 17h10"/>
					</svg>
					CMS Admin
				</a>
			</nav>

			<button class="mobile-toggle" onclick={toggleMobileMenu} aria-label="Toggle Navigation">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="4" x2="20" y1="12" y2="12"/>
					<line x1="4" x2="20" y1="6" y2="6"/>
					<line x1="4" x2="20" y1="18" y2="18"/>
				</svg>
			</button>
		</div>

		{#if isMobileMenuOpen}
			<div class="mobile-dropdown glass-panel">
				<a href="/" onclick={() => isMobileMenuOpen = false}>Beranda</a>
				<a href="/?category=berita" onclick={() => isMobileMenuOpen = false}>Berita</a>
				<a href="/?category=acara" onclick={() => isMobileMenuOpen = false}>Acara</a>
				<a href="/?category=pengumuman" onclick={() => isMobileMenuOpen = false}>Pengumuman</a>
				<a href="/admin" onclick={() => isMobileMenuOpen = false} class="mobile-admin-link">CMS Dashboard Admin</a>
			</div>
		{/if}
	</header>

	<!-- Main Page Body -->
	<main class="main-content">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="footer">
		<div class="container footer-content">
			<div class="footer-info">
				<h3>Pemerintah Desa Sukamaju</h3>
				<p>Portal Resmi Publikasi & Informasi Publik Desa</p>
				<div class="cloud-stack-badge">
					<span>Powered by Cloudflare Pages</span>
					<span class="dot">•</span>
					<span>D1 Edge SQLite</span>
					<span class="dot">•</span>
					<span>R2 Object Storage</span>
				</div>
			</div>
			<div class="footer-links">
				<a href="/">Beranda</a>
				<a href="/admin">Kelola CMS</a>
				<a href="https://developers.cloudflare.com/pages/" target="_blank" rel="noreferrer">Cloudflare Docs</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2026 Desa Sukamaju. SvelteKit Cloud-Native Architecture.</p>
		</div>
	</footer>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.sticky-nav {
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
	}

	.brand-icon {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-title {
		font-family: var(--font-heading);
		font-weight: 800;
		font-size: 1.1rem;
		letter-spacing: -0.01em;
		color: #ffffff;
	}

	.brand-subtitle {
		font-size: 0.725rem;
		color: var(--primary-500);
		font-weight: 600;
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	.nav-link {
		font-weight: 500;
		font-size: 0.925rem;
		color: var(--text-secondary);
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: #ffffff;
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
	}

	.mobile-dropdown {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		margin: 0.5rem 1.5rem 1rem 1.5rem;
		gap: 0.75rem;
	}

	.mobile-dropdown a {
		padding: 0.5rem;
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
	}

	.mobile-dropdown a:hover {
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
	}

	.mobile-admin-link {
		color: var(--primary-500) !important;
		font-weight: 700;
	}

	.main-content {
		flex: 1;
	}

	.footer {
		background: rgba(15, 23, 42, 0.95);
		border-top: 1px solid var(--border-dark);
		padding: 3rem 0 1.5rem 0;
		margin-top: 4rem;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.footer-info h3 {
		font-size: 1.2rem;
		margin-bottom: 0.35rem;
	}

	.footer-info p {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.cloud-stack-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.85rem;
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.2);
		padding: 0.35rem 0.85rem;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		color: var(--primary-500);
		font-weight: 600;
	}

	.dot {
		color: var(--text-muted);
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.footer-links a:hover {
		color: var(--primary-500);
	}

	.footer-bottom {
		text-align: center;
		padding-top: 1.5rem;
		font-size: 0.825rem;
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}
		.mobile-toggle {
			display: block;
		}
	}
</style>
