import axios from 'axios';

/**
 * ACTION TYPES
 */
const GOT_STOCKS = 'GOT_STOCKS';

/**
 * INITIAL STATE
 */
const initalState = [];

/**
 * ACTION CREATORS
 */
const gotStocks = stocks => ({
  type: GOT_STOCKS,
  stocks,
});

/**
 * THUNK CREATORS
 */
export const getStocks = () => async dispatch => {
  try {
    const res = await axios.get(`/api/stocks/`);
    const data = res.data;
    console.log('trying data', data);
    return dispatch(gotStocks(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = initalState, action) {
  switch (action.type) {
    case GOT_STOCKS:
      return action.stocks;
    default:
      return state;
  }
}
