export interface IItem {
    itemID: string;
    designNo: string;
    itemName: string;
    vendorID: string;
    vendorName?: string;
    itemPhoto: string;
    manufacturingCost: number;
    sellingPrice: number;
    isActive: boolean;
    createdAt?:string;
}

export interface IItemDropDownList {
    itemID: string;
    designNo: string;
    itemName: string;
}