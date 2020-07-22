import Vue from 'vue'
import store from '@/store'
import config from '../../config'
export const serverOrigin = config.serverOrigin
export const socketServerOrigin = config.socketServerOrigin
export const log = config.printErrors ? console.log : () => {}

log(`-----------------\nUSING ${config.api} SERVER\n-----------------`)

export function get(url) {
  if (!url.includes('http')) {
    url = serverOrigin + url;
  }

  return fetch(url, {
    credentials: 'include'
  }).then(res => res.json());
}

export function post(url, json) {
  if (!url.includes('http')) {
    url = serverOrigin + url;
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

    return get('/auth/profile')
  }).then((result) => {
    if (result.success) {
      store.commit('setAuthUser', result.data)
    } else {
      throw result
    }
  })
}

export function signOut() {
  return get('/auth/signout').then((result) => {
    if (!result.success)
      throw result

    store.commit('setAuthUser', null)
  })
}
