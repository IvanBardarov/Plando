import { useState } from 'react';
import { login } from '../services/userService';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label>User</label>
            <input type="email" onChange={e => setEmail(e.target.value)}/>
            <label>Password</label>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
        </form>
    );
};