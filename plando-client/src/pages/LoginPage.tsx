import { useState } from 'react';
import { login } from '../services/userService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken{
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
};

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const token = await login(email, password);
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        localStorage.setItem('userId', userId);
        
        navigate('/dashboard');
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