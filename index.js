import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import errorhandler from 'errorhandler';

const isProduction = process.env.NODE_ENV === "production";

// create global app object
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "authorshaven",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

if (!isProduction) {
    app.use(errorhandler());
}

// setting up the root enpoint for the testing
app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to Authors Haven'})
})

/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

// setting the port to run at 3000 if there is no other port set on the environment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App running at PORT ${PORT}`));

// export the app to access the port into the test files
export default app;
