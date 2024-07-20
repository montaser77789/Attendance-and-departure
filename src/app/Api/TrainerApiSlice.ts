import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TrainerApiSlice = createApi({
  tagTypes: ['Trainers'],
  reducerPath: 'TrainerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-endpoint' }), 
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => '/trainers',
    }),

    getTrainersById: builder.query({
      query: (id) => `/trainers/${id}`,
    }),

    createTrainer: builder.mutation({
      query: (body) => ({
        url: '/trainers',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetTrainersQuery, useGetTrainersByIdQuery, useCreateTrainerMutation } = TrainerApiSlice;
