import React from 'react';

class BuyStockForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    const userId = this.props.userId;
    const ticker = evt.target.ticker.value;
    const quantity = evt.target.quantity.value;
    await this.props.makeTransaction(userId, ticker, quantity);
  }

  render() {
    return (
      <div>
        <h1>Buy A Stock</h1>
        <form onSubmit={this.handleSubmit} name="buyStockForm">
          <input name="ticker" type="text" placeholder="ticker" required />
          <input name="quantity" type="number" placeholder="1" required />

          <button type="submit">Buy</button>
        </form>
        {this.props.error ? <p className="error">{this.props.error}</p> : null}
      </div>
    );
  }
}

export default BuyStockForm;
