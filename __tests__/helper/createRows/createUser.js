/* eslint-disable no-multi-assign,prefer-const */
const keystone = require('keystone');

const User = keystone.list('User').model;

module.exports = async (payload = {}) => {
  const n = (global.__COUNTERS__.user += 1);

  return new User({
    name: `Normal user ${n}`,
    email: `user-${n}@example.com`,
    password: '123456',
    ...payload,
  }).save();
};
