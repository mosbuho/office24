import '../../styles/pages/manager/ManagerLogin.css';
import React, { useState } from 'react';
import axios from 'axios';

const ManagerLogin = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/manager/login', { id, pw });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div>
            <h2>Manager Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default ManagerLogin;