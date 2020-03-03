import React from 'react';
import { connect } from 'react-redux';
import { getStocks } from '../store/stocks';

class AllStocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.renderRows = this.renderRows.bind(this);
  }

  async componentDidMount() {
    await this.props.getStocks();
    this.setState({ loaded: true });
  }

  renderRows() {
    return this.props.stocks.map(stock => (
      <tr key={stock.ticker}>
        <td className="left-align">{stock.ticket}</td>
        <td className="right-align">${stock.price}</td>
      </tr>
    ));
  }

  render() {
    if (!this.state.loaded) {
      return <div>{null}</div>;
    }

    return (
      <div>
        <h1>All Stocks</h1>
        <table>
          <tr>
            <th className="left-align">Ticker</th>

            <th className="right-align">Current Price</th>
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
    stocks: state.stocks,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStocks: () => dispatch(getStocks()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllStocks);
