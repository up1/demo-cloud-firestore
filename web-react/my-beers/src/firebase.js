import firebase from 'firebase'
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyBW8iYTpNu-VuHEEU06QrHBiBGsa30Iu6Y",
  authDomain: "fir-860a8.firebaseapp.com",
  databaseURL: "https://fir-860a8.firebaseio.com",
  projectId: "fir-860a8",
  storageBucket: "fir-860a8.appspot.com",
  messagingSenderId: "975037999085"
};

firebase.initializeApp(config);

export default firebase;
