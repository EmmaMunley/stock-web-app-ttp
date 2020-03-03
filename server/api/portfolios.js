const express = require('express');
const router = express.Router();
const { Portfolio, Ticker } = require('../db/');
const Axios = require('axios');

router.use(express.json());

// gets all stocks in portfolio for a specified user & current price
router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // get user portfolio including stocks
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
        stockPrices[stock.quote.symbol] = stock.quote.latestPrice;
      });
    }

    const result = portfolio.map(p => ({
      quantity: p.dataValues.quantity,
      ticker: p.dataValues.ticker.name,
      price: stockPrices[p.dataValues.ticker.name],
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// gets specific stock in portfolio specified user:
router.get('/:userId/:ticker', async (req, res, next) => {
  const userId = req.params.userId;
  const ticker = req.params.ticker;

  try {
    const stocks = await Portfolio.findAll({
      where: { userId, ticker },
    });
    if (!stocks) {
      res.status(404).send(`${ticker} is not part of your portfolio`);
    } else {
      res.send(stocks);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
