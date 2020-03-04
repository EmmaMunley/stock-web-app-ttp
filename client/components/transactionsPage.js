import React from 'react';
import { connect } from 'react-redux';
import Transactions from './transactions';
import { getTransactions } from '../store';

class TransactionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    const userId = this.props.user.id;
    await this.props.getTransactions(userId);
    this.setState({ loaded: true });
  }

  render() {
    return (
      <div>
        <Transactions transactions={this.props.transactions} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    transactions: state.transactions.transactions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: userId => dispatch(getTransactions(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPage);
