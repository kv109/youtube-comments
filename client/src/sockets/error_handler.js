const Flash = require("../modules/flash");

module.exports = (data) => {
  const error = data.error;
  if (error === "TokenExpiredError") {
    Flash.display("Your session has expired, please sign in again.", "danger");
  } else {
    Flash.display(error, "danger");
  }
};
