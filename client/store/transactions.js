import axios from 'axios';

/**
 * ACTION TYPES
 */
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';
const MADE_TRANSACTION = 'MADE_TRANSACTION';

/**
 * INITIAL STATE
 */
const initalState = [];

/**
 * ACTION CREATORS
 */
const gotTransactions = transaction => ({
  type: GOT_TRANSACTIONS,
  transaction,
});

const madeTransaction = transaction => ({
  type: MADE_TRANSACTION,
  transaction,
});

/**
 * THUNK CREATORS
 */
export const getTransactions = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/transactions/${userId}`);
    const data = res.data;
    return dispatch(gotTransactions(data));
  } catch (err) {
    console.error(err);
  }
};

export const makeTransaction = (userId, ticker, quantity) => async dispatch => {
  const body = {
    ticker,
    quantity,
  };
  try {
    const res = await axios.post(`/api/transactions/${userId}`, body);
    console.log('res?', res);
    const data = res.data;
    console.log('data?', data);
    return dispatch(madeTransaction(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = initalState, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return action.transaction;
    case MADE_TRANSACTION:
      return action.transaction;
    default:
      return state;
  }
}
