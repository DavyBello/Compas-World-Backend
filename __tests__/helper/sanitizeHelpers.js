const { Types: { ObjectId } } = require('mongoose');

// const * as loaders = require('../src/loader');

// @TODO Make those two functions a separated npm package.
function sanitizeValue(value, field, keysToFreeze) {
  // If this current field is specified on the `keysToFreeze` array, we simply redefine it
  // so it stays the same on the snapshot
  if (field && keysToFreeze.indexOf(field) !== -1) {
    return `FROZEN-${field.toUpperCase()}`;
  }

  // Check if value is boolean
  if (typeof value === 'boolean') {
    return value;
  }

  // If value is falsy, return `EMPTY` value so it's easier to debug
  if (!value && value !== 0) {
    return 'EMPTY';
  }

  // Check if it's not an array and can be transformed into a string
  if (!Array.isArray(value) && typeof value.toString === 'function') {
    // Remove any non-alphanumeric character from value
    const cleanValue = value.toString().replace(/[^a-z0-9]/gi, '');

    // Check if it's a valid `ObjectId`, if so, replace it with a static value
    if (ObjectId.isValid(cleanValue) && value.toString().indexOf(cleanValue) !== -1) {
      return value.toString().replace(cleanValue, 'ObjectId');
    }
  }

  // if it's an array, sanitize the field
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, null, keysToFreeze));
  }

  // If it's an object, we call sanitizeTestObject function again to handle nested fields
  if (typeof value === 'object') {
    // eslint-disable-next-line no-use-before-define
    return sanitizeTestObject(value, keysToFreeze);
  }

  return value;
}

/**
 * Sanitize a test object removing the mentions of a `ObjectId` from Mongoose and also
 *  stringifying any other object into a valid, "snapshotable", representation.
 */
function sanitizeTestObject(payload, keysToFreeze, ignore) {
  return Object.keys(payload).reduce((sanitizedObj, field) => {
    if (ignore.indexOf(field) !== -1) {
      return sanitizedObj;
    }

    const value = payload[field];
    const sanitizedValue = sanitizeValue(value, field, keysToFreeze);

    return {
      ...sanitizedObj,
      [field]: sanitizedValue,
    };
  }, {});
}

module.exports = {
  sanitizeTestObject
};
