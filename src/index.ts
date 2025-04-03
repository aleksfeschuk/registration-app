import express from 'express';
import pool from './db';

import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(express.json());

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



app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );
        res.status(201).send('User registered successfully!');
    } catch (error: any) {
        console.error('Registration error:', error.message);
        if (error.code = '23505') {
            res.status(400).send('Registration failed');
        } else {
            res.status(400).send('Registration failed: ' + error.message);
        }
        console.error(error);
    }
});

