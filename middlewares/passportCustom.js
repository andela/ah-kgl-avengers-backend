import passport from 'passport';

// create a middleware for passport error handling using passport callbacks
const checkToken = ({ isToken = true } = {}) => (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    // setting the user information to be accessed as req.user
    req.user = user;
    if (err) {
      return res.status(520).send({ errorMessage: { body: [err.message] } });
    }
    // check if token is in headers and if not return related customized errors
    if (!user && isToken) {
      const status = info.message === 'user does not exist' ? 404 : 401;
      return res.status(status).send({
        status,
        errorMessage: info.message
      });
    }

    return next();
  })(req, res, next);
};

export default checkToken;
