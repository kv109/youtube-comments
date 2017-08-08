module.exports = (data) => {
  const error = data.error;
  if (error === "TokenExpiredError") {
    alert('Your session has expired, please sign in again.')
  } else {
    console.log(data);
  }
};
