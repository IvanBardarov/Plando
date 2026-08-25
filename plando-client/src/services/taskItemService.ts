import instance from "./api";
import { TaskItem, Guid, PagedResultDto } from "../types";

export const getTaskItemsWithoutPaginationByUserId = async (dateFrom: Date | null, dateTo: Date | null):
Promise<TaskItem[] | null> => {
    const response = await instance.get(`/TaskItems/WithoutPagination`, {
        params: { dateFrom, dateTo }
    });
    return response.data;
}

export const getTaskItemByUserId = async (
    taskListId: Guid | null,
    title: string | null, description: string | null,
    createdAtFrom: Date | null, createdAtTo: Date | null,
    dueDateFrom: Date | null, dueDateTo: Date | null,
    completedAtFrom: Date | null, completedAtTo: Date | null,
    isCompleted: boolean | null, page: number | null, pageSize: number | null)
    : Promise<PagedResultDto<TaskItem>> => {
    const response = await instance.get(`/TaskItems`, {
        params: {
            taskListId,
            title,
            description,
            createdAtFrom,
            createdAtTo,
            dueDateFrom,
            dueDateTo,
            completedAtFrom,
            completedAtTo,
            isCompleted,
            page,
            pageSize
        }
    });
    return response.data;
};

export const createTaskItem = async (title: string, description: string, userId: Guid,
    dueDate: Date, taskListId: Guid | null, startDate: Date | null, categoryId: Guid | null,
    isImportant: boolean, isUrgent: boolean):
    Promise<TaskItem> => {
    const response = await instance.post('/TaskItems',
        {
            title, description, userId, dueDate, taskListId,
            startDate, categoryId, isImportant, isUrgent
        });
    return response.data;
};

export const completeTaskItem = async (id: Guid): Promise<TaskItem> => {
    const response = await instance.put(`/TaskItems/${id}/complete`);
    return response.data;
};

export const deleteTaskItem = async (id: Guid): Promise<null> => {
    const response = await instance.delete(`/TaskItems/${id}`);
    return response.data;
};

export const getTaskItemById = async (id: Guid): Promise<TaskItem> => {
    const response = await instance.get(`/TaskItems/${id}/details`);
    return response.data;
};

export const updateTaskItem = async (id: Guid, title: string, description: string,
    startDate: Date | null, dueDate: Date, taskListId: Guid | null, categoryId: Guid | null,
    isImportant: boolean, isUrgent: boolean):
    Promise<TaskItem> => {
    const response = await instance.put(`/TaskItems/${id}`,
        {
            id, title, description, startDate, dueDate,
            taskListId, categoryId, isImportant, isUrgent
        }
    );
    return response.data;
};