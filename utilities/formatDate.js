const { DateTime } = require("luxon");

const formatDate = (date) => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
};

module.exports = { formatDate };
