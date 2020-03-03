import React from 'react';
import { connect } from 'react-redux';
import { getPortfolio, makeTransaction } from '../store';
import BuyStockForm from './buyStockForm';
import Portfolio from './portfolio';

class PortfolioPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  async componentDidMount() {
    const userId = this.props.user.id;
    await this.props.getPortfolio(userId);

    this.setState({ loaded: true });
  }
  render() {
    if (!this.state.loaded) {
      return <div>loading</div>;
    }

    return (
      <div className="column">
        <div className="row" id="myPortfolio">
          <Portfolio portfolio={this.props.portfolio} />
          <BuyStockForm
            makeTransaction={this.props.makeTransaction}
            userId={this.props.user.id}
            error={this.props.error}
          />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage);
