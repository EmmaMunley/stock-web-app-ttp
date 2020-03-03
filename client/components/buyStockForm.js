import React from 'react';
import { connect } from 'react-redux';
import { makeTransaction, getTransactions } from '../store/transactions';
/**
 * COMPONENT
 */
class BuyStockForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    console.log('handling sumbit');
    const userId = this.props.user.id;
    const ticker = evt.target.ticker.value;
    const quantity = evt.target.quantity.value;
    await this.props.makeTransaction(userId, ticker, quantity);
    this.props.getTransactions(userId);
  }

  render() {
    return (
      <div>
        <h1>Buy A Stock</h1>
        <form onSubmit={this.handleSubmit} name="buyStockForm">
          <input name="ticker" type="text" placeholder="ticker" />
          <input name="quantity" type="number" placeholder="1" />
          <button type="submit">Buy</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    portfolio: state.portfolio,
    transactions: state.transactions,
    stocks: state.stocks,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makeTransaction: (id, ticker, quantity) =>
      dispatch(makeTransaction(id, ticker, quantity)),
    getTransactions: userId => dispatch(getTransactions(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyStockForm);
