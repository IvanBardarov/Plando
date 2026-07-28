import { getTaskItemByUserId } from '../services/taskItemService';
import {
    TaskItem,
    PagedResultDto,
    FilterValues
} from '../types';

interface PaginationProps {
    taskItems: PagedResultDto<TaskItem>;
    filters: FilterValues | null;
    onPageChange: (items: PagedResultDto<TaskItem>) => void;
}

export const Pagination =
    ({ taskItems, filters, onPageChange }: PaginationProps) => {
        const handlePageChange = async (newPage: number) => {
            const items = await getTaskItemByUserId(
                filters?.taskListId ?? null,
                filters?.title ?? null,
                filters?.description ?? null,
                filters?.createdAtFrom ?? null,
                filters?.createdAtTo ?? null,
                filters?.dueDateFrom ?? null,
                filters?.dueDateTo ?? null,
                filters?.completedAtFrom ?? null,
                filters?.completedAtTo ?? null,
                filters?.isCompleted ?? null,
                newPage,
                filters?.pageSize ?? null
            );
            onPageChange(items);
        };

        const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
            let result: (number | string)[] = [];
            if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++)
                    result.push(i);
            }
            else if (currentPage <= 4)
                result = [1, 2, 3, 4, "...", totalPages];
            else if (currentPage >= totalPages - 4)
                result = [
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                ];
            else
                result = [
                    1,
                    "...",
                    currentPage - 2,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    currentPage + 2,
                    "...",
                    totalPages
                ];

            return result;
        };

        return (
            <div className="flex gap-2 items-center justify-center mt-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={taskItems?.page === 1}
                    onClick={() => handlePageChange(taskItems!.page - 1)}>
                    Previous
                </button>
                {getPageNumbers(taskItems.page, taskItems.totalPages).map((page, index) => (
                    page === '...'
                        ? <span key={index}>...</span>
                        : <button
                            className={`${page === taskItems.page ? 'bg-blue-700' : 'bg-gray-500'} 
                            text-white px-4 py-2 rounded disabled:opacity-50`}
                            key={index}
                            onClick={() => handlePageChange(page as number)}>
                            {page}
                        </button>
                ))}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={taskItems?.page === taskItems?.totalPages}
                    onClick={() => handlePageChange(taskItems!.page + 1)}>
                    Next
                </button>
            </div>
        );
    };