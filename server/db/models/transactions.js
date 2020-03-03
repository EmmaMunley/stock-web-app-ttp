const Sequelize = require('sequelize');
const db = require('../db');

const Transactions = db.define('transactions', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  price: {
    type: Sequelize.FLOAT,
  },
});

module.exports = Transactions;
