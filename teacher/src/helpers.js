import Vue from 'vue'
import store from '@/store'
import config from '../../config'
export const serverOrigin = config.serverOrigin
export const socketServerOrigin = config.socketServerOrigin
export const log = config.printErrors ? console.log : () => { }

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
    log('Google Access Token: ', response.access_token)
    return post('/auth/google-signin', {
      google_access_token: response.access_token,
      teacher: true
    })
  }).then((result) => {
    if (!result.success)
      throw result

    return get('/auth/profile')
  }).then((result) => {
    if (result.success) {
      loadClasses()
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
    store.commit('setClasses', null)
    store.commit('setLectures', null)
  })
}

export function loadClasses(forceReload = false) {
  if (store.state.classes && store.state.classes.length !== 0 && !forceReload) return;
  return get('/classes/mine').then((result) => {
    if (!result.success)
      throw result
    result.data.sort((a, b) => (a.name > b.name) ? 1 : -1)
    store.commit('setClasses', result.data)
  })
}

export function dateToString(date) {
  let now = Date.now();

  let distance = Date.now() - date;

  if (3600000 > distance && distance > 0) {
    return getQuantityString(Math.round(distance / 60000), 'minute') + ' ago';
  } else if (86400000 > distance && distance > 0) {
    return getQuantityString(Math.round((now - date) / 3600000), 'hour') + ' ago';
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
}

export function dateTimeToString(date) {
  let oldDate = new Date(date).toLocaleString('en-US');
  oldDate = oldDate.split(":");
  let formatted = oldDate[0] + ":" + oldDate[1] + oldDate[2].substring(2);
  return formatted;
}

export function durationToString(ms, descriptive = false) {
  // Descriptive determines whether to display hours with minutes, and minutes with seconds

  let seconds = Math.floor(ms / 1000) % 60
  let minutes = Math.floor(ms / (1000 * 60)) % 60
  let hours = Math.floor(ms / (1000 * 60 * 60)) % 24
  let days = Math.floor(ms / (1000 * 60 * 60 * 24)) % 365
  let years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365))

  if (years > 0) {
    return getQuantityString(years, 'year')
  } else if (days > 0) {
    return getQuantityString(days, 'day')
  } else if (hours > 0) {
    let str = getQuantityString(hours, 'hour')
    if (descriptive && minutes !== 0)
      str += ' ' + getQuantityString(minutes, 'minute')
    return str
  } else if (minutes > 0) {
    let str = getQuantityString(minutes, 'minute')
    if (descriptive && seconds !== 0)
      str += ' ' + getQuantityString(seconds, 'second')
    return str
  } else {
    return getQuantityString(seconds, 'second')
  }
}

export function getQuantityString(quantity, singular, plural = singular + 's') {
  return quantity === 1 ? `${quantity} ${singular}` : `${quantity} ${plural}`
}

export function compareString(a, b) {
  return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase())
}

export function elapsedToTimeString(startTime, elapsed) {
  return new Date(startTime + elapsed).toLocaleTimeString()
}

export function pad(str, len) {
  while (str.length < len) str = ' ' + str
  return str
}
