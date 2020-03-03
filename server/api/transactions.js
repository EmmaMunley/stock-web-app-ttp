const express = require('express');
const router = express.Router();
const Axios = require('axios');

const Portfolio = require('../models/portfolios');
const User = require('../models/users');

router.use(express.json());

// gets all stocks in portfolio specified user:
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    res.send('no user defined!');
  } else {
    try {
      const stocks = await Portfolio.findAll({
        where: { userId },
      });
      if (!stocks) {
        res.status(404).send('No stocks in your portfolio!');
      } else {
        res.send(stocks);
      }
    } catch (error) {
      console.log(error);
    }
  }
});

// gets specific stock in portfolio specified user:
router.get('/:userId/:ticker', async (req, res) => {
  const userId = req.params.userId;
  const ticker = req.params.ticker;

  if (!userId || !ticker) {
    res.send('please enter a user Id and ticker');
  } else {
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
  }
});

// User buys a stock
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const ticker = req.body.ticker;
  const quantity = Number(req.body.quantity);

  try {
    const stock = await Axios.get(`http://localhost:8080/api/stocks/${ticker}`);
    const latestPrice = stock.data.price;
    const transValue = latestPrice * quantity;
    const balance = await Axios.put(
      `http://localhost:8080/api/users/${userId}`,
      {
        transValue,
      }
    );
    if (balance.data === 'User has insufficient funds') {
      res.send('User has insufficient funds');
    } else {
      const stockExists = await Portfolio.findOne({
        where: { ticker },
      });

      if (stockExists) {
        const newQuantity = stockExists.quantity + quantity;

        stockExists.update({ quantity: newQuantity });
        res.status(200).send(stockExists);
      } else {
        const newStock = await Portfolio.create({
          ticker,
          quantity,
          userId,
          priceBought: latestPrice,
        });
        res.status(200).send(newStock);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete('/:userId/:ticker', async (req, res, next) => {
  const userId = req.params.userId;
  const ticker = req.params.ticker;

  try {
    const stock = await Portfolio.findOne({
      where: {
        ticker,
        userId,
      },
    });

    if (stock) {
      await stock.destroy();
      res.status(204).end();
      console.log('stock was deleted');
    } else {
      console.log('stock could not be updated');
      res.status(404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
