import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { del, get, post } from "@/helpers/Requests";
import { IItem } from "@/interfaces/item/Item";

export const useAddItem = (options?: UseMutationOptions< any, any, IItem, any>) => {
 return useMutation({
    mutationFn: async (data: IItem) => {
        const payload = {
            itemID: data.itemID && data.itemID !== "" ? data.itemID : null, 
            designNo: data.designNo,
            itemName: data.itemName,
            vendorID: data.vendorID,
            itemPhoto: data.itemPhoto,
            manufacturingCost: data.manufacturingCost,
            sellingPrice: data.sellingPrice,
            isActive: data.isActive
        }
        console.log(payload);
        return await post("item/add",payload)
    },
    ...options
 })
}


export const useGetItems = (options: UseMutationOptions<any, any, any, any> ) => { 
return useMutation({
    mutationFn: async (data: any) => {
        return await get("item/get?searchFilter=" + data.searchFilter + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize);
    },
    ...options
})
}

export const useDeleteItem = (options?: UseMutationOptions<any, any, any, any>) => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await del("item/delete?itemId=" + data.itemId);
        },
        ...options
    })
}