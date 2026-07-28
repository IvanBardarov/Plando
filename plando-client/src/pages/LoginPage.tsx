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
        
        navigate('/tasks');
    };

    return (
        <form onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center min-h-screen">
            <h1>Login</h1>
            <label>User</label>
            <input 
                className="border rounded p-2 w-full"
                type="email" onChange={e => setEmail(e.target.value)}/>
            <label>Password</label>
            <input 
                className="border rounded p-2 w-full"
                type="password" onChange={e => setPassword(e.target.value)}/>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                type="submit">Login</button>
        </form>
    );
};