import React from 'react';

// import { Link } from 'react-router-dom';
// import AllStocks from './all-stocks';
import { Portfolio, Transactions } from '../components';

const Homepage = () => {
  return (
    <div>
      <p>Hello World</p>
      <Portfolio />
      <Transactions />
    </div>
  );
};

export default Homepage;
