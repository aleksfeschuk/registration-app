import express from 'express';
import pool from './db';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Database connected! Current time: ${result.rows[0].now}`);
    } catch (error) {
        res.status(500).send('Database connection failed');
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());

app.post('/register', async (req,res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(400).send('Registration failed');
        console.error(error);
    }
});

