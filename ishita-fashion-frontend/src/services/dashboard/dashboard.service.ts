import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { get } from "@/helpers/Requests";

export interface DashboardData {
    totalBillCount: number;
    totalBillAmount: number;
    billrecord: {
        billID: string;
        billNo: string;
        billDate: string;
        totalAmount: number;
        partyID: string;
        partyName: string;
    }[];
    totalInwardCount: number;
    totalInwardAmount: number;
    inwardrecord: {
        inwardID: string;
        challanNo: string;
        inwardDate: string;
        totalPurchaseAmount: number;
        vendorID: string;
        vendorName: string;
    }[];
    totalPartyCount: number;
    billPaymentCount: number;
    billPaymentAmount: number;
    vendorPaymentCount: number;
    vendorPayment: number;
    totalStockValue: number;
}

export type DashboardRequest = { fromDate?: string; toDate?: string } | undefined;

export const useGetDashboardData = (
    options?: UseMutationOptions<{ data: DashboardData; statusCode: number; statusMessage: string }, any, DashboardRequest, any>,
) => {
    return useMutation({
        mutationFn: async (data?: { fromDate?: string; toDate?: string }) => {
            // Quick compatibility: send GET with query params if dates provided.
            if (data && (data.fromDate || data.toDate)) {
                const params = new URLSearchParams();
                if (data.fromDate) params.append("fromDate", data.fromDate);
                if (data.toDate) params.append("toDate", data.toDate);
                return await get(`reports/get-dashboard?${params.toString()}`);
            }

            // No dates: call simple GET (backend defaults to today)
            return await get("reports/get-dashboard");
        },
        ...options,
    });
};
