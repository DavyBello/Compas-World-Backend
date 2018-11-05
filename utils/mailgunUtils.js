const isUnavailable = !process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN;

module.exports = {
  isUnavailable,
  checkMailgun: () => {
    if (isUnavailable) {
      console.log(`
----------------------------------------
WARNING: MISSING MAILGUN CREDENTIALS
----------------------------------------
You have opted into email sending but have not provided
mailgun credentials. Attempts to send will fail.

Create a mailgun account and add the credentials to the .env file to
set up your mailgun integration
`);
    }
  },
};
