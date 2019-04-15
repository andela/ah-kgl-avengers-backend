import express from 'express';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import ENV from 'dotenv';
import passport from 'passport';
import models from './models';
import routes from './routes';
import './config/passport';

ENV.config();

const isProduction = process.env.NODE_ENV === 'production';
const { sequelize } = models;

// create global app object
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// initialize the passport
app.use(passport.initialize());

if (!isProduction) {
  app.use(errorhandler());
}

app.use(routes);

// setting up the root enpoint for the testing
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Authors Haven' });
});

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    if (err.message === 'Failed to fetch user profile') {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: `${err.message}, please check your connection`,
        }
      });
    }

    if (err.message === 'Invalid Credentials') {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: `${err.message}, access denied, please sign in again`,
        }
      });
    }
    next();
  });
}

// production error handler
// no stack traces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
  next();
});

// Create or Update database tables and start express server
sequelize.sync().then(() => {
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
});

export default app;
