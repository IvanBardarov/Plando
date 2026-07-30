import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterPage } from './RegisterPage';

jest.mock('../services/userService', () => ({
    register: jest.fn().mockResolvedValue({ email: 'test@plando.com', password: 'Test1234!' })
}));

describe('RegisterPage', () => {

    it('should render correctly register page', async () => {
        await act(() => {
            render(<RegisterPage />);
        });
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    it('should call register when submitted', async () => {
        const { register } = require('../services/userService');
        await act(() => {
            render(<RegisterPage />);
        });
        await act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Register' }));
        });
        expect(register).toHaveBeenCalled();
    });

});