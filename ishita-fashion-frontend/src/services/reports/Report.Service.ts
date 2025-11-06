import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { get } from "@/helpers/Requests";

export const useGetPartiesReport = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("reports/get-partySalesReport?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize + "&fromDate=" + data.fromDate + "&toDate=" + data.toDate);
    },
    ...options
})
}

export const useGetVendorInwardsReport = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("reports/get-vendorInwardReport?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize + "&fromDate=" + data.fromDate + "&toDate=" + data.toDate);
    },
    ...options
})
}

export const useGetStockReport = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("reports/get-stockReport");
    },
    ...options
})
}

export const useGetDashboardReport = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        if (data && (data.fromDate || data.toDate)) {
                const params = new URLSearchParams();
                if (data.fromDate) params.append("fromDate", data.fromDate);
                if (data.toDate) params.append("toDate", data.toDate);
                return await get(`reports/get-dashboard?${params.toString()}`);
            }

            // No dates: call simple GET (backend defaults to today)
            return await get("reports/get-dashboard");
    },
    ...options
})
}

