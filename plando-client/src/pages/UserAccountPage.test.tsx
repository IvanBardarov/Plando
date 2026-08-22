import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { changePassword, getUserById } from '../services/userService';
import { UserAccountPage } from './UserAccountPage';

jest.mock('../services/userService');

beforeEach(() => {
    (getUserById as jest.Mock)
        .mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            createdAt: new Date(),
            taskItems: null,
            taskLists: null
        });
    (changePassword as jest.Mock).mockResolvedValue({});
});

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: '1' })
}));

describe('UserAccountPage', () => {

    it('should render correctly the user account page', async () => {
        await act(async () => {
            render(<UserAccountPage />);
        });
        expect(screen.getByRole('button', { name: 'Change Password' }))
            .toBeInTheDocument();
    });

    it('should call changePassword correctly', async () => {
        const changePasswordMock = changePassword;
        await act(async () => {
            render(<UserAccountPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));
        });
        expect(changePasswordMock).toHaveBeenCalled();
    })

});