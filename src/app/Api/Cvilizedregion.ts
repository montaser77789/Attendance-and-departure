import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

const token = Cookies.get("access_token");
export const    CvilizedregionApi = createApi({
    tagTypes: ["Cvilizedregions"],
    reducerPath: "CvilizedregionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pro1-4zoz.onrender.com" }),
    endpoints: (builder) => ({ 
        createMonth:builder.mutation({
            query: ()=>{
                return {
                    url: '/app/audience/create_month',
                    method: 'POST',
                    headers: {
                        Authorization: token
                    },
                }
            }
        })
    })

  
    
})

export const { useCreateMonthMutation} = CvilizedregionApi



