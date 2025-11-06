export interface IVendorPaymentResponse {
    statusCode: number;
    statusMessage: string;
    data: {
        payments: IVendorPayment[];
        totalCount: number;
    };
}

export interface IVendorPayment {
    vendorPaymentID: string;
    inwardID: string;
    billNo: string;
    totalPurchaseAmount: number;
    vendorID: string;
    vendorName: string;
    amountPaid: number;
    paidDate: string;
    remarks: string;
    createdAt: string;
    dueAmount: number;
    inwardDetails: IInwardDetail[];
}

export interface IInwardDetail {
    inwardDetailID: string;
    itemID: string;
    itemName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    createdAt: string;
}