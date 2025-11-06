export interface IInward {
    inwardID: string;
    vendorID:string;
    billNo: string;
    challanNo: string;
    note: string;
    inwardDate?: string;
    amountPaid: number;
    paidDate: string;
    remarks: string;
    details:InwardDetail[];
}

export interface InwardDetail {
    itemID: string;
    quantity: number;
    price: number;
}

export interface InwardRes {
  inwardID: string;
  vendorID: string;
  vendorName: string;
  billNo: string;
  challanNo: string;
  note: string;
  inwardDate: string;         // e.g. "2025-10-10T00:00:00"
  totalAmount: number;        // Sum of (quantity * price)
  quantity: number;           // Total quantity
  items: InwardItem[];  
  vendorPayments: IvendorPayments[];       // All items under this inward
}

export interface InwardItem {
  itemID: string;
  itemName: string;
  designNo: string;
  quantity: number;
  price: number;
}

export interface IvendorPayments {
  vendorPaymentID: string;
  amountPaid: number;
  paidDate: string;
  remarks: string;
}

export interface IInwardDropdown {
  inwardID: string;
  billNo: string;
  challanNo: string;
  totalAmount: number;
  dueAmount: number;
  totalPurchaseAmount: number;
  amountPaid: number;
}