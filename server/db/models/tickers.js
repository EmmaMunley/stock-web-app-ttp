const Sequelize = require('sequelize');
const db = require('../db');

const Ticker = db.define('ticker', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Ticker;
