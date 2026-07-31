import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskListsPage } from './TaskListsPage';

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([]),
    createTaskList: jest.fn().mockReturnValue([])
})
);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

describe('TaskListsPage', () => {

    it('should render correctly task lists page', async () => {
        await act(async () => {
            render(<TaskListsPage />);
        });
        expect(screen.getByRole('button', { name: '▼ Create List' })).toBeInTheDocument();
    });

    it('should show create list form when Create button is clicked', async () => {
        await act(async () => {
            render(<TaskListsPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: '▼ Create List' }));
        });
        expect(screen.getByRole('button', { name: 'Create' }));
    });

    it('should navigate to /tasks when Tasks button is cliked', async () => {
        await act(async () => {
            render(<TaskListsPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Tasks' }));
        });
        expect(mockNavigate).toHaveBeenCalled();
    });

});