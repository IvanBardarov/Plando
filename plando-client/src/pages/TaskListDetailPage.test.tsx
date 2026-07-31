import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskListDetailPage } from './TaskListDetailPage';

jest.mock('../services/taskItemService', () => ({
    getTaskItemByUserId: jest.fn().mockResolvedValue({
        items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 1
    }),
    completeTaskItem: jest.fn().mockResolvedValue({}),
    deleteTaskItem: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('react-router', () => ({
    useParams: () => ({ id: 'test-list-id' })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

describe('TaskListDetailPage', () => {

    it('should render correctly task list detail page', async () => {
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        expect(screen.getByRole('button', { name: '▼ Create Task' })).toBeInTheDocument();
    });

    it('should render CreateTaskItemForm', async () => {
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: '▼ Create Task' }));
        });
        expect(screen.getByRole('button', { name: 'Create' }));
    });

    it('should render FilterTaskItemsForm', async () => {
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: '▼ Show Filter' }));
        });
        expect(screen.getByRole('button', { name: 'Filter' }));
    });

});