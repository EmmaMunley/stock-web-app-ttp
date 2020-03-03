import axios from 'axios';
import portfolio from './portfolio';

/**
 * ACTION TYPES
 */
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';
const MADE_TRANSACTION = 'MADE_TRANSACTION';
const ERROR = 'ERROR';
/**
 * INITIAL STATE
 */
const initalState = {
  transactions: [],
  error: null,
};

/**
 * ACTION CREATORS
 */
const gotTransactions = transaction => ({
  type: GOT_TRANSACTIONS,
  transaction,
});

const madeTransaction = portfolio => ({
  type: MADE_TRANSACTION,
  portfolio,
});

const error = message => ({
  type: ERROR,
  message,
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
    const data = res.data;
    return dispatch(madeTransaction(data));
  } catch (err) {
    return dispatch(error('Insufficient funds'));
  }
};

/**
 * REDUCER
 */
export default function(state = initalState, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return { transactions: action.transaction, error: null };
    case ERROR:
      return { ...state, error: action.message };
    case MADE_TRANSACTION:
      return { ...state, error: null };
    default:
      return state;
  }
}
