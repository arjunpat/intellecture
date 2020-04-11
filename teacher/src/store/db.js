import firebase from 'firebase/app'
import 'firebase/firestore'

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
export const messaging = firebase.messaging()

export function createClass(name = 'Untitled Class') {
  let user = firebase.auth().currentUser
  if (!user) return false;

  db.collection('classes').add({
    creator_email: user.email,
    name,
    created_at: firebase.firestore.Timestamp.fromDate(new Date())
  })
}

function genLectureId(length) {
  let options = 'abcdefghijklmnopqrstuvwxyz'
  let id = ''

  for (let i = 0; i < length; i++) {
    id += options[ Math.floor(Math.random() * options.length) ]
  }

  return id
}

export async function createLecture(classId, name = 'Untitled Lecture') {
  if (!classId) return false

  let id = genLectureId(5)
  let token = await messaging.getToken()

  db.collection('classes').doc(classId).collection('lectures').doc(id).set({
    created_at: firebase.firestore.Timestamp.fromDate(new Date()),
    name,
    messaging_id: token
  })

  return id
}

messaging.getToken().then(d => console.log(d))
firebase.messaging().onMessage((data) => {
  console.log(data);
});