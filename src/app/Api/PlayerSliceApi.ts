import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

export const playersApiSlice = createApi({
  tagTypes: ['Player'],
  reducerPath: 'playersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pro1-4zoz.onrender.com' }),
  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => {
        return {
          url: '/app/user/admin/get_all_player',
          headers: {
            Authorization: token
          },
         
        };
      }
    }),
    getPlayersById: builder.query({
      query: (id) =>({
        url: `/app/user/get_player/${id}`,
        headers: {
          Authorization: token
        },
      }),

    }),
    createPlayer: builder.mutation({
      query: (playerFormData) => ({
        url: '/app/user/create_player',
        method: 'POST',
        body: playerFormData,
        headers: {
          Authorization: token
        },
      }),
      invalidatesTags: ['Player'], // Invalidate the cache to trigger a refetch

    }),
    updatePlayer: builder.mutation({
      query: ({ id, ...player }) => ({
        url: `/app/user/edit_player/${id}`,
        method: 'PUT',
        body: player,
      }),
      invalidatesTags: ['Player'], // Invalidate the cache to trigger a refetch
    }),
    deletePlayer: builder.mutation({
      query: (id) => ({
        url: `/app/user/delete_player/${id}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(), 

        headers: {
          Authorization: token
        },
      }),
      invalidatesTags: ['Player'], // Invalidate the cache to trigger a refetch
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
