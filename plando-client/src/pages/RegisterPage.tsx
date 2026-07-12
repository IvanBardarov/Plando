import { useState } from 'react';
import { register } from '../services/userService';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        register(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <label>User</label>
            <input type="email" onChange={e => setEmail(e.target.value)}/>
            <label>Password</label>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
            <button type="submit">Register</button>
        </form>
    );
};