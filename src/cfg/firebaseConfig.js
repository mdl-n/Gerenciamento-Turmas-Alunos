import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDCTK3ooW5tXFIw1HjBm5MP7Nez9yE-Zvg",
  authDomain: "gerenciamentoalunos-turmas.firebaseapp.com",
  projectId: "gerenciamentoalunos-turmas",
  storageBucket: "gerenciamentoalunos-turmas.appspot.com",
  messagingSenderId: "861810815568",
  appId: "1:861810815568:web:1525f4471133fae7809755"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);