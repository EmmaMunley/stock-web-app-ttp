const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db/db');

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  balance: {
    type: Sequelize.FLOAT,
    defaultValue: 5000,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
});

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.hashPassword(candidatePwd, this.salt()) === this.password();
};

/**
 * classMethods
 */

User.updateBalance = function(transVal) {
  console.log('transVal:', transVal);
  const newBalance = User.balance - transVal;
  User.balance = newBalance;
};

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

User.hashPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.hashPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword);
});

module.exports = User;
