import { apiSlice } from './baseApi';

export const tagsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: (params?: Record<string, string>) => ({
        url: '/tags',
        params,
      }),
      providesTags: ['Tag'],
    }),
    createTag: builder.mutation({
      query: (data: any) => ({
        url: '/tags',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
} = tagsApi;
