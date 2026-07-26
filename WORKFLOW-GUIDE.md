# Workflow Guide — General AI CLI Collaboration

## Aturan Utama
**JANGAN edit langsung di `main`.** Selalu buat branch baru untuk setiap perubahan, lalu buat Pull Request.

---

## Alur Lengkap (Branch → PR → Merge → Cleanup)

### 1. Buat Branch Baru
```bash
git checkout main
git pull origin main
git checkout -b <nama-branch>
```

**Format nama branch:**
| Tipe | Format | Contoh |
|------|---------|--------|
| Fitur baru | `feat/...` | `feat/d1-database` |
| Perbaikan bug | `fix/...` | `fix/login-error` |
| Dokumentasi | `docs/...` | `docs/workflow-guide` |
| Refactor | `refactor/...` | `refactor/auth-module` |
| Chore/maintenance | `chore/...` | `chore/update-deps` |

### 2. Kerjakan Perubahan
Edit file, tambah code, fix bug, dll. Bisa minta AI CLI bantu implement.

### 3. Commit
```bash
git add .
git commit -m "Deskripsi perubahan yang jelas"
```

### 4. Push ke GitHub
```bash
git push -u origin <nama-branch>
```

### 5. Buat Pull Request
```bash
gh pr create --title "Judul PR" --body "Deskripsi detail perubahan"
```

Jika command `gh` tidak berada di repo directory:
```bash
gh pr create --repo <owner>/<repo> --head <nama-branch> --base main --title "Judul PR" --body "Deskripsi"
```

### 6. Merge di GitHub
- Review PR di browser
- Click **Merge** jika sudah OK

### 7. Cleanup (setelah merge di server)
```bash
git checkout main
git pull origin main
git branch -d <nama-branch>
git push origin --delete <nama-branch>   # opsional, hapus remote branch
```

---

## Checklist Cepat

| Step | Command | Done? |
|------|---------|-------|
| 1. Branch baru | `git checkout -b <type>/xxx` | ⬜ |
| 2. Kerja perubahan | Edit file | ⬜ |
| 3. Commit | `git add . && git commit -m "..."` | ⬜ |
| 4. Push | `git push -u origin <type>/xxx` | ⬜ |
| 5. PR | `gh pr create --title "..." --body "..."` | ⬜ |
| 6. Merge | Di GitHub browser | ⬜ |
| 7. Cleanup | `git checkout main && git pull && git branch -d <type>/xxx` | ⬜ |

---

## User Info

| Item | Detail |
|------|--------|
| GitHub CLI | `gh` v2.87.3 |
| Account active | `bagusjimi` |
| Account lain | `sobatcecep`, `asepbudi2909-bot` |
| Git user | Julung / bagusa63@gmail.com |
| OS | Windows |

---

## Tips untuk AI CLI Agent

- Selalu mulai dari `main` yang up-to-date (`git pull origin main`)
- Satu branch = satu task, jangan campur banyak perubahan
- Commit message harus jelas dan deskriptif
- PR description harus lengkap supaya review mudah
- Setelah user merge di server, lakukan cleanup: pull main + delete branch lokal
- Jangan push tanpa buat PR — user harus review dulu
- Jangan force push ke branch yang sudah ada PR
