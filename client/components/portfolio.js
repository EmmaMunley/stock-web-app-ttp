import React from 'react';
import { connect } from 'react-redux';
import { getPortfolio } from '../store/portfolio';
import { me } from '../store/user';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.renderRows = this.renderRows.bind(this);
  }

  async componentDidMount() {
    await this.props.getPortfolio(this.props.user.id);
    this.setState({ loaded: true });
  }

  renderRows() {
    return this.props.portfolio.map(stock => (
      <tr key={stock.ticker}>
        <td className="left-align">{stock.ticker}</td>
        <td className="right-align">{stock.quantity}</td>
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
        <h1>MyPortfolio</h1>
        <table>
          <tr>
            <th className="left-align">Ticker</th>
            <th className="right-align"># of Shares</th>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: userId => dispatch(getPortfolio(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
