const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const VALID_SORT_FIELDS = ['title', 'createdAt', 'updatedAt'];
const VALID_ORDERS = ['asc', 'desc'];

module.exports = { isNonEmptyString, VALID_SORT_FIELDS, VALID_ORDERS };