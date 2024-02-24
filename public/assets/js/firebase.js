import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkFfSx_mI7Qb8eNGdQWBiuub0ZzoaErHk",
  authDomain: "telussubmit.firebaseapp.com",
  databaseURL: "https://telussubmit-default-rtdb.firebaseio.com",
  projectId: "telussubmit",
  storageBucket: "telussubmit.appspot.com",
  messagingSenderId: "427780361307",
  appId: "1:427780361307:web:d9393fae3d7f138c74c37e",
  measurementId: "G-7ZPB1SXX95",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();

// Save a New Order in Firestore
export const saveOrder = (title, description) =>
  addDoc(collection(db, "orders"), { title, description });

export const onGetOrders = (callback) =>
  onSnapshot(collection(db, "orders"), callback);

// Delete an Order
export const deleteOrder = (id) => deleteDoc(doc(db, "orders", id));

export const getOrder = (id) => getDoc(doc(db, "orders", id));

export const updateOrder = (id, newFields) =>
  updateDoc(doc(db, "orders", id), newFields);

export const getOrders = () => getDocs(collection(db, "orders"));
