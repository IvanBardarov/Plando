import instance from './api';
import { TaskCategory, Guid } from '../types';

export const getTaskCategoriesByUserId = async() : Promise<TaskCategory[]> => {
    const response = await instance.get('/TaskCategories');
    return response.data;
};

export const getTaskCategoryById = async(id: Guid) : Promise<TaskCategory> => {
    const response = await instance.get(`/TaskCategories/${id}`);
    return response.data;
};

export const createTaskCategory = async(name: string, description: string) :
    Promise<TaskCategory> => {
    const response = await instance.post('/TaskCategories', { name, description });
    return response.data;
};

export const updateTaskCategory = async (id: Guid, name: string, description: string) :
    Promise<TaskCategory> => {
    const response = await instance.put('/TaskCategories', { id, name, description });
    return response.data;
}

export const deleteTaskCategory = async (id: Guid) : Promise<null> => {
    const response = await instance.delete(`/TaskCategories/${id}`);
    return response.data;
};