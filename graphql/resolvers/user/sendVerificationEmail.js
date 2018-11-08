const { ForbiddenError } = require('apollo-server');

module.exports = {
  kind: 'mutation',
  name: 'sendVerificationEmail',
  description: 'Send account activation link to user email',
  type: `type sendVerificationEmailPayload {
		status: String!
		email: String!
	}`,
  resolve: async ({ context: { viewer, services } }) => {
    if (!viewer.isVerified) {
      try {
        await services.sendVerificationEmail(viewer);
        return ({
          status: 'success',
          email: viewer.email,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return new ForbiddenError('account is already verified');
  },
};
