'use strict';

const { db, Portfolio, User, Transaction, Ticker } = require('./server/db');
const { green, red } = require('chalk');

const users = [
  {
    name: 'Emma',
    email: 'emma@gmail.com',
    password: '1234',
    balance: 4400,
  },
  {
    name: 'Test',
    email: 'Test@gmail.com',
    password: '1234',
    balance: 4500,
  },
];

const tickers = [
  { name: 'AMZN' },
  { name: 'FB' },
  { name: 'ZM' },
  { name: 'APPL' },
];

const transactions = [
  {
    userId: 1,
    tickerId: 1,
    price: 200,
    quantity: 1,
  },
  {
    tickerId: 3,
    userId: 1,
    price: 100,
    quantity: 2,
  },
  {
    tickerId: 4,
    userId: 2,
    price: 30,
    quantity: 5,
  },
  {
    tickerId: 2,
    userId: 2,
    price: 75,
    quantity: 2,
  },
  {
    userId: 1,
    tickerId: 1,
    price: 200,
    quantity: 1,
  },
];

const portfolios = [
  {
    userId: 1,
    tickerId: 1,
    quantity: 2,
  },
  {
    tickerId: 3,
    userId: 1,
    quantity: 1,
  },
  {
    tickerId: 4,
    userId: 2,
    quantity: 1,
  },
  {
    tickerId: 2,
    userId: 2,
    quantity: 1,
  },
];

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  await Promise.all(
    users.map(user => {
      return User.create(user);
    }),
    tickers.map(ticker => {
      return Ticker.create(ticker);
    })
  );

  await Promise.all(
    portfolios.map(portfolio => {
      return Portfolio.create(portfolio);
    }),
    transactions.map(transaction => {
      return Transaction.create(transaction);
    })
  );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
