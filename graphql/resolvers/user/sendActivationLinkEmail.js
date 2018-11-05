module.exports = {
  kind: 'mutation',
  name: 'sendActivationLinkEmail',
  description: 'Send account activation link to user email',
  type: `type SendActivationLinkPayload {
		status: String!
		email: String!
	}`,
  resolve: async ({ context: { viewer } }) => {
    if (viewer.getActivationLinkEmail) {
      try {
        await viewer.getActivationLinkEmail().send();
        return ({
          status: 'success',
          email: viewer.email,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject(Error('this user cannot run this mutation'));
    }
  },
};
