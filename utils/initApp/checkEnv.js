// check for environment variables
module.exports = (envVariables) => {
  envVariables.forEach(envVariable => !process.env[envVariable] && console.log(`
----------------------------------------
WARNING: MISSING ${envVariable} CREDENTIALS
----------------------------------------
`));
};
