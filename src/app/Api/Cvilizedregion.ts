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
          

       



    })

  
    
})

export const { useCreateMonthMutation, 
     useGetManthesQuery , useCreateDayesMutation , usePlyerAttendanceMutation
  
    } = CvilizedregionApi




