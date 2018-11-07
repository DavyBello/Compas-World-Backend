/* eslint-disable func-names */
const keystone = require('keystone');

const { Types } = keystone.Field;
const ModelMethods = require('../modelMethods/user/index.js');

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');

// TODO: minimum password age, password complexity validation
User.add({
  name: { type: Types.Text, index: true },
  username: {
    type: Types.Text, index: true, unique: true, sparse: true,
  },
  email: {
    type: Types.Email, initial: true, required: true, unique: true, index: true,
  },
  password: { type: Types.Password, initial: true },
  // passwordVersion
  _pv: { type: Types.Number, required: true, default: 1 },
  isActivated: { type: Boolean, default: false, noedit: true },
  // user email verification status
  isVerified: { type: Boolean, default: false, noedit: true },
  // googleProvider
  _gP: {
    id: { type: String, noedit: true },
    token: { type: String, noedit: true },
  },
  // facebookProvider
  _fbP: {
    id: { type: String, noedit: true },
    token: { type: String, noedit: true },
  },
});

// Model Hooks
User.schema.pre('save', (next) => {
  // this.wasNew = this.isNew;
  next();
});

/**
 * Methods
 */
const {
  getVerificationEmail,
  getPasswordResetLinkEmail,
  signToken,
  upsertGoogleUser,
} = ModelMethods;

User.schema.methods.getVerificationEmail = getVerificationEmail;
User.schema.methods.getPasswordResetLinkEmail = getPasswordResetLinkEmail;

// AUth
User.schema.methods.signToken = signToken;

// Static Methods
User.schema.statics.upsertGoogleUser = upsertGoogleUser;

/**
 * Registration
 */
User.defaultColumns = 'name, email';
User.register();
