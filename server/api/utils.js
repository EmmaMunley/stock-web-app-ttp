const Axios = require('axios');
const { Ticker, Portfolio } = require('../db');

async function getPortfolio(userId) {
  const portfolio = await Portfolio.findAll({
    include: [{ model: Ticker }],
    where: {
      userId,
    },
  });

  const stockNames = Object.values(portfolio)
    .map(p => p.dataValues.ticker.name)
    .join(',');

  const stockPrices = {};
  if (stockNames.length) {
    const stocksResponse = await Axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${stockNames}&types=quote&token=${process.env.IEX_API_TOKEN}`
    );
    const stocks = stocksResponse.data;
    Object.values(stocks).forEach(stock => {
      stockPrices[stock.quote.symbol] = {
        latestPrice: stock.quote.latestPrice,
        openPrice: stock.quote.open,
      };
    });
  }

  const result = portfolio.map(p => ({
    quantity: p.dataValues.quantity,
    ticker: p.dataValues.ticker.name,
    price: stockPrices[p.dataValues.ticker.name].latestPrice,
    open: stockPrices[p.dataValues.ticker.name].openPrice,
  }));

  return result;
}

module.exports = { getPortfolio };
