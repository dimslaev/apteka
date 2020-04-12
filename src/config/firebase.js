import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import "firebase/storage";
// import "firebase/messaging";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "aptk-bg.firebaseapp.com",
  databaseURL: "https://aptk-bg.firebaseio.com",
  projectId: "aptk-bg",
  storageBucket: "aptk-bg.appspot.com",
  messagingSenderId: "902619666706",
  appId: "1:902619666706:web:3668e59f43804e4b39bbcb",
  measurementId: "G-73W4M74CRQ",
};
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({});

//Auth providers
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
