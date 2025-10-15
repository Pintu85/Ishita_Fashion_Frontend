import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { del, get, post } from "@/helpers/Requests";
import { IInward } from "@/interfaces/Inward/Inward";


export const useAddInward = (options?: UseMutationOptions< any, any, IInward, any>) => {
 return useMutation({
    mutationFn: async (data: IInward) => {
        const payload = {
            inwardID: data.inwardID && data.inwardID !== "" ? data.inwardID : null, 
            vendorID: data.vendorID,
            billNo: data.billNo,
            challanNo: data.challanNo,
            note: data.note,
            inwardDate: data.inwardDate,
            amountPaid: data.amountPaid,
            paidDate: data.paidDate,
            remarks: data.remarks,
            details: data.details
        }
        return await post("inward/add",payload)
    },
    ...options
 })
}


export const useGetInwards = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("inward/get?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize);
    },
    ...options
})
}

export const useDeleteInward = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await del("inward/delete?inwardId=" + data.inwardId);
        },
        ...options
    })
}
