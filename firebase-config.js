// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Ganti objek firebaseConfig di bawah ini dengan konfigurasi dari Firebase Console Anda!
const firebaseConfig = {
  apiKey: "AIzaSyDcS41ljxtex8CngQf4IW5pvPKNCXtiGHI",
  authDomain: "playwithme-9d9e7.firebaseapp.com",
  projectId: "playwithme-9d9e7",
  storageBucket: "playwithme-9d9e7.firebasestorage.app",
  messagingSenderId: "956638992463",
  appId: "1:956638992463:web:4e03392c69e36bfcd2f23a"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan kita gunakan
export const auth = getAuth(app);
export const db = getFirestore(app);