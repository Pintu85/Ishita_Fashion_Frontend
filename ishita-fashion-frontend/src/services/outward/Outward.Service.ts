import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { del, get, post } from "@/helpers/Requests";
import { IOutward } from "@/interfaces/outward/Outward";

// 🔹 Add or Update Outward
export const useAddOutward = (options?: UseMutationOptions<any, any, IOutward, any>) => {
  return useMutation({
    mutationFn: async (data: IOutward) => {
      const payload = {
        billID: data.billID && data.billID !== "" ? data.billID : null,
        partyID: data.partyID,
        billNo: data.billNo,
        gstTypeID: data.gstTypeID,
        totalAmount: data.totalAmount,
        billDate: data.billDate,
        isPaid: data.isPaid,
        details: data.details
      };
      return await post("bill/add", payload);
    },
    ...options
  });
};

// 🔹 Get Outwards (with pagination & search)
export const useGetOutwards = (options?: UseMutationOptions<any, any, any, any>) => {
  return useMutation({
    mutationFn: async (data: any) => {
      return await get(
        `bill/get?searchFilter=${data.searchFilter}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`
      );
    },
    ...options
  });
};

// 🔹 Delete Outward
export const useDeleteOutward = (options?: UseMutationOptions<any, any, any, any>) => {
  return useMutation({
    mutationFn: async (data: any) => {
      return await del(`bill/delete?billID=${data.billID}`);
    },
    ...options
  });
};
