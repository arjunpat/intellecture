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
    return signIn(result.user)
  }).then((result) => {
    if (!result.success)
      throw result
    return get('/auth/profile')
  }).then((result) => {
    if (!result.success)
      throw result
    store.commit('setAuthUser', result.data)
  })
}

export function signIn(user) {
  return user.getIdToken(true).then((idToken) => {
    return post('/auth/signin', {
      firebase_token: idToken
    })
  })
}

export function signOut() {
  return get('/auth/signout').then((result) => {
    if (!result.success)
      throw result
    store.commit('setAuthUser', null)
    store.commit('setClasses', null)
    store.commit('setLectures', null)
  })
}

export function getClasses() {
  return get('/classes/mine').then((result) => {
    if(!result.success)
      throw result
    result.data.sort((a, b) => (a.name > b.name) ? 1 : -1)
    store.commit('setClasses', result.data)
  })
}

export function setLectures() {
  get('/classes/mine').then((result) => {
      store.commit("setLectures", null);
      if(!result.success)
        throw result
      
      result.data.sort((a, b) => (a.name > b.name) ? 1 : -1)
      store.commit('setClasses', result.data)

      for (let indexClass of result.data) {
        get(`/lectures/by-class/${indexClass.uid}`).then((data)=>{
          for (let item of data.data) {
            item.className = indexClass.name;
          }
          store.commit("addLectures", data.data);
        });
      }
  })
}

export function dateToString(date) {
  let now = Date.now();

  let distance = Date.now() - date;

  if (3600000 > distance && distance > 0) {
    return Math.round(distance / 60000) + ' minutes ago';
  } else if (86400000 > distance && distance > 0) {
    return Math.round((now - date) / 3600000) + ' hours ago';
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
}
