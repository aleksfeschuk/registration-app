'use strict';

document.getElementById('registerForm').addEventListener('submit', async(e) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.text();
    document.getElementById('message').textContent = result;
})