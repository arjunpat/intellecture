import Vue from 'vue'
import store from './store'
export const serverHost = window.location.origin.includes('localhost') ? 'http://73.15.192.227:8080' : 'https://api.intellecture.app';

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
  return Vue.gAuth.signIn().then((googleUser) => {
    return googleUser.getAuthResponse()
  }).then((response) => {
    return post('/auth/google-signin', {
      google_access_token: response.access_token
    }) 
  }).then((result) => {
    if (!result.success)
      throw result
  })
}

export function signOut() {
  return get('/auth/signout').then((result) => {
    if (!result.success)
      throw result

    store.commit('setAuthUser', null)
  })
}
