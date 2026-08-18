import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { changePassword, getUserById } from '../services/userService';

export const UserAccountPage = () => {
    const { id } = useParams();

    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageBgColor, setMessageBgColor] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserById(id!);
            setEmail(user.email);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (checkNewPassword(newPassword, confirmNewPassword)) {
            try {
                await changePassword(id!, oldPassword, newPassword);
                setMessage('Password changed successfully!');
                setMessageBgColor('bg-green-500');
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
            catch (e) {
                console.error(e);
            }
        }
    };

    const checkNewPassword = (newPassword: string, confirmNewPassword: string):
        boolean => {
        if (newPassword !== confirmNewPassword) {
            setMessage(`'Confirm New Password' must equal to 'New Password'! Try again!`);
            setMessageBgColor('bg-red-500');
            return false;
        }
        return true;
    }

    return (
        <section className="p-8 flex flex-col gap-4">

            <div className="border p-4 flex flex-col gap-2 items-center text-center">
                <div className="flex flex-col w-full md:w-1/2">
                    <label>Email</label>
                    <input
                        className="border rounded bg-gray-50 p-2 text-center"
                        type="text"
                        value={email}
                        readOnly />
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                    <label>User Id</label>
                    <input
                        className="border rounded bg-gray-50 p-2 text-center"
                        type="text"
                        value={id}
                        readOnly />
                </div>
            </div>

            <form onSubmit={handleSubmit}
                className="border p-4 flex flex-col gap-2 items-center text-center">
                <div className="flex flex-col w-full md:w-1/2">
                    <label>Old Password</label>
                    <input
                        className="border rounded p-2 text-center"
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)} />
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                    <label>New Password</label>
                    <input
                        className="border rounded p-2 text-center"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)} />
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                    <label>Confirm New Password</label>
                    <input
                        className="border rounded p-2 text-center"
                        type="password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)} />
                </div>

                <span className={`${messageBgColor} text-white p-2`}>{message}</span>

                <button type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Change Password
                </button>
            </form>

        </ section>
    );
};