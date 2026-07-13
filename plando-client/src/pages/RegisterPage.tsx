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
        <form onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center min-h-screen">
            <h1>Register</h1>
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
                type="submit">Register</button>
        </form>
    );
};