const config = {}

// ----------------------------- MAKE CHANGES BELOW -----------------------
// let api = 'prod'
// let api = 'test'
// let api = 'local'
let api = window.location.origin.includes('localhost') ? 'test' : 'prod'
// ----------------------------- MAKE CHANGES ABOVE -----------------------

if (api === 'prod') {
  config.serverOrigin = 'https://api.intellecture.app'
  config.socketServerOrigin = 'wss://api.intellecture.app'
} else if (api === 'test') {
  config.serverOrigin = 'https://test-api.intellecture.app'
  config.socketServerOrigin = 'wss://test-api.intellecture.app'
} else if (api === 'local') {
  config.serverOrigin = 'http://localhost:8080'
  config.socketServerOrigin = 'ws://localhost:8080'
}

// Whether to print errors to console
config.printErrors = process.env.NODE_ENV === 'development'

export default { ...config, api }