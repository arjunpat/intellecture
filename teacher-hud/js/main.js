import { get, post } from './helpers.js'

post('/auth/google-signin', {
  google_access_token: 'ya29.a0AfH6SMAVAYltSTcD-hz0BXLtXKjwPdRvOiKgQH2Afh0OeVRaglnP7iFHRGTYtvVNXhEnnW2wSgobQGvujWiXPdDt_sq-KtdGzptMg6jCP3H8tMZqOl_DPN4KbWtErQI651BHRLItxSJOW0B28oV9ywhKF6lRzAzcQLPl'
}).then((result) => {
  console.log('RESULT', result)
})
