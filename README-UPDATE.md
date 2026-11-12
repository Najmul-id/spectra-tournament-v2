# Update Logika SPECTRA MLBB (Double Elimination & Dual Arena)

Folder ini berisi pembaruan logika inti (Core JavaScript & SQL) untuk sistem SPECTRA.

## File yang Diperbarui:
1. `database/schema.sql`: Tambahan tabel `match_games` untuk skor per game, relasi `winner_to` dan `loser_to` untuk perpindahan otomatis.
2. `js/modules/draw.js`: Implementasi Web Crypto API (`window.crypto.getRandomValues`) untuk undian anti-curang + fungsi lock ke tabel `audit_logs`.
3. `js/modules/bracket-engine.js`: Logika kelulusan (Upper) dan degradasi (Lower) sesuai Juknis. Ada fungsi deteksi Grand Final Reset.
4. `js/modules/match-manager.js`: Logika otomatisasi perpindahan tim ke slot kosong berikutnya secara real-time.
5. `js/modules/score-manager.js`: Menghitung format BO3 dan BO5 per game (Game 1, Game 2, dst).
6. `js/views/admin.js`: Logika untuk Dashboard 2 Arena Paralel beserta rekomendasi pertandingan (Pending -> Ready -> Live).
7. `js/views/live-display.js`: Sistem langganan realtime (Supabase WebSockets) untuk animasi bracket di sisi penonton.

## Cara Pemasangan:
1. Eksekusi `schema.sql` di SQL Editor Supabase untuk memperbarui relasi tabel.
2. Timpa isi file JS lama dengan file di dalam `js/modules/` dan `js/views/` ini.
3. Buka Acode, pastikan variabel Supabase Client sudah terekspor dengan benar di project aslimu.
4. Uji alur dari mulai `Simulasi Undian -> Skor Match 1 Arena 1 -> Pindah ke Upper/Lower`.
