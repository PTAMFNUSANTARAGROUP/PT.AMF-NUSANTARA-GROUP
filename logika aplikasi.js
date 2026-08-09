// === KONFIGURASI LOGIN ===
const pengguna = { username: 'admin', password: 'admin123', nama: 'Administrator' };

// Cek status login saat membuka halaman
function cekLogin() {
    const sudahLogin = localStorage.getItem('amf_login');
    if (!sudahLogin || sudahLogin !== 'ok') {
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Jalankan cek login di semua halaman
if (!window.location.pathname.includes('index.html')) cekLogin();

// === FUNGSI LOGIN ===
const formLogin = document.getElementById('loginForm');
if (formLogin) {
    formLogin.addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value;
        const kotakPesan = document.getElementById('alertBox');

        if (u === pengguna.username && p === pengguna.password) {
            localStorage.setItem('amf_login', 'ok');
            window.location.href = 'dashboard.html';
        } else {
            kotakPesan.textContent = '❌ Username atau Password salah!';
        }
    });
}

// === FUNGSI LOGOUT ===
const tombolKeluar = document.getElementById('btnLogout');
if (tombolKeluar) {
    tombolKeluar.addEventListener('click', () => {
        localStorage.removeItem('amf_login');
        window.location.href = 'index.html';
    });
}

// === PENYIMPANAN DATA ===
function ambilTransaksi() {
    return JSON.parse(localStorage.getItem('amf_transaksi') || '[]');
}
function simpanTransaksi(data) {
    localStorage.setItem('amf_transaksi', JSON.stringify(data));
}

// === FORMAT UANG ===
function formatRupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

// === DASHBOARD ===
if (document.getElementById('totalMasuk')) {
    function muatDashboard() {
        const daftar = ambilTransaksi();
        let totalM = 0, totalK = 0;
        daftar.forEach(t => {
            if (t.jenis === 'masuk') totalM += t.jumlah;
            else totalK += t.jumlah;
        });
        document.getElementById('totalMasuk').textContent = formatRupiah(totalM);
        document.getElementById('totalKeluar').textContent = formatRupiah(totalK);
        document.getElementById('saldo').textContent = formatRupiah(totalM - totalK);

        // Tampilkan 5 transaksi terbaru
        const terbaru = daftar.slice(-5).reverse();
        const baris = terbaru.map(t => `
            <tr class="${t.jenis}">
                <td>${t.tanggal}</td>
                <td>${t.keterangan}</td>
                <td>${t.jenis==='masuk'?'Pemasukan':'Pengeluaran'}</td>
                <td>${formatRupiah(t.jumlah)}</td>
            </tr>
        `).join('');
        document.getElementById('daftarTransaksi').innerHTML = baris || '<tr><td colspan="4" style="text-align:center;color:#888">Belum ada transaksi</td></tr>';
    }
    muatDashboard();
}

// === HALAMAN TRANSAKSI ===
const formTransaksi = document.getElementById('formTransaksi');
if (formTransaksi) {
    document.getElementById('tgl').valueAsDate = new Date();

    function tampilTabel() {
        const daftar = ambilTransaksi().reverse();
        const baris = daftar.map((t, i) => `
            <tr class="${t.jenis}">
                <td>${i+1}</td>
                <td>${t.tanggal}</td>
                <td>${t.keterangan}</td>
                <td>${t.jenis==='masuk'?'Pemasukan':'Pengeluaran'}</td>
                <td>${formatRupiah(t.jumlah)}</td>
                <td><button class="btn-hapus" data-id="${daftar.length-1-i}">Hapus</button></td>
            </tr>
        `).join('');
        document.getElementById('tabelTransaksi').innerHTML = baris || '<tr><td colspan="6" style="text-align:center;color:#888">Belum ada transaksi</td></tr>';

        // Hapus transaksi
        document.querySelectorAll('.btn-hapus').forEach(btn => {
            btn.addEventListener('click', () => {
                let data = ambilTransaksi();
                data.splice(parseInt(btn.dataset.id), 1);
                simpanTransaksi(data);
                tampilTabel();
                alert('Transaksi dihapus!');
            });
        });
    }
    tampilTabel();

    formTransaksi.addEventListener('submit', e => {
        e.preventDefault();
        const data = ambilTransaksi();
        data.push({
            tanggal: document.getElementById('tgl').value,
            jenis: document.getElementById('jenis').value,
            keterangan: document.getElementById('keterangan').value.trim(),
            jumlah: parseFloat(document.getElementById('jumlah').value)
        });
        simpanTransaksi(data);
        formTransaksi.reset();
        document.getElementById('tgl').valueAsDate = new Date();
        tampilTabel();
        alert('✅ Transaksi disimpan!');
    });
}

// === HALAMAN LAPORAN ===
function buatLaporan() {
    const tglAwal = document.getElementById('tglAwal').value;
    const tglAkhir = document.getElementById('tglAkhir').value;
    if (!tglAwal || !tglAkhir) return alert('Pilih rentang tanggal!');

    let daftar = ambilTransaksi().filter(t => t.tanggal >= tglAwal && t.tanggal <= tglAkhir);
    daftar.sort((a,b) => a.tanggal.localeCompare(b.tanggal));

    let totalM = 0, totalK = 0;
    let baris = daftar.map(t => {
        if (t.jenis==='masuk') totalM += t.jumlah; else totalK += t.jumlah;
        return `<tr>
            <td>${t.tanggal}</td>
            <td>${t.keterangan}</td>
            <td>${t.jenis==='masuk'?formatRupiah(t.jumlah):'-'}</td>
            <td>${t.jenis==='keluar'?formatRupiah(t.jumlah):'-'}</td>
        </tr>`;
    }).join('');

    document.getElementById('hasilLaporan').style.display = 'block';
    document.getElementById('periodeLaporan').textContent = `Periode: ${tglAwal} s/d ${tglAkhir}`;
    document.getElementById('isiLaporan').innerHTML = baris || '<tr><td colspan="4" style="text-align:center;color:#888">Tidak ada data pada periode ini</td></tr>';
    document.getElementById('lapTotalMasuk').textContent = formatRupiah(totalM);
    document.getElementById('lapTotalKeluar').textContent = formatRupiah(totalK);
    document.getElementById('lapSaldo').textContent = formatRupiah(totalM - totalK);
}
window.buatLaporan = buatLaporan;

function cetakLaporan() {
    if (document.getElementById('hasilLaporan').style.display !== 'block') {
        alert('Buat laporan terlebih dahulu!'); return;
    }
    window.print();
}
window.cetakLaporan = cetakLaporan;