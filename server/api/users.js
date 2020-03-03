const router = require('express').Router();
const User = require('../models/users');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

// Update a User's balance
router.put('/:userId', async (req, res, next) => {
  const transValue = req.body.transValue;
  try {
    const userToUpdate = await User.findByPk(req.params.userId);
    const canBuyShares = transValue <= userToUpdate.balance;
    if (!!canBuyShares) {
      const newBalance = userToUpdate.balance - transValue;
      console.log(newBalance + '=' + userToUpdate.balance + '-' + transValue);

      // update new balance
      userToUpdate.update({ balance: newBalance });
      res.status(200).json({ balance: newBalance });
      // create new rocord in portfolio
    } else {
      res.send('User has insufficient funds');
      return;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
