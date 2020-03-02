const Sequelize = require('sequelize');
const User = require('./users');
const db = require('../db/db');

const Portfolio = db.define('portfolio', {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

Portfolio.belongsTo(User);

module.exports = Portfolio;
