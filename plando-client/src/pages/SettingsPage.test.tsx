import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom';
import { SettingsPage } from './SettingsPage';

jest.mock('react-router-dom', () => ({
    Link: ({ children, to, title }: { children: React.ReactNode, to: string, title: string }) => 
        <a href={to} title={title}>{children}</a>
}));

describe('SettingsPage', () => {

    it('should render settings page correctly', async () => {
        await act(() => {
            render(<SettingsPage />);
        });

        expect(screen.getByText('Task Categories')).toBeInTheDocument();
        expect(screen.getByText('Color Themes')).toBeInTheDocument();        
    });

});