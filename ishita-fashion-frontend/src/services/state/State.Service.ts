import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { get } from "@/helpers/Requests";

export const useGetStates = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("state/get?stateId=" + data.stateId );
    },
    ...options
})
}