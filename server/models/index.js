const Portfolio = require('./portfolios');
const User = require('./users');
const Transaction = require('./transactions');
const Ticker = require('./tickers');

Transaction.belongsTo(User);
Portfolio.belongsTo(User);
Portfolio.belongsTo(Ticker);
Transaction.belongsTo(Ticker);

module.exports = {
  Portfolio,
  User,
  Transaction,
  Ticker,
};
