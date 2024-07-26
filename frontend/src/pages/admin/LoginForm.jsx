import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/register', { id: id, pw: pw }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', { id: id, pw: pw });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setMessage('Login successful');
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>JWT Authentication Example</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="id"
                />
                <input
                    type="pw"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="pw"
                />
                <button type="submit">Register</button>
            </form>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="id"
                />
                <input
                    type="pw"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="pw"
                />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default LoginForm;