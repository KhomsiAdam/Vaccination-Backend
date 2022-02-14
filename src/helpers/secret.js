const {
  ADMIN_ACCESS_SECRET,
  USER_ACCESS_SECRET,
  ADMIN_REFRESH_SECRET,
  USER_REFRESH_SECRET,
} = process.env;

// Set access token secret key depending on role provided
const setAccessSecret = (role) => {
  let secret;
  switch (role) {
    case 'Admin':
      secret = ADMIN_ACCESS_SECRET;
      break;
    case 'User':
      secret = USER_ACCESS_SECRET;
      break;
    default:
      secret = USER_ACCESS_SECRET;
      break;
  }
  return secret;
};
// Set refresh token secret key depending on role provided
const setRefreshSecret = (role) => {
  let secret;
  switch (role) {
    case 'Admin':
      secret = ADMIN_REFRESH_SECRET;
      break;
    case 'User':
      secret = USER_REFRESH_SECRET;
      break;
    default:
      secret = USER_REFRESH_SECRET;
      break;
  }
  return secret;
};

module.exports = {
  setAccessSecret,
  setRefreshSecret,
};
