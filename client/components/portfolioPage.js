import React from 'react';
import { connect } from 'react-redux';
import { getPortfolio, makeTransaction, me } from '../store';
import BuyStockForm from './buyStockForm';
import Portfolio from './portfolio';

class PortfolioPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.calculatePortfolioValue = this.calculatePortfolioValue.bind(this);
  }
  async componentDidMount() {
    const userId = this.props.user.id;
    await this.props.getPortfolio(userId);

    this.setState({ loaded: true });
  }
  calculatePortfolioValue(portfolio) {
    let sum = 0;
    portfolio.forEach(stock => (sum += stock.quantity * stock.price));
    return sum;
  }
  render() {
    const totalPortfolioValue = this.calculatePortfolioValue(
      this.props.portfolio
    );

    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className="column center">
        <div className="row" id="myPortfolio">
          <div className="container">
            <Portfolio
              portfolio={this.props.portfolio}
              totalPortfolioValue={totalPortfolioValue}
            />
          </div>
          <div className="container">
            <BuyStockForm
              className="container"
              balance={this.props.user.balance}
              reloadBalance={this.props.reloadBalance}
              makeTransaction={this.props.makeTransaction}
              userId={this.props.user.id}
              error={this.props.error}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    portfolio: state.portfolio,
    error: state.transactions.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: userId => dispatch(getPortfolio(userId)),
    makeTransaction: (id, ticker, quantity) =>
      dispatch(makeTransaction(id, ticker, quantity)),
    reloadBalance: userId => dispatch(me(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage);
