const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

const firebaseConfig = {
    apiKey: "AIzaSyBjCNxq4tJyg82098MZo74o0bGWn066Xvo",
    authDomain: "iert-7f55e.firebaseapp.com",
    projectId: "iert-7f55e",
    storageBucket: "iert-7f55e.appspot.com",
    messagingSenderId: "371921895175",
    appId: "1:371921895175:web:4a9c23c4ebdef0ae200fa2",
    measurementId: "G-CN339GBMSE"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


  module.exports = app;