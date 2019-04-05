import express  from "express";
import bodyParser  from "body-parser";
import session  from "express-session";
import cors  from "cors";
import errorhandler  from "errorhandler";
import ENV from 'dotenv';
import models from './models';

ENV.config();

const isProduction = process.env.NODE_ENV === "production";
const sequelize = models.sequelize;

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

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

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

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
// no stack traces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

// Create or Update database tables and start the server

sequelize.sync().then(() => {
    const server = app.listen(process.env.PORT || 3000, function() {
        console.log("Listening on port " + server.address().port);
    });
});

