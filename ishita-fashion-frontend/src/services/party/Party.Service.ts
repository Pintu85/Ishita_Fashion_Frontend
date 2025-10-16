import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { del, get, post } from "@/helpers/Requests";
import { IParty } from "@/interfaces/party/Party";

export const useAddParty = (options?: UseMutationOptions< any, any, IParty, any>) => {
 return useMutation({
    mutationFn: async (data: IParty) => {
        const payload = {
            partyID: data.partyID && data.partyID !== "" ? data.partyID : null,
        partyName: data.partyName,
        mobileNo: data.mobileNo,
        gstNumber: data.gstNumber,
        address: data.address,
        stateId: data.stateId,
        cityId: data.cityId,
        panNumber: data.panNumber,
        aadharNumber: data.aadharNumber,
        documentPath: data.documentPath,
        isActive: data.isActive
        }
        return await post("party/add",payload)
    },
    ...options
 })
}


export const useGetParties = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("party/get?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize);
    },
    ...options
})
}

export const useDeleteParty = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await del("party/delete?partyId=" + data.partyId);
        },
        ...options
    })
}

export const useGetPartiesWithoutFilter = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async () => {
            return await get("party/get-parties-dropdown-list");
        },
        ...options
    })
}