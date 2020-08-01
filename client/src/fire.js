import firebase from 'firebase'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBdvu0gTl-OBfjIfsig6WMU0TkuHfV9kkk",
    authDomain: "webbereye.firebaseapp.com",
    databaseURL: "https://webbereye.firebaseio.com",
    projectId: "webbereye",
    storageBucket: "webbereye.appspot.com",
    messagingSenderId: "429758855894",
    appId: "1:429758855894:web:3a9c1f3600ec03ecc5a777",
    measurementId: "G-VWYR8C5RH6"
  };

var fire = firebase.initializeApp(config);
export default fire;