import '../../styles/pages/member/MemberRegister.css';

import React, { useState } from 'react';
import axios from 'axios';

const MemberRegister = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/register', { id, pw, name, phone, email, birth, gender });
            setSuccess('Registration successful!');
        } catch (err) {
            setError(err.response.data || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Member Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Birthdate:</label>
                    <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} required />
                </div>
                <div>
                    <label>Gender:</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="W">Female</option>
                    </select>
                </div>
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default MemberRegister;