export const serverHost = 'https://api.intellecture.app';
import firebase from 'firebase/app'
import 'firebase/auth'
import store from './store';

export function get(url) {
  if (!url.includes('http')) {
    url = serverHost + url;
  }

  return fetch(url, {
    credentials: 'include'
  }).then(res => res.json());
}

export function post(url, json) {
  if (!url.includes('http')) {
    url = serverHost + url;
  }

  return window.fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  }).then(res => res.json());
}

export function signInGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider()
  return firebase.auth().signInWithPopup(provider).then((result) => {
    console.log(result.user);
    return logIn(result.user)
  }).then((result) => {
    if (!result.success)
      throw result.error
    return get('/auth/profile')
  }).then((result) => {
    if (!result.success)
      throw result.error
    store.commit('setAuthUser', result.data)
  })
}

export function logIn(user) {
  return user.getIdToken(true).then((idToken) => {
    return post('/auth/signin', {
      firebase_token: idToken
    })
  })
}

export function logOut() {
  return get('/auth/signout').then((result) => {
    if (!result.success)
      throw result.error
    store.commit('setAuthUser', null)
    store.commit('setClasses', null)
  })
}

export function getClasses() {
  return get('/classes/mine').then((result) => {
    if(!result.success)
      throw result.error
    var classes = [...result.data];
    classes.sort((a, b) => (a.name > b.name) ? 1 : -1)
    store.commit('setClasses', result.data)
  })
}
export function setLectures() {
  get('/classes/mine').then((result) => {
      if(!result.success)
        throw result.error
      for (let indexClass of result.data) {
        get(`/lectures/get/${indexClass.uid}`).then((data)=>{
          for (let item of data.data) {
            item.className=indexClass.name;
          }
          store.commit("setLectures",data.data);
        });
      }
  })
}
