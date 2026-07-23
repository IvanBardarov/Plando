import instance from "./api";
import { TaskList, Guid, TaskListColor } from "../types";

export const getTaskListByUserId = async () : Promise<TaskList[]> => {
    const response = await instance.get(`/TaskLists`);
    return response.data;
};

export const createTaskList = async (name: string, userId: Guid, color: TaskListColor) : 
Promise<TaskList> => {
    const response = await instance.post('/TaskLists', { name, userId, color });
    return response.data;
};

export const deleteTaskList = async (id: Guid) : Promise<null> => {
    const response = await instance.delete(`/TaskLists/${id}`);
    return response.data;
};