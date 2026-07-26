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

        return (
            <div className="flex gap-2 items-center justify-center mt-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={taskItems?.page === 1}
                    onClick={() => handlePageChange(taskItems!.page - 1)}>
                    Previous
                </button>
                <span>{taskItems?.page} / {taskItems?.totalPages}</span>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={taskItems?.page === taskItems?.totalPages}
                    onClick={() => handlePageChange(taskItems!.page + 1)}>
                    Next
                </button>
            </div>
        );
    };