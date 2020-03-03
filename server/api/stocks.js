const router = require('express').Router();
const Axios = require('axios');

// get all stocks
// router.get(`/`, async (req, res, next) => {
//   try {
//     const response = await Axios.get(
//       `https://cloud.iexapis.com/stable/stock/market/batch?symbols=dow,nasdaq,sandp,goog,aapl,dis,msft,fb,tsla&types=quote&token=${process.env.IEX_API_TOKEN}`
//     );

//     const stocks = Object.values(response.data).map(stock => ({
//       company: stock.quote.companyName,
//       ticket: stock.quote.symbol,
//       price: stock.quote.latestPrice,
//       open: stock.quote.open,
//       close: stock.quote.close,
//     }));

//     if (!!stocks) {
//       res.json(stocks);
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// get specific stock
router.get(`/:ticker`, async (req, res, next) => {
  const ticker = req.params.ticker;
  try {
    const response = await Axios.get(
      `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.IEX_API_TOKEN}`
    );
    const { symbol, companyName, latestPrice } = response.data;

    const stock = {
      company: companyName,
      ticker: symbol,
      price: latestPrice,
    };

    res.json(stock);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
