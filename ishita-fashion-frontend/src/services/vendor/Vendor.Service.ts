import { useMutation, useQuery, UseMutationOptions } from "@tanstack/react-query";
import { del, get, post } from "../../helpers/Requests";
import { IVendor } from "@/interfaces/vendor/Vendor";

export const useAddVendor = (options?: UseMutationOptions<any, Error, IVendor, unknown>) => {
    return useMutation({
        mutationFn: async (data : IVendor) => {
            const payload = {
                vendorID: data.vendorID && data.vendorID !== "" ? data.vendorID : null, 
                vendorName: data.vendorName,
                gstNumber: data.gstNumber,
                mobileNo: data.mobileNo,
                isActive: data.isActive,
                address: data.address
            }
            return await post("vendor/add", payload);
        },
        ...options
    })
}

export const useGetVendors = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("vendor/get?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize);
    },
    ...options
})
}

export const useDeleteVendor = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await del("vendor/delete?vendorId=" + data.vendorId);
        },
        ...options
    })
}

export const useGetVendorsWithoutFilter = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async () => {
            return await get("vendor/get-all");
        },
        ...options
    })
}