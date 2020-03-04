const express = require('express');
const router = express.Router();
const { Portfolio } = require('../db/');
const { getPortfolio } = require('./utils');

router.use(express.json());

// gets all stocks in portfolio for a specified user & current price
router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // get user portfolio including stocks
    const result = await getPortfolio(userId);
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
