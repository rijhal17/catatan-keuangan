import { app } from "./firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const db = getFirestore(app);

// SIMPAN TRANSAKSI
export function saveTransaksi(uid, transaksi) {
  return addDoc(collection(db, "transaksi"), {
    uid: uid,
    tanggal: transaksi.tanggal,
    kategori: transaksi.kategori,
    tipe: transaksi.tipe,
    jumlah: transaksi.jumlah
  });
}

// AMBIL TRANSAKSI REALTIME
export function listenTransaksi(uid, callback) {
  const q = query(collection(db, "transaksi"), where("uid", "==", uid));

  onSnapshot(q, (snapshot) => {
    let hasil = [];
    snapshot.forEach((d) => {
      hasil.push({ id: d.id, ...d.data() });
    });
    callback(hasil);
  });
}

// HAPUS TRANSAKSI
export function hapusTransaksi(id) {
  return deleteDoc(doc(db, "transaksi", id));
}
