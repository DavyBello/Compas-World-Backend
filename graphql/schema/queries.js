// Get logic middleware
const {
  authAccess,
} = require('../utils/authentication');

const {
  UserTC,
  ViewerTC,
  PostTC,
} = require('../composers');

// Add fields and resolvers to rootQuery
module.exports = {
  posts: PostTC.getResolver('findMany'),
  ...authAccess({ scope: 'User' }, {
    userIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewer: ViewerTC.getResolver('viewer'),
  }),
  currentTime: {
    type: 'Date',
    resolve: () => new Date().toISOString(),
  },
};
