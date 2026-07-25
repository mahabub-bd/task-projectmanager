import { apiSlice } from './baseApi';

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Task'],
    }),
    getTask: builder.query({
      query: (id: string) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: (data: any) => ({
        url: '/tasks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    deleteTask: builder.mutation({
      query: (id: string) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    // Task comments endpoints
    getTaskComments: builder.query({
      query: (taskId: string) => `/tasks/${taskId}/comments`,
      providesTags: (_result, _error, taskId) => [{ type: 'Comment', id: taskId }],
    }),
    createTaskComment: builder.mutation({
      query: ({ taskId, content, mentions }: { taskId: string; content: string; mentions?: number[] }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: { content, mentions },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    updateTaskComment: builder.mutation({
      query: ({ taskId, commentId, content }: { taskId: string; commentId: string; content: string }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    deleteTaskComment: builder.mutation({
      query: ({ taskId, commentId }: { taskId: string; commentId: string }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    likeTaskComment: builder.mutation({
      query: ({ taskId, commentId }: { taskId: string; commentId: string }) => ({
        url: `/tasks/${taskId}/comments/${commentId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    unlikeTaskComment: builder.mutation({
      query: ({ taskId, commentId }: { taskId: string; commentId: string }) => ({
        url: `/tasks/${taskId}/comments/${commentId}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Comment', id: taskId }, 'Task'],
    }),
    getTaskCommentLikes: builder.query({
      query: ({ taskId, commentId }: { taskId: string; commentId: string }) => ({
        url: `/tasks/${taskId}/comments/${commentId}/likes`,
      }),
      providesTags: (_result, _error, { commentId }) => [{ type: 'CommentLike', id: commentId }],
    }),
    assignUsersToTask: builder.mutation({
      query: ({ taskId, userIds, notes }: { taskId: string; userIds: number[]; notes?: string }) => ({
        url: `/tasks/${taskId}/assign`,
        method: 'POST',
        body: { user_ids: userIds, notes },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Task', id: taskId }, 'Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useLikeTaskCommentMutation,
  useUnlikeTaskCommentMutation,
  useGetTaskCommentLikesQuery,
  useAssignUsersToTaskMutation,
} = tasksApi;
