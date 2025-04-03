const express = require('express');
const app = express();
app.get('/test', (req, res) => res.send('Test'));
app.listen(3001, () => console.log('Running on port 3001'));