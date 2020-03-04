const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const Axios = require('axios');
const pkg = require('../../package.json');
const { Transaction, User, Ticker, Portfolio } = require('../db');
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${pkg.name}`,
  {
    logging: false,
  }
);

router.use(express.json());

// gets all transactions for a specified user:
router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    res.send('no user defined!');
  } else {
    try {
      const transactions = await Transaction.findAll({
        include: [{ model: Ticker }],
        where: { userId },
      });

      if (!transactions) {
        res.status(404).send('No stocks in your portfolio!');
      } else {
        res.send(transactions);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});
// post a transaction for if a use buys a stock
router.post('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const ticker = req.body.ticker;
  const quantity = Number(req.body.quantity);
  try {
    await db.transaction(async t => {
      // get current stock price
      const response = await Axios.get(
        `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.IEX_API_TOKEN}`,
        { transaction: t }
      );

      const { latestPrice } = response.data;
      // get users current balance
      const transVal = latestPrice * quantity;
      const user = await User.findByPk(userId, { transaction: t });
      const canBuyStock = transVal <= user.balance;

      // update user balance
      if (canBuyStock) {
        const newBalance = user.dataValues.balance - transVal;
        await user.update({ balance: newBalance }, { transaction: t });
      } else {
        return res.status(500);
      }

      let foundTicker = await Ticker.findOne({
        where: { name: ticker },
      });

      if (foundTicker === null) {
        foundTicker = await Ticker.create({ name: ticker }, { transaction: t });
      }

      const tickerId = foundTicker.dataValues.id;

      const newTransaction = await Transaction.create(
        {
          tickerId,
          quantity,
          userId,
          price: latestPrice,
        },
        { transaction: t }
      );

      // check to see if stock exists already in user's portfolio

      let portfolio = await Portfolio.findOne({
        where: {
          tickerId,
          userId,
        },
      });
      // update the quantity of existing stock in portfolio
      if (portfolio !== null) {
        const updatedQuantity =
          Number(portfolio.dataValues.quantity) + Number(quantity);

        console.log('updatedQty', updatedQuantity);
        await portfolio.update(
          { quantity: updatedQuantity },
          { transaction: t }
        );
      } else {
        portfolio = await Portfolio.create(
          {
            tickerId,
            quantity,
            userId,
          },
          { transaction: t }
        );
      }
    });
    const result = await getPortfolio(userId);
    res.send(result);
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
    console.error(error);
    next(error);
  }
});

async function getPortfolio(userId) {
  const portfolio = await Portfolio.findAll({
    include: [{ model: Ticker }],
    where: {
      userId,
    },
  });

  // get the current stocks prices
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

  return result;
}
module.exports = router;
