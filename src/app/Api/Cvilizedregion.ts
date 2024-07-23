import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

const token = Cookies.get("access_token");
export const    CvilizedregionApi = createApi({
    tagTypes: ["Cvilizedregions"],
    reducerPath: "CvilizedregionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pro1-4zoz.onrender.com" }),
    endpoints: (builder) => ({ 
        createMonth:builder.mutation({
            query: (data)=>{
                return {
                    url: '/app/audience/create_month',
                    method: 'POST',
                    body: data,
                    headers: {
                        Authorization: token
                    },
                }
            }
        }),

        getManthes: builder.query({
            query: () => {
              return {
                url: 'app/audience/get_all_month',
                headers: {
                  Authorization: token
                },
               
              };
            }
          }),


          createDayes: builder.mutation({
            query: ({ id, data }) => ({
              url: `/app/audience/create_day/${id}`,
              method: 'POST',
              body: data,
              headers: {
                Authorization: token // Ensure token is correctly formatted
              },
            }),
          }),
          PlyerAttendance: builder.mutation({
            query: ({ dayId , monthId, player_ids }) => ({
              url: `/app/audience/audience_for_players/${monthId}/${dayId}`,
              method: 'POST',
              body: {
                player_ids: player_ids
              },
              headers: {
                Authorization: token // Ensure token is correctly formatted
              },
            }),
          }),

          TrainerAttendance: builder.mutation({
            query: ({ dayId , monthId, coach_ids }) => ({
              url: `/app/audience/admin/audience_for_coach/${monthId}/${dayId}`,
              method: 'POST',
              body: {
                coach_ids: coach_ids
              },
              headers: {
                Authorization: token 
              },
            }),
          }),

          getAudience: builder.query({
            query: ({ dayId , monthId }) => {
              return {
                url: `/app/audience/get_audience/${monthId}/${dayId}`,
                headers: {
                  Authorization: token
                },
               
              };
            }
          }),

          deleteDaye: builder.mutation({
            query: ({ dayId , monthId }) => ({
              url: `/app/audience/delete_day/${monthId}/${dayId}`,
              method: 'DELETE',
              responseHandler: (response) => response.text(), 
      
              headers: {
                Authorization: token
              },
            }),
          }),
          

          deleteMonth: builder.mutation({
            query: ({  monthId }) => ({
              url: `app/audience/delete_month/${monthId}`,
              method: 'DELETE',
              responseHandler: (response) => response.text(), 
      
              headers: {
                Authorization: token
              },
            }),
          }),
          

       



    })

  
    
})

export const { useCreateMonthMutation, 
     useGetManthesQuery , useCreateDayesMutation , usePlyerAttendanceMutation ,useTrainerAttendanceMutation,
     useGetAudienceQuery, useDeleteDayeMutation ,useDeleteMonthMutation
  
    } = CvilizedregionApi




