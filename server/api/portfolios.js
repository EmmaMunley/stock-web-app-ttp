const express = require('express');
const router = express.Router();
const { Portfolio, Ticker } = require('../db/');
const Axios = require('axios');

router.use(express.json());

// gets all stocks in portfolio for a specified user & current price
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // get user portfolio including stocks
    const portfolio = await Portfolio.findAll({
      include: [{ model: Ticker }],
      where: {
        userId,
      },
    });
    // get the current stocks prices
    let formattedStocks = '';
    const stockNames = Object.values(portfolio).forEach(p => {
      formattedStocks += `${p.dataValues.ticker.name},`;
    });
    formattedStocks = formattedStocks.substr(0, formattedStocks.length - 1);

    const stocks = await Axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${formattedStocks}&types=quote&token=${process.env.IEX_API_TOKEN}`
    );

    const stockPrices = {};

    Object.values(stocks.data).forEach(stock => {
      stockPrices[stock.quote.symbol] = stock.quote.latestPrice;
    });

    const result = Object.values(portfolio).map(p => ({
      quantity: p.dataValues.quantity,
      ticker: p.dataValues.ticker.name,
      price: stockPrices[p.dataValues.ticker.name],
    }));

    if (!portfolio) {
      res.send('Portfolio could not be found');
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

// gets specific stock in portfolio specified user:
router.get('/:userId/:ticker', async (req, res) => {
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
    console.log(error);
  }
});

module.exports = router;
