import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from './Sidebar';

jest.mock('react-router-dom', () => ({
    Link: ({ children, to, title }: { children: React.ReactNode, to: string, title: string }) => 
        <a href={to} title={title}>{children}</a>
}));

describe ('Sidebar', () => {

    it('should render sidebar correctly', async() => {
        await act(() => {
            render(<Sidebar />);
        });

        expect(screen.getByTitle('Account')).toBeInTheDocument();
    });

});