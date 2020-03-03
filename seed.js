'use strict';

const { db, User, Portfolio } = require('./server/db');
const { green, red } = require('chalk');

const users = [
  {
    firstName: 'Emma',
    lastName: 'Munley',
    email: 'emma@gmail.com',
    password: '1234',
  },
  {
    firstName: 'Test',
    lastName: 'Test',
    email: 'Test@gmail.com',
    password: '1234',
  },
];

const portfolios = [
  {
    ticker: 'AMZN',
    quantity: 2,
    userId: 1,
  },
  {
    ticker: 'ZM',
    quantity: 2,
    userId: 1,
  },
  {
    ticker: 'AAPL',
    quantity: 1,
    userId: 2,
  },
  {
    ticker: 'FB',
    quantity: 3,
    userId: 2,
  },
];

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  await Promise.all(
    users.map(user => {
      return User.create(user);
    })
  );

  await Promise.all(
    portfolios.map(portfolio => {
      return Portfolio.create(portfolio);
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
