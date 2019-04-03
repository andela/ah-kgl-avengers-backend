import express from 'express';
<<<<<<< HEAD
=======
import { resolve } from 'dns';
import { rejects } from 'assert';
>>>>>>> [start #165020195] set up babel for transpiling es6 to es65

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
<<<<<<< HEAD

// setting up the root enpoint for the testing
app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to Authors Haven'})
})

// setting the port to run at 3000 if there is no other port set on the environment
=======

app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to Authors Haven'})
})
>>>>>>> [start #165020195] set up babel for transpiling es6 to es65
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App running at PORT ${PORT}`));

<<<<<<< HEAD
// export the app to access the port into the test files
=======
>>>>>>> [start #165020195] set up babel for transpiling es6 to es65
export default app;
