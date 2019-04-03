import express from 'express';
import { resolve } from 'dns';
import { rejects } from 'assert';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({message: 'hello'})
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App running at PORT ${PORT}`));

export default app;
