import passport from 'passport';

export default {
  // Use checkToken when the token is mandatory i.e: the route is protected
  checkToken: (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      // setting the user information to be accessed on req object as req.user
      req.user = user;
      if (err) {
        return res.status(520).send({ error: { body: [err.message] } });
      }
      // check if token is in headers and if not return related customized errors
      if (!user) {
        const status = info.message === 'user does not exist' ? 404 : 401;
        return res.status(status).send({
          status,
          error: info.message
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
        return res.status(520).send({ error: { body: [err.message] } });
      }
      return next();
    })(req, res, next);
  },

  verifyAdmin: (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      // accessing the user and check if user is an admin
      if (!user) {
        return res.status(401).send({
          status: 401,
          error: 'You are not authorized to make this request provide token'
        });
      }
      if (user.role !== 'super-admin' && user.role !== 'admin') {
        return res.status(401).send({
          status: 401,
          error: 'You are not authorized to make this request'
        });
      }
      if (err) {
        return res.status(520).send({ error: { body: [err.message] } });
      }
      return next();
    })(req, res, next);
  },

  verifySuperAdmin: (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      // accessing the user and check if user is an admin
      if (!user || user.role !== 'super-admin') {
        return res.status(401).send({
          status: 401,
          error: 'You are not authorized to make this request provide token'
        });
      }
      if (err) {
        return res.status(520).send({ error: { body: [err.message] } });
      }
      return next();
    })(req, res, next);
  }
};
