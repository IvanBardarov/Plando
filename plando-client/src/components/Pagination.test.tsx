import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskItem, PagedResultDto, FilterValues } from '../types';
import { Pagination } from './Pagination';

const mockTaskItems: PagedResultDto<TaskItem> = {
    items: [],
    totalCount: 20,
    page: 1,
    pageSize: 10,
    totalPages: 2
};

const mockFilters: FilterValues = {
    taskListId: null,
    title: null,
    description: null,
    createdAtFrom: null,
    createdAtTo: null,
    dueDateFrom: null,
    dueDateTo: null,
    completedAtFrom: null,
    completedAtTo: null,
    isCompleted: null,
    page: null,
    pageSize: null
};

jest.mock('../services/taskItemService', () =>({
    getTaskItemByUserId: jest.fn().mockResolvedValue({
        items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0
    })
}));

describe('Pagination', () => {

    it('should render Pagination component', async () => {
        await act(async () => {
            render(<Pagination
                taskItems={mockTaskItems}
                filters={mockFilters}
                onPageChange={jest.fn()} />);
        });
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should disable Previous button if the current page is the first one', async () => {
        await act(async () => {
            render(<Pagination
                taskItems={mockTaskItems}
                filters={mockFilters}
                onPageChange={jest.fn()} />);
        });
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    it('should disable Next button if the current page is the last one', async () => {
        const lastPageTaskItems = { ...mockTaskItems, page: 2 };
        await act(async () => {
            render(<Pagination
                taskItems={lastPageTaskItems}
                filters={mockFilters}
                onPageChange={jest.fn()} />);
        });
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should display the correct numbers of the pages', async () => {
        await act(async () => {
            render(<Pagination
                taskItems={mockTaskItems}
                filters={mockFilters}
                onPageChange={jest.fn()} />);
        });
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    });

    it('should call onPageChange after page click', async () => {
        const onPageChangeMock = jest.fn();
        await act(async () => {
            render(<Pagination
                taskItems={mockTaskItems}
                filters={mockFilters}
                onPageChange={onPageChangeMock} />);
        });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', {name: '1'}));
        });        
        expect(onPageChangeMock).toHaveBeenCalled();
    });
});