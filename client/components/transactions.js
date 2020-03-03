import React from 'react';
import { connect } from 'react-redux';
import { getTransactions } from '../store/transactions';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.renderRows = this.renderRows.bind(this);
  }

  async componentDidMount() {
    await this.props.getTransactions(this.props.user.id);
    this.setState({ loaded: true });
  }

  renderRows() {
    return this.props.transactions.map(trans => (
      <tr key={trans.ticker}>
        <td className="left-align">{trans.ticker.name}</td>
        <td className="right-align">{trans.quantity}</td>
        <td className="right-align">${trans.price}</td>
      </tr>
    ));
  }

  render() {
    if (!this.state.loaded) {
      return <div>{null}</div>;
    }

    return (
      <div>
        <h1>My Transactions</h1>
        <table>
          <tr>
            <th className="left-align">Ticker</th>
            <th className="right-align"># of Shares</th>
            <th className="right-align">Total</th>
          </tr>
          {this.renderRows()}
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    portfolio: state.portfolio,
    transactions: state.transactions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: userId => dispatch(getTransactions(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
