import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TasksPage } from './TasksPage';

jest.mock('../services/taskItemService', () => ({
    getTaskItemByUserId: jest.fn().mockResolvedValue({
        items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 1
    }),
    createTaskItem: jest.fn().mockResolvedValue({}),
    completeTaskItem: jest.fn().mockResolvedValue({}),
    deleteTaskItem: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('../services/taskCategoryService', () => ({
    getTaskCategoriesByUserId: jest.fn().mockResolvedValue([])
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

describe('TasksPage', () => {

    it('should render correctly the tasks page', async () => {
        await act(async () => {
            render(<TasksPage />);
        });
        expect(screen.getByRole('button', { name: '▼ Create Task' }))
            .toBeInTheDocument();
    });

    it('should render correctly CreateTaskItemForm', async () => {
        await act(async () => {
            render(<TasksPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: '▼ Create Task' }));
        });
        expect(screen.getByRole('button', { name: 'Create' }))
            .toBeInTheDocument();
    });

    it('should render correctly FilterTaskItemsForm', async () => {
        await act(async () => {
            render(<TasksPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: '▼ Show Filter' }));
        });
        expect(screen.getByRole('button', { name: 'Filter' }))
            .toBeInTheDocument();
    });

    it('should navigate to /tasklists when Task List button clicked', async () => {
        await act(async () => {
            render(<TasksPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Task Lists' }));
        });
        expect(mockNavigate).toHaveBeenCalled();
    });

});