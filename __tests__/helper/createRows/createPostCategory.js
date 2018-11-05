/* eslint-disable no-multi-assign,prefer-const */
const keystone = require('keystone');

const PostCategory = keystone.list('PostCategory').model;

module.exports = async (payload = {}) => {
  const n = (global.__COUNTERS__.postCategories += 1);

  return new PostCategory({
    name: `Normal Category ${n}`,
    ...payload,
  }).save();
};
