import React from 'react';

const Portfolio = props => {
  const total = props.totalPortfolioValue;

  return (
    <div>
      <h1>My Portfolio (Total Value: ${total})</h1>
      <table>
        <tr>
          <th className="left-align">Ticker</th>
          <th className="right-align"># of Shares</th>
          <th className="right-align">Current Price</th>
          <th className="right-align">Open Price</th>
          <th className="right-align">Current Value</th>
        </tr>
        {props.portfolio.map(stock => (
          <tr
            key={stock.ticker}
            className={getClassNameForTickers(stock.price, stock.open)}
          >
            <td className="left-align">{stock.ticker}</td>
            <td className="right-align">{stock.quantity}</td>
            <td className="right-align">${stock.price}</td>
            <td className="right-align">${stock.open}</td>
            <td className="right-align">
              ${calculateTotalValue(stock.quantity, stock.price)}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

function calculateTotalValue(qty, price) {
  return Number(qty) * price;
}

function getClassNameForTickers(currentPrice, openPrice) {
  if (currentPrice === openPrice) {
    return 'grey';
  } else if (currentPrice < openPrice) {
    return 'red';
  } else {
    return 'green';
  }
}
export default Portfolio;
