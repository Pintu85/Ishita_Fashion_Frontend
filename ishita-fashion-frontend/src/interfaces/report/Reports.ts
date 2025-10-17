export interface IPartyReport {
    partyID: string;
    partyName: string;
    totalBillCount: number;
    totalBilledAmount: number;
    totalAmountReceived: number;
    totalDue: number;
    lastPaymentDate: string;
}

export interface IVendorInwardsReport {
    vendorID: string;
    vendorName: string;
    totalInwardCount: number;
    totalInwardQuantity: number;
    totalPurchasedAmount: number;
    totalAmountPaid: number;
    totalDue: number;
    items: IItemReports[];
}

export interface IItemReports {
    itemID: string;
    designNo: string;
    inwardID: string;
    quantity: number;
    price: number;
    totalAmount: number;
    amountPaid: number;
    inwardDate: string;
}

export interface IDashboardReport {
    totalBillCount: number;
    totalBillAmount: number;
    billrecord: [];
    totalInwardCount: number;
    totalInwardAmount: number;
    inwardrecord: [];
    totalPartyCount: number;
    billPaymentCount: number;
    billPaymentAmount: number;
    vendorPaymentCount: number;
    vendorPayment: number;
    totalStockValue: number;
}

export interface IStockReport{
    itemID: string;
    designNo: string;
    cost: string;
    totalQuantity: number;
    totalValue: number;
}

