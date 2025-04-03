'use strict';

document.getElementById('registerForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const form = document.getElementById('registerForm');

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`Registration failed: ${response.statusText}`);
        }

        const result = await response.text();
        messageElement.textContent = result;
        messageElement.style.color = 'green';
        form.reset();
    } catch (error) {
        messageElement.textContent = error.message;
        messageElement.style.color = 'red';
    }
});

