import instance from "./api";
import { Guid, Note } from "../types";

export const getNotesByTaskItemId = async (taskItemId: Guid): Promise<Note[]> => {
    const response = await instance.get('/Notes', { params: { taskItemId } });
    return response.data;
}

export const getNoteById = async (id: Guid): Promise<Note> => {
    const response = await instance.get(`/Notes/${id}`);
    return response.data;
}

export const createNote = async (content: string, taskItemId: Guid):
    Promise<Note> => {
    const response = await instance.post('/Notes', { content, taskItemId });
    return response.data;
}

export const updateNote = async (id: Guid, content: string): Promise<Note> => {
    const response = await instance.put('/Notes', { id, content });
    return response.data;
}

export const deleteNote = async (id: Guid):
    Promise<null> => {
    const response = await instance.delete(`/Notes/${id}`);
    return response.data;
}