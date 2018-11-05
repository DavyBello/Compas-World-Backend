module.exports = ({ TC, refPath }) => TC.get('$createOne').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { context: { viewer } } = rp;
  if (TC.hasField(refPath)) {
    rp.args.record[refPath] = viewer._id;
    rp.args.record.createdAt = Date.now();
    // run createOne resolver
    return next(rp);
  }
  return Promise.reject(Error('invalid refPath'));
});
