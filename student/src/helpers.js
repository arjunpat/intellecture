import Vue from 'vue'
import store from '@/store'
import config from '../../config'
export const serverOrigin = config.serverOrigin
export const socketServerOrigin = config.socketServerOrigin
export const log = config.printErrors ? console.log : () => {}

log(`-----------------\nUSING ${config.api} SERVER\n-----------------`)

export function http(method, url, body) {
  if (!url.includes('http')) {
    url = serverOrigin + url
  }

  return window.fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }).then(res => res.json())
}

export function get(url) {
  return http('GET', url, undefined)
}

export function post(url, json) {
  return http('POST', url, JSON.stringify(json))
}

export function put(url, json) {
  return http('PUT', url, JSON.stringify(json))
}

export function httpDelete(url) {
  return http('DELETE', url, undefined)
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
