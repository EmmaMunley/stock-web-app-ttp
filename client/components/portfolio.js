import React from 'react';

const Portfolio = props => {
  return (
    <div>
      <h1>My Portfolio</h1>
      <table>
        <tr>
          <th className="left-align">Ticker</th>
          <th className="right-align"># of Shares</th>
          <th className="right-align">Current Price</th>
        </tr>
        {props.portfolio.map(stock => (
          <tr key={stock.ticker}>
            <td className="left-align">{stock.ticker}</td>
            <td className="right-align">{stock.quantity}</td>
            <td className="right-align">${stock.price}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Portfolio;
