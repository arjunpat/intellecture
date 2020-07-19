const config = {}

// Address of production server
config.prodServerAddress = 'https://api.intellecture.app'
// Websocket address of production server
config.prodServerSocketAddress = 'wss://api.intellecture.app'
// Address of test server
config.testServerAddress = 'http://73.15.192.227:8080' 
// Websocket address of test server
config.testServerSocketAddress = 'ws://73.15.192.227:8080'
// Whether to use test server when developing on localhost
config.useTestServerInDevelopment = false 
// Whether to use test server
config.useTestServer = window.location.origin.includes('localhost') && config.useTestServerInDevelopment 
// Whether to print errors to console
config.printErrors = process.env.NODE_ENV === 'development'

export default config