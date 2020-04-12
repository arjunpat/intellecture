const router = require('express').Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

let mysql;



router.post('/create', (req, res) => {
  // let { name, }
});

module.exports = (a) => {
  mysql = a;
  return router;
}
