import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { changePassword, getUserById } from '../services/userService';

export const UserAccountPage = () => {
    const { id } = useParams();

    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

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
            }
            catch (e) {
                console.error(e);
            }
        }
    };

    const checkNewPassword = (newPassword: string, confirmNewPassword: string):
        boolean => {
        if (newPassword !== confirmNewPassword) {
            setError(`'Confirm New Password' must equal to 'New Password'! Try again!`);
            return false;
        }
        return true;
    }

    return (
        <section>

            <div>
                <label>Email</label>
                <input
                    type="text"
                    value={email}
                    readOnly />

                <label>User Id</label>
                <input
                    type="text"
                    value={id}
                    readOnly />
            </div>

            <form onSubmit={handleSubmit}>
                <label>Old Password</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)} />

                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} />

                <label>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)} />

                <span>{error}</span>

                <button type="submit">
                    Change Password
                </button>
            </form>

        </ section>
    );
};