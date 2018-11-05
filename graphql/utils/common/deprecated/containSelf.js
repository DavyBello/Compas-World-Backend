module.exports = ({ TC, resolver }) => TC.get(resolver).wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { args, viewer, scope } = rp;
  if (`${viewer._id}` === `${args.record._id}`) {
    const result = await next(rp);
    return result;
  }
  throw new Error(`This ${scope.toLowerCase()} can only edit itself`);
});
