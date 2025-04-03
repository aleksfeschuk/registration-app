import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import pool from './db';
import bcrypt from 'bcrypt';

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Server is running');
});

app.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Database connected! Current time: ${result.rows[0].now}`);
    } catch (error: any) {
        console.error('Database error in /:', error.message);
        res.status(500).send('Database connection failed');
    }
});

app.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).send('User registered successfully!');
    } catch (error: any) {
        console.error('Registration error:', error.message);
        if (error.code === '23505') {
            res.status(400).send('Username already exists');
            return;
        } else {
            res.status(400).send('Registration failed: ' + error.message);
            return;
        }
    }
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', error.message);
    res.status(500).send('Internal server error');
});

async function startServer() {
    try {
        await pool.query('SELECT NOW()');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err: any) {
        console.error('Failed to start server due to database error:', err.message);
        process.exit(1);
    }
}

startServer();


