const Sequelize = require('sequelize');
const db = require('../db');

const Portfolio = db.define('portfolio', {
  quantity: {
    type: Sequelize.STRING,
    defaultValue: 0,
  },
});

module.exports = Portfolio;
