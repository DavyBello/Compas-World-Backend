/* eslint-disable no-multi-assign,prefer-const */
const keystone = require('keystone');

const Post = keystone.list('Post').model;

module.exports = async (payload = {}) => {
  const n = (global.__COUNTERS__.posts += 1);

  return new Post({
    title: `Normal Title ${n}`,
    conent: {
      brief: 'Example brief',
      extended: 'Example extended',
    },
    ...payload,
  }).save();
};
