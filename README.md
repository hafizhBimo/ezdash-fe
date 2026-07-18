# EZDASH - Frontend Application

Aplikasi Client-Side Single Page Application (SPA) untuk **EZDASH** (Stock & Consignment Monitoring Dashboard). Dibangun dengan menggunakan **React 19**, **Vite 8**, **Ant Design 5**, dan **Apache ECharts** untuk visualisasi data interaktif.

---

## 🚀 Fitur Utama

- **Protected Routing**: Halaman utama dilindungi dengan JWT auth token (auto-logout jika sesi kedaluwarsa atau token tidak valid).
- **Drag-and-Drop Uploader**: Form pengunggahan snapshot Excel harian khusus untuk Administrator dengan logger respons langsung dari server.
- **KPI Summary Cards**: Menampilkan total SKU, Stock on Hand (SOH), Consignment on Hand (COH), Nilai Inventaris, dan Rata-rata Hari Stok.
- **Grafik Interaktif ECharts**: 
  - Distribusi Tipe Stok (SOH vs COH)
  - Jumlah SKU per Kelas (A, B, C, Non-Class)
  - Tren Nilai Stok Historis (15 hari terakhir)
  - Top 10 SKU Berdasarkan Penggunaan (Usage)
  - Distribusi Coverage Days
  - Jumlah Konsinyasi per Vendor
- **Tabel Monitoring Interaktif**: Filter data komprehensif berdasarkan tipe stok, kelas barang, gudang, dan vendor, lengkap dengan fitur pencarian teks instan, pengurutan kolom, dan paginasi server-side.

---

## 🛠️ Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terinstall:
- **Node.js** (v18.x atau v20.x LTS)
- **npm** atau **yarn**

---

## ⚙️ Cara Instalasi & Setup

### 1. Install Dependencies
Masuk ke folder `frontend` dan install seluruh dependency:
```bash
cd frontend
npm install
```

### 2. Konfigurasi Environment Variables (`.env`)
Untuk menyambungkan frontend dengan backend API, buat file `.env` di folder `frontend/` dan tentukan baseURL API:
```env
VITE_API_URL=http://localhost:5001/api
```

*(Catatan: Sesuaikan URL di atas dengan domain produksi jika Anda melakukan deployment ke server, contoh: `VITE_API_URL=https://domain-anda.com/api`)*

---

## 🖥️ Menjalankan Aplikasi

### Jalankan Development Server
```bash
npm run dev
# Aplikasi frontend akan berjalan di http://localhost:5173
```

### Build Produksi
Jika ingin memaketkan aplikasi untuk kebutuhan deploy di server Nginx/Apache:
```bash
npm run build
```
Hasil kompilasi akan berada di dalam folder `/dist`.

### Preview Build Produksi Secara Lokal
```bash
npm run preview
```

---

## 📁 Struktur Folder Frontend

```
frontend/
├── public/             # Static assets (logo, favicon, dll)
├── src/
│   ├── assets/         # CSS & asset file pendukung
│   ├── components/     # Komponen global (MainLayout, PrivateRoute)
│   ├── context/        # Global State Context (AuthContext)
│   ├── pages/          # Halaman Dashboard, LoginPage, MonitoringPage, dll.
│   ├── services/       # Konfigurasi Axios Client (api.js) untuk request ke backend
│   ├── App.jsx         # Routing utama & inisiasi aplikasi
│   ├── App.css         # Styling global aplikasi
│   ├── index.css       # Tailwind/Base stylesheet styling
│   └── main.jsx        # Entry point utama React
├── eslint.config.js    # Konfigurasi ESLint linter
└── vite.config.js      # Konfigurasi bundler Vite
```

---

## 💻 Tech Stack Detail

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **UI Library**: [Ant Design 5](https://ant.design/)
- **Data Visualization**: [Apache ECharts](https://echarts.apache.org/) & [echarts-for-react](https://github.com/hustcc/echarts-for-react)
- **HTTP Client**: [Axios](https://axios-http.com/)
