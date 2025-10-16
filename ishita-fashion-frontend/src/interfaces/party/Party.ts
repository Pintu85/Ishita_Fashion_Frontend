export interface IParty {
    partyID?: string | null;
  partyName: string;
  mobileNo: string;
  gstNumber: string;
  address: string;
  stateId: number;
  cityId: number;
  panNumber: string;
  aadharNumber: string;
  documentPath: string;
  isActive: boolean;
  cityName: string;
  stateName:string;
  createdAt? : string;
}

export interface IPartyDropdown {
    partyID: string;
    partyName: string;
    mobileNo: string;
}