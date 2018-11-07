const keystone = require('keystone');

module.exports = function encryptPasswordVersion() {
  // const user = this;
  return keystone.pvCryptr.encrypt(this._pv);
};
