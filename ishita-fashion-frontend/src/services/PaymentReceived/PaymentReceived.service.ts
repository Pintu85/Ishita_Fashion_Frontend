import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/helpers/Requests";

// === INTERFACES ===
export interface PartyDropdown {
  partyID: string;
  partyName: string;
  mobileNo?: string;
}

export interface BillDetail {
  billID: string;
  billNo: string;
  billDate: string;
  totalAmount: number;
  totalReceived: number;
  dueAmount: number;
}

export interface PartyDetailsResponse {
  party: {
    partyID: string;
    partyName: string;
    mobileNo?: string;
    gstNumber?: string;
    address?: string;
    cityID?: number;
    stateID?: number;
  };
  billDetails: BillDetail[];
  totalBillAmount: number;
  totalReceivedAmount: number;
  totalDueAmount: number;
}

export interface AddBillPaymentPayload {
  partyID: string;
  billID: string;
  amountReceived: number;
  receivedDate: string; // ISO string
  remarks?: string;
  createdAt?: string;
}

// === 1. Get Parties Dropdown - ✅ FIXED: Changed from useQuery to useMutation ===
export const useGetPartiesDropdown = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await get("party/get-parties-dropdown-list");
      if (response.statusCode !== 200) {
        throw new Error(response.statusMessage || "Failed to fetch parties");
      }
      return response;
    },
  });
};

// === 2. Get Party Bills by Party ID - ✅ FIXED: Parameter structure ===
export const useGetPartyById = () => {
  return useMutation({
    mutationFn: async ({ partyId }: { partyId: string }) => {
      if (!partyId) throw new Error("Party ID is required");
      const response = await get(`party/getByPartyId?partyId=${partyId}`);
      if (response.statusCode !== 200) {
        throw new Error(response.statusMessage || "Failed to fetch party details");
      }
     
      return response;
    },
  });
};

// === 3. Add Bill Payment (useMutation) ===
export const useAddBillPayment = () => {
  return useMutation<any, Error, AddBillPaymentPayload>({
    mutationFn: async (payload) => {
      const response = await post("billPayment/add", payload);
      if (response.statusCode !== 201) {
        throw new Error(response.statusMessage || "Failed to record payment");
      }
       console.log("added", response);
      return response;
    },
  });
};

// === 4. Paginated outwards (useMutation - matches your original code) ===
export const useGetBillPayments = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (params: {
      pageNumber?: number;
      pageSize?: number;
      searchQuery?: string;
    }) => {
      const queryString = new URLSearchParams();
      if (params.pageNumber)
        queryString.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryString.append("pageSize", params.pageSize.toString());
      if (params.searchQuery)
        queryString.append("searchFilter", params.searchQuery);

      const response = await get(`bill/get?${queryString.toString()}`);
      return response;
    },
    onSuccess,
    onError,
  });
};