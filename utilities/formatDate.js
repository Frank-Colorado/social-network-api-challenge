const { DateTime } = require("luxon");

// This is a helper function called formatDate that will format a date to be more readable using the luxon library
const formatDate = (date) => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
};

module.exports = { formatDate };
