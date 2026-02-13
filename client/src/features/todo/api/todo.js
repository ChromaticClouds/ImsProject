// @ts-check

/**
 * Node modules
 */
import { api, hooks } from '@/services/api.js';

/**
 * @returns {Promise<TodoResponse[]>}
 */
export const fetchTodos = () => 
    api.get('todo/list', { hooks }).json();

/**
 * @param {number | string} id
 * @returns {Promise<TodoResponse>}
 */
export const fetchTodoById = (id) => 
    api.get(`todo/${id}`, { hooks }).json();

/**
 * @param {number | string} id
 * @returns {Promise<ActionResponse>}
 */
export const deleteTodo = (id) => 
    api.delete(`todo/${id}`, { hooks }).json();

/**
 * @param {number | string} id
 * @returns {Promise<ActionResponse>}
 */
export const toggleTodoStatus = (id) => 
    api.patch(`todo/${id}/toggle`, { hooks }).json();

/**
 * @param {number | string} id
 * @param {TodoUpdatePayload} payload
 * @returns {Promise<ActionResponse>}
 */
export const updateTodo = (id, payload) => 
    api.put(`todo/${id}`, { json: payload, hooks }).json();