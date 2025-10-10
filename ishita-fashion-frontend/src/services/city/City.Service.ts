import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { get } from "@/helpers/Requests";

export const useGetCities = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("city/get?cityId=" + data.cityId + "&cityName=" + data.cityName + "&stateId=" + data.stateId);
    },
    ...options
})
}