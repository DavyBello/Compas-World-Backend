const { AuthenticationError, ForbiddenError } = require('apollo-server');

module.exports = (options = {}, resolvers) => {
  const { scope, isVerified = false } = options;
  if (!scope) {
    throw new ForbiddenError('provide an authentication scope for this wrapper');
  }
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve(next => async (rp) => {
      // const { source, args, context, info } = resolveParams = rp
      try {
        const { viewer } = rp.context;
        // viewer is a mongoose query
        const viewerUser = await viewer;
        if (!viewerUser) {
          // Unauthorized request
          if (resolvers[k].parent.name === 'isAuthenticated') {
            return false;
          }
          throw new AuthenticationError('user is not authenticated');
        }
        if (scope !== rp.context.scope) {
          throw new AuthenticationError('user is not permitted to perform this action');
        }
        if (isVerified) {
          if (!viewerUser.isVerified) {
            throw new ForbiddenError('user account is not activated');
          }
        }
        rp.context.viewer = viewerUser;
        return next(rp);
      } catch (e) {
        return e;
      }
    });
    resolvers[k].scope = scope;
    resolvers[k].isAuthWrapped = true;
  });
  return resolvers;
};
