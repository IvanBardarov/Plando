import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom';
import { TaskCategoryDetailPage } from './TaskCategoryDetailPage';
import {
    getTaskCategoryById,
    updateTaskCategory,
    deleteTaskCategory
} from '../services/taskCategoryService';

jest.mock('../services/taskCategoryService');

beforeEach(() => {
    (getTaskCategoryById as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Category',
        description: 'Test Description',
        userId: '1',
        createdAt: new Date()
    });
    (updateTaskCategory as jest.Mock).mockResolvedValue({});
    (deleteTaskCategory as jest.Mock).mockResolvedValue({});
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' })
}));

describe('TaskCategoryDetailPage', () => {

    it('should render task category detail page correctly', async () => {
        await act(() => {
            render(<TaskCategoryDetailPage />);
        });

        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should call updateTaskCategory correctly', async () => {
        const createTaskCategoryMock = updateTaskCategory;
        await act(() => {
            render(<TaskCategoryDetailPage />);
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        });

        expect(createTaskCategoryMock).toHaveBeenCalled();
    });

    it('should call deleteTaskCategory correctly', async () => {
        const deleteTaskCategoryMock = deleteTaskCategory;
        await act(() => {
            render(<TaskCategoryDetailPage />);
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        });

        expect(deleteTaskCategoryMock).toHaveBeenCalled();
    });

});