module.exports = ({ TC, refPath }) => TC.getResolver('removeById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { context: { viewer } } = rp;
  if (TC.hasField(refPath)) {
    rp.beforeRecordMutate = async (doc) => {
      if (`${doc[refPath]}` !== `${viewer._id}`) {
        throw new Error('this user cannot delete this document');
      }
      return doc;
    };
    // run removeById resolver
    return next(rp);
  }
  return (Promise.reject(Error('invalid refPath')));
});
