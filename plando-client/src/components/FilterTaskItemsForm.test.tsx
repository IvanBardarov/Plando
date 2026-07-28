import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterTaskItemsForm } from './FilterTaskItemsForm';

jest.mock('../services/taskItemService', () => ({
    createTaskItem: jest.fn().mockResolvedValue({}),
    getTaskItemByUserId: jest.fn().mockResolvedValue({
        items: [], totalCount: 0, page: 1, pageSize: 10, totalPage: 0
    })
}));

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

describe('FilterTaskItemsForm', () => {

    it('should render the toggle button', async () => {
        await act(async () => {
            render(<FilterTaskItemsForm onFilter={jest.fn()} onFiltersChange={jest.fn()} />);
        });
        expect(screen.getByText('▼ Show Filter')).toBeInTheDocument();
    });

    it('should shows form when button clicked', async () => {
        await act(async () => {
            render(<FilterTaskItemsForm onFilter={jest.fn()} onFiltersChange={jest.fn()} />);
        });
        fireEvent.click(screen.getByText('▼ Show Filter'));
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should call onFilter when submitted', async () => {
        const onFilterMock = jest.fn();
        const onFiltersChangeMock = jest.fn();
        await act(async () => {
            render(<FilterTaskItemsForm 
                onFilter={onFilterMock}
                onFiltersChange={onFiltersChangeMock} />);
        });
        fireEvent.click(screen.getByText('▼ Show Filter'));
        await act(async () => {
            fireEvent.submit(screen.getByRole('form', { name: 'filter-tasks-form' }));
        });

        expect(onFilterMock).toHaveBeenCalled();
        expect(onFiltersChangeMock).toHaveBeenCalled();
    });
});