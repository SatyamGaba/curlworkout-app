import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  DocumentData
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvfegae5T2vV1L3FJOlHkV6LJYWt9WZ6A",
  authDomain: "curl-mvp.firebaseapp.com",
  projectId: "curl-mvp",
  storageBucket: "curl-mvp.firebasestorage.app",
  messagingSenderId: "1085577628590",
  appId: "1:1085577628590:web:c8a41a11a645187d73163f",
  measurementId: "G-W2DDXCVPKQ"
};

let app: FirebaseApp;
let db: Firestore;

async function initFirebase() {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

async function runTest() {
  try {
    await initFirebase();

    const testRef = doc(db, "testCollection", "testDoc");
    const payload: DocumentData = {
      hello: "world",
      ts: new Date().toISOString()
    };

    await setDoc(testRef, payload);

    const snap = await getDoc(testRef);

    if (!snap.exists()) {
      console.error("❌ Document not found after write.");
      process.exit(1);
    }

    console.log("✅ Firebase Firestore working. Document data:", snap.data());
    process.exit(0);
  } catch (err) {
    console.error("❌ Firebase test failed:", err);
    process.exit(1);
  }
}

runTest();
