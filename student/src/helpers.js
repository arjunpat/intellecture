import store from './store';
export const serverHost = 'https://api.intellecture.app';

export function get(url) {
  if (!url.includes('http')) {
    url = serverHost + url;
  }

  return fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + store.state.token
    }
  }).then(res => res.json());
}

export function post(url, json) {
  if (!url.includes('http')) {
    url = serverHost + url;
  }

  return window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + store.state.token
    },
    body: JSON.stringify(json)
  }).then(res => res.json());
}

export function setTokenForUser(user) {
  return user.getIdToken(true).then((idToken) => {
    return post('/auth/login', {
      firebase_token: idToken
    })
  }).then((response) => {
    if (!response.success)
      throw response.error

    store.commit('setToken', response.data.token)
  })
}