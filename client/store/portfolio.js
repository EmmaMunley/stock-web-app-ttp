import axios from 'axios';
import user from './user';

/**
 * ACTION TYPES
 */
const GOT_PORTFOLIO = 'GOT_PORTFOLIO';

/**
 * INITIAL STATE
 */
const initalState = [];

/**
 * ACTION CREATORS
 */
const gotPortfolio = portfolio => ({
  type: GOT_PORTFOLIO,
  portfolio,
});

/**
 * THUNK CREATORS
 */
export const getPortfolio = userId => async dispatch => {
  try {
    console.log('test userId', userId);
    const res = await axios.get(`/api/portfolios/${userId}`);
    const data = res.data;
    console.log('data', data);
    return dispatch(gotPortfolio(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = initalState, action) {
  switch (action.type) {
    case GOT_PORTFOLIO:
      return action.portfolio;
    default:
      return state;
  }
}
