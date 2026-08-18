import { useState } from 'react';
import { login } from '../services/userService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
};

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            className="flex flex-col items-center justify-center min-h-screen gap-2">

            <section
                className="border flex flex-col gap-2 w-full md:w-1/2 bg-gray-50">

                <div className="flex flex-col w-full items-center text-center mt-2">
                    <label>User</label>
                    <input
                        className="border rounded p-2 w-full md:w-1/2 text-center"
                        type="email" onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="flex flex-col w-full items-center text-center">
                    <label>Password</label>
                    <input
                        className="border rounded p-2 w-full md:w-1/2 text-center"
                        type="password" onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="flex flex-col w-full items-center text-center">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 mb-2 rounded"
                        type="submit">Login</button>
                </div>

            </section>

        </form>
    );
};