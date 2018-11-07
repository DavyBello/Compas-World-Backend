const keystone = require('keystone');

const User = keystone.list('User').model;
// const Post = keystone.list('Post').model;
// const PostCategory = keystone.list('PostCategory').model;


module.exports = ({ jwtPayload = {} } = {}) => {
  let context = {
    // models: {
    //   User,
    //   Post,
    //   PostCategory,
    // },
  };
  if (jwtPayload) {
    const queryParams = {
      _id: jwtPayload.id,
      _pv: jwtPayload.pv ? keystone.pvCryptr.decrypt(jwtPayload.pv) : -1,
    };

    context = {
      ...context,
      jwtPayload,
      viewer: User.findOne(queryParams),
      scope: 'User',
    };
  }

  return context;
};
