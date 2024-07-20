import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const playersApiSlice = createApi({
  tagTypes: ['Players'],
  reducerPath: 'playersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'your_api_base_url_here' }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => '/',
      providesTags: ['Players'],
    }),
    getPlayersById: builder.query({
      query: (id) => `/show/${id}`,
      providesTags: ['Players'],
    }),
    createPlayer: builder.mutation({
      query: (playerFormData) => ({
        url: '/players',
        method: 'POST',
        body: playerFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
    updatePlayer: builder.mutation({
      query: ({ id, ...player }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: player,
      }),
      invalidatesTags: ['Players'],
    }),
    deletePlayer: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Players'],
    }),
  }),
});

export const {
  useGetPlayersQuery,
  useGetPlayersByIdQuery,
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
} = playersApiSlice;
