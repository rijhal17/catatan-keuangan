import { loginGoogle, logoutUser, onUserChanged } from "./firebase-auth.js";
import { saveTransaksi, listenTransaksi, hapusTransaksi } from "./firebase-db.js";

let user = null;
let data = [];

const inputJumlah = document.getElementById("jumlah");

// FORMAT INPUT RP
inputJumlah.addEventListener("input", function () {
  let angka = this.value.replace(/[^0-9]/g, "");
  if (angka === "") {
    this.value = "";
    return;
  }
  this.value = "Rp " + angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  this.setSelectionRange(this.value.length, this.value.length);
});

// FORMAT RUPIAH TAMPILAN
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// LOGIN GOOGLE BUTTON
window.loginGoogle = function () {
  loginGoogle();
};

// LOGOUT
window.logoutUser = function () {
  logoutUser();
};

// TAMBAH TRANSAKSI
window.tambah = function () {
  if (!user) {
    alert("Silakan login dulu");
    return;
  }

  let tanggal = document.getElementById("tanggal").value;
  let kategori = document.getElementById("kategori").value;
  let tipe = document.getElementById("tipe").value;
  let jumlahRaw = document.getElementById("jumlah").value.replace(/[^0-9]/g, "");
  let jumlah = parseInt(jumlahRaw);

  if (!tanggal || !kategori || !jumlah) {
    alert("Semua data harus diisi!");
    return;
  }

  saveTransaksi(user.uid, {
    tanggal,
    kategori,
    tipe,
    jumlah
  });

  document.getElementById("jumlah").value = "";
  document.getElementById("kategori").value = "";
};

// HAPUS
window.hapus = function (id) {
  if (confirm("Hapus transaksi?")) {
    hapusTransaksi(id);
  }
};

// TAMPIL TABEL
function tampilkanData() {
  let tbody = document.querySelector("#tabelTransaksi tbody");
  tbody.innerHTML = "";

  data.forEach((t) => {
    tbody.innerHTML += `
      <tr>
        <td>${t.tanggal}</td>
        <td>${t.kategori}</td>
        <td>${t.tipe}</td>
        <td>${formatRupiah(t.jumlah)}</td>
        <td><span class="hapus-btn" onclick="hapus('${t.id}')">Hapus</span></td>
      </tr>
    `;
  });
}

// HITUNG SALDO
function hitungSaldo() {
  let saldo = 0;
  data.forEach((t) => {
    if (t.tipe === "masuk") saldo += t.jumlah;
    else saldo -= t.jumlah;
  });
  document.getElementById("totalSaldo").innerText = formatRupiah(saldo);
}

// LISTEN USER LOGIN
onUserChanged((u) => {
  if (u) {
    user = u;

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("appBox").style.display = "block";

    listenTransaksi(user.uid, (hasil) => {
      data = hasil;
      tampilkanData();
      hitungSaldo();
    });
  } else {
    user = null;

    document.getElementById("loginBox").style.display = "block";
    const appBoxEl = document.getElementById("appBox");
if(appBoxEl) appBoxEl.style.display = "none";
  }
});
