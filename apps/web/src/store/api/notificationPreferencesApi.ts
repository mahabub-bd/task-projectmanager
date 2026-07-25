import { apiSlice } from './baseApi';

export interface NotificationPreference {
  id: number;
  user_id: number;
  organization_id: number;
  notification_type: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  reminder_hours: number;
  created_at: string;
  updated_at: string;
}

export const notificationPreferencesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query<NotificationPreference[], void>({
      query: () => ({
        url: '/notifications/preferences',
        method: 'GET',
      }),
      providesTags: ['NotificationPreferences'],
    }),
    updateNotificationPreference: builder.mutation({
      query: ({ type, ...data }) => ({
        url: `/notifications/preferences/${type}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),
  }),
});

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferenceMutation,
} = notificationPreferencesApi;
