const keystone = require('keystone');

const User = keystone.list('User').model;

const { UserInputError } = require('apollo-server');

module.exports = {
  kind: 'mutation',
  name: 'sendPasswordResetLinkEmail',
  description: 'Send password reset link to user email',
  args: {
    input: `input sendPasswordResetLinkEmailInput {
      email: String!
    }`,
  },
  type: `type sendPasswordResetLinkEmailPayload {
		status: String!
		email: String!
	}`,
  resolve: async ({ args, context: { services } }) => {
    const { input: { email } } = args;
    const user = await User.findOne({ email });
    if (user) {
      try {
        await services.sendPasswordResetLinkEmail(user);
        return ({
          status: 'success',
          email: user.email,
        });
      } catch (e) {
        return e;
      }
    }
    return new UserInputError('user not found');
  },
};
