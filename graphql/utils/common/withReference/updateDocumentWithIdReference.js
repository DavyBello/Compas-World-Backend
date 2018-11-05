module.exports = ({ TC, refPath }) => TC.getResolver('updateById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { context: { viewer } } = rp;
  rp.args.record[refPath] = viewer._id;
  if (TC.hasField(refPath)) {
    rp.beforeRecordMutate = async (doc) => {
      if (`${doc[refPath]}` !== `${viewer._id}`) {
        throw new Error('this user cannot update this document');
      }
      doc.updatedAt = new Date();
      return doc;
    };
    // run updateById resolver
    return next(rp);
  }
  return (Promise.reject(Error('invalid refPath')));
});
