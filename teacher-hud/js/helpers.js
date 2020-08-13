import config from './config.js'
export const serverOrigin = config.serverOrigin
export const socketServerOrigin = config.socketServerOrigin
export const log = config.printErrors ? console.log : () => { }

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