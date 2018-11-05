// Remove and delete id of relationship document to the viewer/Self
module.exports = ({ field, TC }) => TC.get('$removeById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { args, viewer, scope } = rp;
  if (viewer) {
    const _field = viewer[field];
    if (Array.isArray(_field)) {
      // check if relationship to be update is a member of _field array
      const exist = _field.find(fieldId => (fieldId == args._id));
      if (exist) {
        // delete document from db
        const result = await next(rp);
        // delete relationship id from sourcedocument
        viewer[field] = viewer[field].filter(e => e != result.recordId);
        try {
          await viewer.save();
          return result;
        } catch (e) {
          // Placeholder function to stop the field from saving to the db
          result.record.remove().exec();
          throw new Error(`Unexpected error adding the document to ${scope.toLowerCase()}`);
        }
      } else {
        throw new Error(`This ${scope.toLowerCase()} cannot delete this document`);
      }
    } else {
      throw new Error(`Field: ${field} is not a collection`);
    }
  }
});
