const Sequelize = require('sequelize');
const db = require('../db/db');

const Portfolio = db.define('portfolio', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Portfolio;
