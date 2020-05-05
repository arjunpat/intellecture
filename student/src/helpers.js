import store from './store';
import firebase from 'firebase/app'
import 'firebase/auth'
export const serverHost = 'https://api.intellecture.app';

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

export function logIn(user) {
  return user.getIdToken(true).then((idToken) => {
    return post('/auth/login', {
      firebase_token: idToken
    })
  })
}

export function signInGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider()
  return firebase.auth().signInWithPopup(provider).then((result) => {
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

export function logOut() {
  return get('/auth/logout').then((result) => {
    if (!result.success)
      throw result.error

    store.commit('setAuthUser', null)
  })
}
