const router = require('express').Router();
const Axios = require('axios');

router.get(`/`, async (req, res, next) => {
  try {
    const response = await Axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?symbols=dow,nasdaq,sandp,goog,aapl,dis,msft,fb,tsla&types=quote&token=${process.env.IEX_API_TOKEN}`
    );

    const stocks = Object.values(response.data).map(stock => ({
      company: stock.quote.companyName,
      ticket: stock.quote.symbol,
      price: stock.quote.latestPrice,
    }));

    if (!!stocks) {
      res.json(stocks);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
