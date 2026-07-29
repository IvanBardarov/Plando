import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginPage } from './LoginPage';

jest.mock('../services/userService', () => ({
    login: jest.fn().mockResolvedValue('fake-jwt-token')
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

jest.mock('jwt-decode', () => {
    return {
        jwtDecode: () => ({
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "test-user-id"
        })
    };
});

describe('LoginPage', () => {

    it('should render correctly login page', async () => {
        await act(
            async () => {
                render(<LoginPage />);
            });
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('should calls login when submitted', async () => {
        const { login } = require('../services/userService');
        await act(async () => {
            render(<LoginPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Login' }));
        });
        expect(login).toHaveBeenCalled();
    });

    it('should navigate to /tasks after successful login', async () => {        
        await act(async () => {
            render(<LoginPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Login' }));
        });
        expect(mockNavigate).toHaveBeenCalled();
    });

});