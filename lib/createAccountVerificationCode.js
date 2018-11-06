const jwt = require('jsonwebtoken');

module.exports = (user, { createdAt = Date.now() } = {}) => {
  const token = jwt.sign({
    id: user._id,
    createdAt,
  }, process.env.CODEGEN_JWT_SECRET);

  return token;
};
