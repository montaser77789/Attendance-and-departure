import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
const token = Cookies.get('access_token');

export const TrainerApiSlice = createApi({
  tagTypes: ['Trainers'],
  reducerPath: 'TrainerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pro1-4zoz.onrender.com' }), 
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => ({
      url:  '/app/user/admin/get_all_coach',
      headers: {
        Authorization: token
      },
      })
    }),

    getTrainerById: builder.query({
      query: (id) =>({
        url: `/app/user/admin/get_coach/${id}`,
        headers: {
          Authorization: token
        },
      }),

    }),

    createTrainer: builder.mutation({
      query: (body) => ({
        url: '/app/user/create_coach',
        method: 'POST',
        body,
      }),
    }),

    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/app/user/delete_player/${id}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(), 

        headers: {
          Authorization: token
        },
      }),
      invalidatesTags: ['Trainers'], // Invalidate the cache to trigger a refetch
    }),
  }),
});

export const { useGetTrainersQuery, useGetTrainerByIdQuery, useDeleteTrainerMutation , useCreateTrainerMutation } = TrainerApiSlice;
