// === FITUR TAMBAH PROYEK PETA ===

// Tampilkan form tambah proyek
function tampilkanFormProyek() {
    document.getElementById('formProyekPeta').classList.remove('hidden');
}

// Sembunyikan form & kosongkan isian
function sembunyikanFormProyek() {
    document.getElementById('formProyekPeta').classList.add('hidden');
    document.getElementById('inpIdProyek').value = '';
    document.getElementById('inpNamaProyek').value = '';
    document.getElementById('inpLokasiProyek').value = '';
    document.getElementById('inpTanggalProyek').value = '';
    document.getElementById('inpStatusProyek').value = 'Direncanakan';
}

// Simpan data proyek ke tabel
function simpanProyekPeta() {
    // Ambil nilai dari form
    const id = document.getElementById('inpIdProyek').value.trim();
    const nama = document.getElementById('inpNamaProyek').value.trim();
    const lokasi = document.getElementById('inpLokasiProyek').value.trim();
    let tanggal = document.getElementById('inpTanggalProyek').value;
    const status = document.getElementById('inpStatusProyek').value;

    // Validasi isian
    if (!id || !nama || !lokasi || !tanggal) {
        alert('Harap lengkapi semua data proyek!');
        return;
    }

    // Ubah format tanggal dari YYYY-MM-DD ke DD/MM/YYYY
    tanggal = tanggal.split('-').reverse().join('/');

    // Tentukan warna status
    let warnaStatus = 'bg-yellow-100 text-yellow-800';
    if (status === 'Selesai') warnaStatus = 'bg-green-100 text-green-800';
    if (status === 'Direncanakan') warnaStatus = 'bg-blue-100 text-blue-800';

    // Buat baris baru untuk tabel
    const tabel = document.querySelector('#tabelProyekPeta tbody');
    const barisBaru = document.createElement('tr');
    barisBaru.innerHTML = `
        <td class="px-4 py-2 border-b">${id}</td>
        <td class="px-4 py-2 border-b">${nama}</td>
        <td class="px-4 py-2 border-b">${lokasi}</td>
        <td class="px-4 py-2 border-b">${tanggal}</td>
        <td class="px-4 py-2 border-b"><span class="px-2 ${warnaStatus} rounded text-xs">${status}</span></td>
        <td class="px-4 py-2 border-b">
            <button class="text-blue-500 mr-2"><i class="fa fa-pencil"></i></button>
            <button class="text-red-500"><i class="fa fa-trash"></i></button>
        </td>
    `;

    // Tambahkan ke bagian atas tabel
    tabel.insertBefore(barisBaru, tabel.firstChild);

    // Sembunyikan & kosongkan form
    sembunyikanFormProyek();
    alert('✅ Proyek berhasil ditambahkan!');
}