module.exports = ({ TC, refPath }) => TC.getResolver('updateById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { viewer, scope } = rp;
  rp.args.record[refPath] = viewer._id;
  if (TC.hasField(refPath)) {
    rp.beforeRecordMutate = async function (doc, rp) {
      // console.log(`${doc[refPath]}` == `${viewer._id}`);
      // if (doc[refPath] != viewer._id) {
      if (`${doc[refPath]}` != `${viewer._id}`) {
        throw new Error('this user cannot update this document');
      }
			  doc.updatedAt = new Date();
			  return doc;
    };
    if (rp.args.record[refPath] == viewer._id) {

    }
    rp.args.record.createdAt = Date.now();
    // run updateById resolver
    return next(rp);
  }
  Promise.reject('invalid refPath');
});
