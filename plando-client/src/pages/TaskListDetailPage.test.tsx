import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getTaskListByUserId, getTaskListById, updateTaskList, deleteTaskList } from '../services/taskListService';
import { TaskListDetailPage } from './TaskListDetailPage';

jest.mock('../services/taskListService');

beforeEach(() => {
    (getTaskListByUserId as jest.Mock).mockResolvedValue([]);
    (getTaskListById as jest.Mock).mockResolvedValue({
        id: 'test-list-id',
        name: 'Test List',
        color: 0,
        createdAt: new Date(),
        userId: '1',
        taskItems: []
    });
    (updateTaskList as jest.Mock).mockResolvedValue({
        id: 'test-list-id',
        name: 'Test List',
        color: 0,
        createdAt: new Date(),
        userId: '1',
        taskItems: []
    });
    (deleteTaskList as jest.Mock).mockResolvedValue({});
});


jest.mock('../services/taskItemService', () => ({
    getTaskItemByUserId: jest.fn().mockResolvedValue({
        items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 1
    }),
    completeTaskItem: jest.fn().mockResolvedValue({}),
    deleteTaskItem: jest.fn().mockResolvedValue({})
}));

jest.mock('react-router', () => ({
    useParams: () => ({ id: 'test-list-id' })
}));

jest.mock('../services/taskCategoryService', () => ({
    getTaskCategoriesByUserId: jest.fn().mockResolvedValue([])
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

    it('should render update task list form correctly', async () => {
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        expect(screen.getByRole('button', { name: 'Update Task List' })).toBeInTheDocument();
    });

    it('should call updateTaskList correctly', async () => {
        const updateTaskListMock = updateTaskList;
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Update Task List' }));
        });
        expect(updateTaskListMock).toHaveBeenCalled();
    });

    it('should call deleteTaskList correctly', async () => {
        const deleteTaskListMock = deleteTaskList;
        await act(async () => {
            render(<TaskListDetailPage />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Delete Task List' }));
        });
        expect(deleteTaskListMock).toHaveBeenCalled();
    });

});