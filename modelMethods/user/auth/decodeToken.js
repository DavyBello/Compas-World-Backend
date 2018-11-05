const jwt = require('jsonwebtoken');

module.exports = (token) => {
  if (!token) return {};
  return jwt.verify(token, process.env.JWT_SECRET);
};
