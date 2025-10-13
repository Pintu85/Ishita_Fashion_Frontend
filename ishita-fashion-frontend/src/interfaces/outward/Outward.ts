export interface OutwardItemRequest {
  itemID: string;      
  quantity: number;
  price: number;
}

export interface IOutward {
  billID?: string; 
  partyID: string; 
  billNo: string ;
  gstTypeID: number;
  totalAmount: number;
  billDate: string;  
  isPaid: boolean;
  details: OutwardItemRequest[] ;
}

export interface IOutwardItem {
  billDetailID: string;
  itemID: string;
  itemName: string;
  designNo: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface IOutwardBillRes {
  billID: string;
  partyID: string;
  partyName: string;
  billNo: string;
  billDate: string;
  isPaid: boolean;
  gstTypeID: number;
  totalAmount: number;
  quantity: number;
  items: IOutwardItem[];
}
