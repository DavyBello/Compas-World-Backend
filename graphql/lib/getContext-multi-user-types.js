const keystone = require('keystone');

const Post = keystone.list('Post').model;
const PostCategory = keystone.list('PostCategory').model;

// const User = keystone.list('User').model;
const Candidate = keystone.list('Candidate').model;
// const Company = keystone.list('Company').model;

const getViewer = ({ id, pv, type }) => {
  const queryParams = {
    _id: id,
    _pv: pv ? keystone.pvCryptr.decrypt(pv) : -1,
  };

  let viewer = Promise.resolve(null);

  if (type === 'Candidate') viewer = Candidate.findOne(queryParams);
  // if (type  === 'Company') viewer = Company.findOne(queryParams);

  return viewer;
};

module.exports = ({ jwtPayload = {} } = {}) => {
  let context = {
    models: {
      Post,
      PostCategory,
      Candidate,
    },
  };
  if (jwtPayload) {
    const { id, pv, type } = jwtPayload;

    context = {
      ...context,
      jwtPayload,
      viewer: getViewer({ id, pv, type }),
      scope: type || 'User',
    };
  }

  return context;
};
