import axios from 'axios';

/**
 * ACTION TYPES
 */
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';

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

/**
 * REDUCER
 */
export default function(state = initalState, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return action.transaction;
    default:
      return state;
  }
}
