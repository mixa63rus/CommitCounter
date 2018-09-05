import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDZ-oA7HoY7T2Jb_DEryOZztCorFBt_D_s",
    authDomain: "vied-countcommits.firebaseapp.com",
    databaseURL: "https://vied-countcommits.firebaseio.com",
    projectId: "vied-countcommits",
    storageBucket: "vied-countcommits.appspot.com",
    messagingSenderId: "342368281977"
};
export const fire = firebase.initializeApp(config);

export const database = fire.database().ref().child('Users');
