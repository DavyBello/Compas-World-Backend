module.exports = ({ field, TC }) => TC.get('$updateById').wrapResolve(next => async (rp) => {
  // get viewer from resolveParams (rp)
  const { args, viewer, scope } = rp;
  const _field = viewer[field];
  if (Array.isArray(_field)) {
    // check if relationship to be update is a member of _field array
    const exist = _field.find(fieldId => (fieldId == args.record._id));
    if (exist) {
      // add field to db and get result of createOne resolver
      const result = await next(rp);
      return result;
    }
    throw new Error(`This ${scope.toLowerCase()} cannot edit this field`);
  } else {
    throw new Error(`Field: ${field} is not an collection field`);
  }
});
