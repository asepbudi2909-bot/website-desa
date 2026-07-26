<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterCategory = $state('all');
	let deleteConfirmId = $state<number | null>(null);

	const filteredContents = $derived(
		filterCategory === 'all'
			? data.contents
			: data.contents.filter((i) => i.category === filterCategory)
	);

	const stats = $derived({
		total: data.contents.length,
		berita: data.contents.filter((i) => i.category === 'berita').length,
		acara: data.contents.filter((i) => i.category === 'acara').length,
		pengumuman: data.contents.filter((i) => i.category === 'pengumuman').length,
		r2Count: data.contents.filter((i) => i.image_type === 'r2').length
	});

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateStr));
	}
</script>

<svelte:head>
	<title>CMS Dashboard Admin - Website Desa Sukamaju</title>
</svelte:head>

<div class="admin-dashboard container animate-fade-in">
	<!-- Admin Header -->
	<header class="admin-header">
		<div>
			<div class="cms-badge">⚙️ Panel Administrasi Konten</div>
			<h1 class="admin-title">Manajemen Konten Desa</h1>
			<p class="admin-subtitle">Kelola Berita, Acara, dan Pengumuman publik desa secara terpusat.</p>
		</div>

		<a href="/admin/create" class="btn btn-primary btn-create">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="12" x2="12" y1="5" y2="19"/>
				<line x1="5" x2="19" y1="12" y2="12"/>
			</svg>
			Tambah Konten Baru
		</a>
	</header>

	{#if form?.message}
		<div class="alert {form.success ? 'alert-success' : 'alert-danger'} glass-panel">
			{form.message}
		</div>
	{/if}

	<!-- Quick Metrics -->
	<div class="metrics-grid">
		<div class="metric-card glass-panel">
			<span class="metric-label">Total Publikasi</span>
			<span class="metric-num">{stats.total}</span>
		</div>
		<div class="metric-card glass-panel">
			<span class="metric-label">📰 Berita</span>
			<span class="metric-num text-blue">{stats.berita}</span>
		</div>
		<div class="metric-card glass-panel">
			<span class="metric-label">📅 Acara</span>
			<span class="metric-num text-purple">{stats.acara}</span>
		</div>
		<div class="metric-card glass-panel">
			<span class="metric-label">📢 Pengumuman</span>
			<span class="metric-num text-amber">{stats.pengumuman}</span>
		</div>
		<div class="metric-card glass-panel">
			<span class="metric-label">☁️ Gambar Tersimpan</span>
			<span class="metric-num text-emerald">{stats.r2Count}</span>
		</div>
	</div>

	<!-- Content Management Table Section -->
	<div class="table-container glass-panel">
		<div class="table-header">
			<h2>Daftar Konten ({filteredContents.length})</h2>

			<!-- Filter Tabs -->
			<div class="filter-pills">
				<button class="pill-btn {filterCategory === 'all' ? 'active' : ''}" onclick={() => filterCategory = 'all'}>
					Semua
				</button>
				<button class="pill-btn {filterCategory === 'berita' ? 'active' : ''}" onclick={() => filterCategory = 'berita'}>
					Berita
				</button>
				<button class="pill-btn {filterCategory === 'acara' ? 'active' : ''}" onclick={() => filterCategory = 'acara'}>
					Acara
				</button>
				<button class="pill-btn {filterCategory === 'pengumuman' ? 'active' : ''}" onclick={() => filterCategory = 'pengumuman'}>
					Pengumuman
				</button>
			</div>
		</div>

		{#if filteredContents.length === 0}
			<div class="empty-table">
				<p>Belum ada data untuk kategori ini.</p>
			</div>
		{:else}
			<div class="responsive-table-wrapper">
				<table class="cms-table">
					<thead>
						<tr>
							<th>Gambar & Judul</th>
							<th>Kategori</th>
							<th>Opsi Gambar</th>
							<th>Penulis</th>
							<th>Tanggal Dibuat</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredContents as item (item.id)}
							<tr>
								<td>
									<div class="item-title-col">
										<img src={item.image_url} alt="" class="table-thumb" />
										<div>
											<a href="/content/{item.slug}" target="_blank" class="table-title-link">
												{item.title}
											</a>
											<div class="table-slug">/{item.slug}</div>
										</div>
									</div>
								</td>
								<td>
									<span class="badge badge-{item.category}">
										{item.category.toUpperCase()}
									</span>
								</td>
								<td>
									<span class="badge badge-{item.image_type}">
										{item.image_type === 'r2' ? '☁️ Server' : '🌐 Tautan Eksternal'}
									</span>
								</td>
								<td class="text-secondary">{item.author}</td>
								<td class="text-muted">{formatDate(item.created_at)}</td>
								<td class="text-right">
									<div class="action-buttons">
										<a href="/content/{item.slug}" class="action-btn view-btn" title="Lihat Publikasi" target="_blank">
											👁️
										</a>
										<a href="/admin/edit/{item.id}" class="action-btn edit-btn" title="Edit Konten">
											✏️ Edit
										</a>
										<form method="POST" action="?/delete" use:enhance class="inline-form">
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="action-btn delete-btn"
												title="Hapus Konten"
												onclick={(e) => {
													if (!confirm(`Apakah Anda yakin ingin menghapus "${item.title}"?`)) {
														e.preventDefault();
													}
												}}
											>
												🗑️ Hapus
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-dashboard {
		padding: 2.5rem 1.5rem 4rem 1.5rem;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.cms-badge {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--primary-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.admin-title {
		font-size: 2.25rem;
		font-weight: 800;
	}

	.admin-subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
	}

	.alert {
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 500;
	}

	.alert-success {
		background: rgba(16, 185, 129, 0.15);
		color: #34d399;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.alert-danger {
		background: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.metric-card {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.metric-label {
		font-size: 0.8rem;
		color: var(--text-secondary);
		font-weight: 600;
	}

	.metric-num {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 800;
	}

	.text-blue { color: #60a5fa; }
	.text-purple { color: #c084fc; }
	.text-amber { color: #fbbf24; }
	.text-emerald { color: #34d399; }

	.table-container {
		padding: 1.5rem;
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.table-header h2 {
		font-size: 1.25rem;
	}

	.filter-pills {
		display: flex;
		gap: 0.35rem;
		background: rgba(15, 23, 42, 0.6);
		padding: 0.25rem;
		border-radius: var(--radius-md);
	}

	.pill-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		padding: 0.35rem 0.85rem;
		font-size: 0.825rem;
		font-weight: 600;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill-btn.active {
		background: var(--bg-card-dark);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	}

	.responsive-table-wrapper {
		overflow-x: auto;
	}

	.cms-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 0.9rem;
	}

	.cms-table th {
		padding: 0.85rem 1rem;
		color: var(--text-muted);
		font-weight: 600;
		font-size: 0.775rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.cms-table td {
		padding: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		vertical-align: middle;
	}

	.item-title-col {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.table-thumb {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-sm);
		object-fit: cover;
		background: rgba(0,0,0,0.3);
	}

	.table-title-link {
		font-weight: 600;
		color: #ffffff;
	}

	.table-title-link:hover {
		color: var(--primary-500);
	}

	.table-slug {
		font-size: 0.775rem;
		color: var(--text-muted);
	}

	.text-right {
		text-align: right;
	}

	.text-secondary {
		color: var(--text-secondary);
	}

	.text-muted {
		color: var(--text-muted);
		font-size: 0.825rem;
	}

	.action-buttons {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.inline-form {
		display: inline;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.65rem;
		font-size: 0.8rem;
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.15s ease;
	}

	.view-btn {
		background: rgba(255, 255, 255, 0.06);
		color: var(--text-primary);
	}

	.edit-btn {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		border-color: rgba(59, 130, 246, 0.3);
	}

	.edit-btn:hover {
		background: rgba(59, 130, 246, 0.25);
		color: #ffffff;
	}

	.delete-btn {
		background: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
		border-color: rgba(239, 68, 68, 0.3);
	}

	.delete-btn:hover {
		background: rgba(239, 68, 68, 0.25);
		color: #ffffff;
	}

	.empty-table {
		padding: 3rem;
		text-align: center;
		color: var(--text-muted);
	}
</style>
