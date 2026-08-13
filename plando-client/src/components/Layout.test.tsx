import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Layout } from '../components/Layout';

jest.mock('react-router-dom', () => ({
    Link: ({ children, to, title }: { children: React.ReactNode, to: string, title: string }) => 
        <a href={to} title={title}>{children}</a>,
    Outlet: () => <div>Outlet</div>
}));

describe('Layout', () => {

    it('should render Layout page correctly', async () => {
        await act(() => {
            render(<Layout />);
        });
        expect(screen.getByTitle('Tasks')).toBeInTheDocument();
    });

});