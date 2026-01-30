import { request, ApiError } from './apiClient.js';

const BASE_PATH = '/lists';

export { ApiError };

// POST /lists/:listId/comments
export const createComment = async (listId, commentFormData) => {
  return await request(`${BASE_PATH}/${listId}/comments`, {
    method: 'POST',
    body: commentFormData, // expected shape: { text: "..." }
  });
};

// PUT /lists/:listId/comments/:commentId
export const updateComment = async (listId, commentId, text) => {
  return await request(`${BASE_PATH}/${listId}/comments/${commentId}`, {
    method: 'PUT',
    body: { text },
  });
};

// DELETE /lists/:listId/comments/:commentId
export const deleteComment = async (listId, commentId) => {
  return await request(`${BASE_PATH}/${listId}/comments/${commentId}`, {
    method: 'DELETE',
  });
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
