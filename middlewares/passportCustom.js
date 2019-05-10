import passport from 'passport';

export default {
  // Use checkToken when the token is mandatory i.e: the route is protected
  checkToken: (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      // setting the user information to be accessed on req object as req.user
      req.user = user;
      if (err) {
        return res.status(520).send({ errorMessage: { body: [err.message] } });
      }
      // check if token is in headers and if not return related customized errors
      if (!user) {
        const status = info.message === 'user does not exist' ? 404 : 401;
        return res.status(status).send({
          status,
          errorMessage: info.message
        });
      }

      return next();
    })(req, res, next);
  },
  // Use verifyToken When the token is optional
  verifyToken: (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      // setting the user information to be accessed as req.user
      if (user) {
        req.user = user;
      }
      if (err) {
        return res.status(520).send({ errorMessage: { body: [err.message] } });
      }
      return next();
    })(req, res, next);
  }
};
