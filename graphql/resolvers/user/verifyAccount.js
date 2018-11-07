const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { UserInputError } = require('apollo-server');

const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'verifyAccount',
  description: 'Activate a User account',
  args: {
    input: `input ActivateUserAccountInput {
      code: String!
		}`,
  },
  type: `type ActivateUserAccountPayload {
    token: String!
    userType: String
    name: String!
  }`,
  resolve: async ({ args }) => {
    const { input: { code } } = args;
    try {
      const data = jwt.verify(code, process.env.CODEGEN_JWT_SECRET);
      const { id, createdAt } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const user = await User.findOne({ _id: id });
          if (user.isVerified) {
            return Promise.reject(new UserInputError('verified account'));
          }
          user.isVerified = true;
          await user.save();
          const token = user.signToken();
          return {
            name: user.name,
            token,
          };
        }
        return Promise.reject(new UserInputError('expired token'));
      }
      return Promise.reject(new UserInputError('invalid token'));
    } catch (err) {
      throw new UserInputError(err);
    }
  },
};
