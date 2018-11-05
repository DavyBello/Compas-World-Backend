// Create and add id of relationship document to the viewer/Self
module.exports = ({ field, TC }) => TC.get('$createOne').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { viewer, scope } = rp;
  if (viewer) {
    const _field = viewer[field];
    if (Array.isArray(_field)) {
      // add field to db and get result of createOne resolver
      rp.args.record.owner = viewer._id;
      const result = await next(rp);
      viewer[field].push(result.recordId);
      try {
        await viewer.save();
        return result;
      } catch (e) {
        // Placeholder function to stop the field from saving to the db
        result.record.remove().exec();
        throw new Error(`Unexpected error adding the document to ${scope.toLowerCase()}`);
      }
    } else {
      throw new Error(`Field: ${field} is not a collection`);
    }
  }
});
