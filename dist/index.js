import express from 'express';
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello, this is Express + TypeScript');
});
app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
