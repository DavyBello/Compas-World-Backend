const getVerificationEmail = require('./email/getVerificationEmail');
const getPasswordResetLinkEmail = require('./email/getPasswordResetLinkEmail');

// Auth
const signToken = require('./auth/signToken');
const upsertGoogleUser = require('./auth/upsertGoogleUser');
const encryptPasswordVersion = require('./auth/encryptPasswordVersion');
const decodeToken = require('./auth/decodeToken');

module.exports = {
  getVerificationEmail,
  getPasswordResetLinkEmail,
  signToken,
  upsertGoogleUser,
  encryptPasswordVersion,
  decodeToken,
};
