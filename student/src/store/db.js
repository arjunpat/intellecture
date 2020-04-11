import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

firebase.initializeApp({
  apiKey: 'AIzaSyCcVmiE6jRuOK-XrD2TeGHVAhRUamq80jU',
  authDomain: 'intellecture-6b3e6.firebaseapp.com',
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com',
  projectId: 'intellecture-6b3e6',
  storageBucket: 'intellecture-6b3e6.appspot.com',
  messagingSenderId: '462381253872',
  appId: '1:462381253872:web:fc0f440c35a1c920026e35'
})

export { firebase };
export const db = firebase.firestore()

export function updateScore(to, value) {
  firebase.functions().httpsCallable('sendMessage')({ to, value }).then(result => {
    console.log(result);
  });
}

updateScore('cjIuZp7zGhs_UgTPq1vLyC:APA91bFIDaTbv0DnnEzrjSPfgZZpczEbI6W7MX0OQosAyjPrUpuqxq3tXsducLvRLlqDQdOK72zqEBkP4taV5K-kEJrJPLxZ5ixR-NgKLQ3J1rZSzJcS2i-Olb1_9C5uIeEUKyg5hz84', 5);