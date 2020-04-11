const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const responses = require('./responses.js')

// https://firebase.google.com/docs/functions/callable
exports.sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) return responses.error('no_auth')

  let email = context.auth.token.email
  let now = Date.now()

  let resp = await admin.messaging().sendToDevice(data.to, {
    data: {
      time: now,
      value: data.value,
      email
    }
  })

  return responses.success()
});