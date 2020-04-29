const redis = require('redis');

let pub = redis.createClient();
let sub = redis.createClient();

sub.on('message', (channel, message) => {
  console.log(channel, message);

});

sub.on('subscribe', (channel, count) => {
  console.log(channel, count);
  setTimeout(() => {
    pub.publish('lecture:xyml', 'your mother died bitch');
  }, 5000);
});

sub.subscribe('lecture:xyml');

