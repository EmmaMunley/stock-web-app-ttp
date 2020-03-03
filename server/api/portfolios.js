const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolios');

router.use(express.json());

// gets all stocks in portfolio specified user:
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const portfolio = await Portfolio.findByPk(userId);
    if (!portfolio) {
      res.status(404).send('No stocks in your portfolio!');
    } else {
      res.json(portfolio);
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

// User buys a stock
// router.post('/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   const ticker = req.body.ticker;
//   const quantity = Number(req.body.quantity);

//   try {
//     const stock = await Axios.get(`http://localhost:8080/api/stocks/${ticker}`);
//     const latestPrice = stock.data.price;
//     const transValue = latestPrice * quantity;
//     const balance = await Axios.put(
//       `http://localhost:8080/api/users/${userId}`,
//       {
//         transValue,
//       }
//     );
//     if (balance.data === 'User has insufficient funds') {
//       res.send('User has insufficient funds');
//     } else {
//       const stockExists = await Portfolio.findOne({
//         where: { ticker },
//       });

//       if (stockExists) {
//         const newQuantity = stockExists.quantity + quantity;

//         stockExists.update({ quantity: newQuantity });
//         res.status(200).send(stockExists);
//       } else {
//         const newStock = await Portfolio.create({
//           ticker,
//           quantity,
//           userId,
//           priceBought: latestPrice,
//         });
//         res.status(200).send(newStock);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
