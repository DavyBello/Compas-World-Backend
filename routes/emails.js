const keystone = require('keystone');

const router = keystone.express.Router();

const User = keystone.list('User').model;

const routes = {
  '/user-activation': async (req, res) => {
    const user = await User.findOne();
    const { html } = await user.getVerificationEmail().render();
    res.send(html);
  },
  '/user-reset-password': async (req, res) => {
    const user = await User.findOne();
    const { html } = await user.getPasswordResetLinkEmail().render();
    res.send(html);
  },
};

/* higher order function */
const handlerException = fn => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (e) {
    next(e);
  }
};

Object.entries(routes).forEach(([key, value]) => router.get(key, handlerException(value)));

// router
module.exports = router;
