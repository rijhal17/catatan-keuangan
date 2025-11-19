import { app } from "./firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// LOGIN GOOGLE
export function loginGoogle() {
  return signInWithPopup(auth, provider);
}

// LOGOUT
export function logoutUser() {
  return signOut(auth);
}

// CEK STATUS USER LOGIN
export function onUserChanged(callback) {
  return onAuthStateChanged(auth, callback);
}
