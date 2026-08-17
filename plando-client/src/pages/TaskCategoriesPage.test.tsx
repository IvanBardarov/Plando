import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom';
import { TaskCategoriesPage } from './TaskCategoriesPage';
import {
    getTaskCategoriesByUserId,
    getTaskCategoryById,
    createTaskCategory,
    updateTaskCategory,
    deleteTaskCategory
} from '../services/taskCategoryService';

jest.mock('../services/taskCategoryService');

beforeEach(() => {
    (getTaskCategoriesByUserId as jest.Mock).mockResolvedValue([{
        id: '1',
        name: 'Test Category',
        description: 'Test Description',
        userId: '1',
        createdAt: new Date()
    }]);
    (getTaskCategoryById as jest.Mock).mockResolvedValue({});
    (createTaskCategory as jest.Mock).mockResolvedValue({
        id: '2',
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
    useNavigate: () => mockNavigate
}));

describe('TaskCategoriesPage', () => {

    it('should render task categories page correctly', async () => {
        await act(() => {
            render(<TaskCategoriesPage />);
        });

        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should call createTaskCategory correctly', async () => {
        const createTaskCategoryMock = createTaskCategory;
        await act(() => {
            render(<TaskCategoriesPage />);
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        });

        expect(createTaskCategoryMock).toHaveBeenCalled();
    });

    it('should call deleteTaskCategory correctly', async () => {
        const deleteTaskCategoryMock = deleteTaskCategory;
        await act(() => {
            render(<TaskCategoriesPage />);
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        });

        expect(deleteTaskCategoryMock).toHaveBeenCalled();
    });

    it('should navigate to task category detail page on click', async () => {
        await act(async () => {
            render(<TaskCategoriesPage />);
        });

        const categoryRow = await screen.findByText('Test Category');
        fireEvent.click(categoryRow);

        expect(mockNavigate).toHaveBeenCalledWith('/TaskCategories/1');
    });

});