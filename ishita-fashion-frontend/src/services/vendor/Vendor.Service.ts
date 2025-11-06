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
            return await get("vendor/get-vendors-dropdown-list");
        },
        ...options
    })
}

// Specialized hook for Vendor Payment modal
export const useGetVendorsForPayment = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async () => {
            // returns the same response model; caller can read .data to get array
            return await get("vendor/get-vendors-dropdown-list");
        },
        ...options,
    });
};

export const useGetVendorById = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: { vendorId: string }) => {
            return await get("vendor/getByVendorId?vendorId=" + data.vendorId);
        },
        ...options,
    });
};

export const useAddVendorPayment = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: any) => {
            // data should include: vendorPaymentID|null, vendorID, inwardID, amountPaid, paidDate, remarks
            return await post("VendorPayment/add", data);
        },
        ...options,
    });
};

export const useGetVendorPayments = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: { pageNumber: number; pageSize: number }) => {
            return await get(`VendorPayment/get?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`);
        },
        ...options,
    });
};