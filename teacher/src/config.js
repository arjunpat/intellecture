const config = {}

// Address of production server
config.prodServerAddress = 'https://api.intellecture.app'
// Websocket address of production server
config.prodServerSocketAddress = 'wss://api.intellecture.app'
// Address of test server
config.testServerAddress = 'https://test-api.intellecture.app' 
// Websocket address of test server
config.testServerSocketAddress = 'wss://test-api.intellecture.app'
// Whether to use test server when developing on localhost
config.useTestServerInDevelopment = true
// Whether to use test server
config.useTestServer = window.location.origin.includes('localhost') && config.useTestServerInDevelopment 
// Whether to print errors to console
config.printErrors = process.env.NODE_ENV === 'development'

export default config