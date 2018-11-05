const { AuthenticationError } = require('apollo-server');

module.exports = ({ TC }) => TC.get('$updateById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { args, context: { viewer } } = rp;
  if (`${viewer._id}` === `${args.record._id}`) {
    const result = await next(rp);
    return result;
  }
  // throw new Error(`this user can only edit itself`);
  return new AuthenticationError('user is not permitted to perform this action');
});
