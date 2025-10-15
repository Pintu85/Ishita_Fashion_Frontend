import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import {
  useGetParties,
  useAddParty,
  useDeleteParty,
} from "@/services/party/Party.Service";
import { useGetStates } from "@/services/state/State.Service";
import { useGetCities } from "@/services/city/City.Service";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IParty } from "@/interfaces/party/Party";
import { IState } from "@/interfaces/state/State";
import { ICity } from "@/interfaces/city/City";

const Parties = () => {
  const [open, setOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<IParty>({
    partyID: "",
    partyName: "",
    mobileNo: "",
    gstNumber: "",
    stateId: 0,
    cityId: 0,
    panNumber: "",
    aadharNumber: "",
    address: "",
    documentPath: "",
    isActive: true,
    cityName: "",
    stateName: "",
  });

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const pageNumber = useRef(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" })); // clear field error while typing
  };

  // 🟩 Fetch States
  const getStateMutation = useGetStates({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) setStates(res.data);
      setLoading(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error fetching states",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  // 🟩 Fetch Cities
  const getCitiesMutation = useGetCities({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) setCities(res.data);
      setLoading(false);
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  // 🟩 Fetch Parties
  const getPartiesMutation = useGetParties({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setParties(res.data.party);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      }
      setLoading(false);
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  // 🟩 Add/Edit Party
  const addPartyMutation = useAddParty({
    onSuccess: (res: IResponseModel) => {
      toast({
        title: editingParty ? "Party Updated" : "Party Added",
        description: res.statusMessage,
        variant: "default",
      });
      setOpen(false);
      setEditingParty(false);
      resetForm();
      getPartiesList("");
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  // 🟩 Delete Party
  const deletePartyMutation = useDeleteParty({
    onSuccess: (res: IResponseModel) => {
      toast({
        title: "Party Deleted",
        description: "Party removed successfully",
        variant: "default",
      });
      getPartiesList("");
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  // 🟩 Initial Load
  useEffect(() => {
    getStateList("");
    getPartiesList("");
  }, []);

  // 🟩 Search
  useEffect(() => {
    getPartiesList(search);
  }, [search]);

  const getStateList = (stateId: string) => {
    setLoading(true);
    getStateMutation.mutate({ stateId: stateId });
  };

  const getCitiesList = (cityId: string, cityName: string, stateId: string) => {
    setLoading(true);
    getCitiesMutation.mutate({ cityId: cityId, cityName: cityName, stateId: parseInt(stateId) });
  };

  const getPartiesList = (filter: string) => {
    setLoading(true);
    getPartiesMutation.mutate({
      searchFilter: filter,
      pageNumber: pageNumber.current,
      pageSize: pageSize,
    });
  };

  const resetForm = () => {
    setFormData({
      partyID: "",
      partyName: "",
      mobileNo: "",
      gstNumber: "",
      stateId: 0,
      cityId: 0,
      panNumber: "",
      aadharNumber: "",
      address: "",
      documentPath: "",
      isActive: true,
      cityName: "",
      stateName: "",
    });
  };


  const validateAndSubmit = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.partyName.trim()) errors.partyName = "Party name is required.";

    if (!formData.mobileNo.trim()) errors.mobileNo = "Mobile number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.mobileNo))
      errors.mobileNo = "Enter a valid 10-digit mobile number.";

    if (!formData.gstNumber.trim()) errors.gstNumber = "gstNumber number is required.";
    else if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber))
      errors.gstNumber = "Enter a valid GST number.";

    if (!formData.panNumber.trim()) errors.panNumber = "PanNumber number is required.";
    else if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber))
      errors.panNumber = "Enter a valid PAN number.";

    if (!formData.aadharNumber.trim()) errors.aadharNumber = "AadharNumber number is required.";
    else if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber))
      errors.aadharNumber = "Enter a valid 12-digit Aadhaar number.";

    if (!formData.stateId) errors.stateId = "Please select a state.";
    if (!formData.cityId) errors.cityId = "Please select a city.";
    if (!formData.address.trim()) errors.address = "Address is required.";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return; // stop submission if any error

    handleSubmit();
  };


  const handleSubmit = () => {

    addPartyMutation.mutate(formData);
  };

  const handleEditParty = (party: any) => {
    setEditingParty(true);
    // setFormData(party);
    setFormData({
      ...party,
      stateId: party.stateID,
      stateName: party.stateName,
      cityId: party.cityID,
      cityName: party.cityName,
    });
    getCitiesList("", "", party.stateID.toString());
    setOpen(true);
  };

  const handleDeleteParty = (partyId: string) => {
    deletePartyMutation.mutate({ partyId });
  };

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    getPartiesList(search);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Party Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers and parties
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {editingParty ? "Edit Party" : "Add Party"}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto w-full">
            <SheetHeader>
              <SheetTitle>{editingParty ? "Edit Party" : "Add New Party"}</SheetTitle>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              {/* Party Name */}
              <div className="space-y-2">
                <Label>Party Name</Label>
                <Input
                  name="partyName"
                  placeholder="Enter party name"
                  value={formData.partyName}
                  onChange={handleChange}
                  className={validationErrors.partyName ? "border-red-500" : ""}
                />
                {validationErrors.partyName && <p className="text-red-500 text-sm">{validationErrors.partyName}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  name="mobileNo"
                  placeholder="Enter mobile number"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className={validationErrors.mobileNo ? "border-red-500" : ""}
                />
                {validationErrors.mobileNo && <p className="text-red-500 text-sm">{validationErrors.mobileNo}</p>}
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input
                  name="gstNumber"
                  placeholder="Enter GST number"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className={validationErrors.gstNumber ? "border-red-500" : ""}
                />
                {validationErrors.gstNumber && <p className="text-red-500 text-sm">{validationErrors.gstNumber}</p>}
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  name="panNumber"
                  placeholder="ABCDE1234F"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={validationErrors.panNumber ? "border-red-500" : ""}
                />
                {validationErrors.panNumber && <p className="text-red-500 text-sm">{validationErrors.panNumber}</p>}
              </div>

              {/* Aadhaar Number */}
              <div className="space-y-2">
                <Label>Aadhaar Number</Label>
                <Input
                  name="aadharNumber"
                  placeholder="123412341234"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className={validationErrors.aadharNumber ? "border-red-500" : ""}
                />
                {validationErrors.aadharNumber && <p className="text-red-500 text-sm">{validationErrors.aadharNumber}</p>}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label>State</Label>
                <Combobox
                  options={states.map((x: any) => ({
                    value: x.stateID.toString(),
                    label: x.stateName,
                  }))}
                  value={formData.stateId?.toString()}
                  onValueChange={(val: string) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      stateId: parseInt(val),
                      stateName:
                        states.find((s: any) => s.stateID.toString() === val)?.stateName ||
                        "",
                    }));

                    setValidationErrors((prev) => ({ ...prev, stateId: "" }));

                    // ✅ Pass stateId directly to getCitiesList
                    getCitiesList("", "", val);
                  }}
                  placeholder="Select state"
                  searchPlaceholder="Search state..."
                />
                {validationErrors.stateId && (
                  <p className="text-red-500 text-sm">{validationErrors.stateId}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>City</Label>
                <Combobox
                  options={cities.map((x: any) => ({ value: x.cityID.toString(), label: x.cityName }))}
                  value={formData.cityId?.toString()}
                  onValueChange={(val: string) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      cityId: parseInt(val),
                      cityName: cities.find((c: any) => c.cityID.toString() === val)?.cityName || "",
                    }));
                    setValidationErrors((prev) => ({ ...prev, cityId: "" }));
                  }}
                  placeholder="Select city"
                  searchPlaceholder="Search city..."
                />
                {validationErrors.cityId && <p className="text-red-500 text-sm">{validationErrors.cityId}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  name="address"
                  placeholder="Enter address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className={validationErrors.address ? "border-red-500" : ""}
                />
                {validationErrors.address && <p className="text-red-500 text-sm">{validationErrors.address}</p>}
              </div>

              {/* Upload Document */}
              <div className="space-y-2">
                <Label>Upload Document</Label>
                <Input name="document" type="file" onChange={() => { }} />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                    setValidationErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={validateAndSubmit}>
                  {editingParty ? "Update Party" : "Save Party"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parties..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader size={40} fullScreen text="Loading parties..." color="text-blue-500" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parties?.map((party) => (
                    <TableRow key={party.partyID}>
                      <TableCell>{party.partyName}</TableCell>
                      <TableCell>{party.mobileNo}</TableCell>
                      <TableCell>{party.gstNumber}</TableCell>
                      <TableCell>{party.stateName}</TableCell>
                      <TableCell>{party.cityName}</TableCell>
                      <TableCell> {new Date(party.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-1"
                          onClick={() => handleEditParty(party)}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteParty(party.partyID!)}
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                totalCount={totalPages}
                currentPage={pageNumber.current}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Parties;
