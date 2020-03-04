import React from 'react';

const Transactions = props => {
  return (
    <div className=" column center">
      <h1>My Transactions</h1>
      <table>
        <tr>
          <th className="left-align">Ticker</th>
          <th className="right-align"># of Shares</th>
          <th className="right-align">Total</th>
        </tr>
        {props.transactions.map(trans => (
          <tr key={trans.ticker}>
            <td className="left-align">{trans.ticker.name}</td>
            <td className="right-align">{trans.quantity}</td>
            <td className="right-align">${trans.price}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Transactions;
