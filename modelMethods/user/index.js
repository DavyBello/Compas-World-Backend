const getActivationLinkEmail = require('./email/getActivationLinkEmail');
const getPasswordResetLinkEmail = require('./email/getPasswordResetLinkEmail');
const signToken = require('./auth/signToken');
const upsertGoogleUser = require('./auth/upsertGoogleUser');
const encryptPasswordVersion = require('./auth/encryptPasswordVersion');
const decodeToken = require('./auth/decodeToken');

module.exports = {
  getActivationLinkEmail,
  getPasswordResetLinkEmail,
  signToken,
  upsertGoogleUser,
  encryptPasswordVersion,
  decodeToken,
};
