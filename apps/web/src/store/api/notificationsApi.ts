import { apiSlice } from './baseApi';

export interface Notification {
  id: number;
  user_id: number;
  organization_id: number;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data: Record<string, any> | null;
  related_entity_type: string | null;
  related_entity_id: number | null;
  action_url: string | null;
  read_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
}

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),

    getUnreadNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: '/notifications?unreadOnly=true',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),

    getNotification: builder.query<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Notification', id }],
    }),

    getUnreadCount: builder.query<number, void>({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),

    markAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useGetNotificationQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
