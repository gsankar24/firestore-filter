import { getApp, getApps, initializeApp } from "firebase/app";
import 'firebase/database';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: 'AIzaSyC3QR9E_ynh8i_qunFs8LjPy70O1m43hzI',
  authDomain: 'rufous-workflow.firebaseapp.com',
  projectId: 'rufous-workflow',
  storageBucket: 'rufous-workflow.appspot.com',
  messagingSenderId: '124158097549',
  appId: '1:124158097549:web:780cd93f6acd3d7efb4ac4',
  measurementId: 'G-EMPT8EYBN1',
};

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { auth, firestore };
