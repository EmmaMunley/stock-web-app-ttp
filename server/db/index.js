const User = require('../models/users');
const Portfolio = require('../models/portfolios');
const db = require('./db');

module.exports = {
  db,
  User,
  Portfolio,
};
