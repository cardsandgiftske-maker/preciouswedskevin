import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

async function saveRSVP(data) {
  await addDoc(collection(db, "rsvps"), data);
}
import { collection, getDocs } from "firebase/firestore";

async function loadRSVPs() {
  const snapshot = await getDocs(collection(db, "rsvps"));

  const rsvps = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(rsvps);
}
import { onSnapshot, collection } from "firebase/firestore";

onSnapshot(collection(db, "rsvps"), (snapshot) => {
  const rsvps = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(rsvps);
});
