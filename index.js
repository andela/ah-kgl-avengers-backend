import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting up the root enpoint for the testing
app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to Authors Haven'})
})

// setting the port to run at 3000 if there is no other port set on the environment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App running at PORT ${PORT}`));

// export the app to access the port into the test files
export default app;
