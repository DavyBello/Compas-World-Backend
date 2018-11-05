const keystone = require('keystone');
const jwt = require('jsonwebtoken');

module.exports = (user) => {
  const token = jwt.sign({
    id: user._id,
    createdAt: Date.now(),
    pv: keystone.pvCryptr.encrypt(user.passwordVersion),
  }, process.env.CODEGEN_JWT_SECRET);

  return token;
};
