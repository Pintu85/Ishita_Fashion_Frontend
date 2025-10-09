import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import * as Form from "@radix-ui/react-form";
import { Plus, Search, Edit, Trash, Import } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { useToast } from "@/hooks/use-toast";
import { useGetParties, useAddParty, useDeleteParty } from "@/services/party/Party.Service";
import { IParty } from "@/interfaces/party/Party";
import { useGetStates } from "@/services/state/State.Service";
import { IState } from "@/interfaces/state/State";
import { useGetCities } from "@/services/city/City.Service";
import { ICity } from "@/interfaces/city/City";


const Parties = () => {
  const [open, setOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(false);
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState<string>("");

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
    stateName: ""
  });

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
      stateName: ""
    });
  };

  useEffect(() => {
    getPartiesList("");
    getStateList("");
    getCitiesList("", "");
  }, []);

  useEffect(() => {
    if (search.trim() !== "") {
      getPartiesList(search);
    } else {
      getPartiesList("");
    }
  }, [search]);

  const getPartiesList = (filter: string) => {
    setLoading(true);
    getPartiesMutation.mutate({ searchFilter: filter, pageNumber: pageNumber.current, pageSize });
  };

  const getStateList = (stateId: string) => {
    setLoading(true);
    getStateMutation.mutate({ stateId: stateId });
  };

  const getStateMutation = useGetStates({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setStates(res.data);
      }
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
  })

  const getCitiesList = (cityId: string, cityName: string) => {
    setLoading(true);
    getCitiesMutation.mutate({ cityId: cityId, cityName: cityName });
  };

  const getCitiesMutation = useGetCities({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setCities(res.data);
      }
      setLoading(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error fetching cities",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    },
  })

  const getPartiesMutation = useGetParties({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        console.log(res);
        setParties(res.data.party);
        setTotalPages(Math.ceil(res.data.totalCount ?? 0 / pageSize));
      }
      setLoading(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error fetching parties",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  // 🟩 Add/Edit Party
  const addPartyMutation = useAddParty({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast({
          title: editingParty ? "Party Updated" : "Party Added",
          description: res.statusMessage,
          variant: "default",
        });
        setOpen(false);
        setEditingParty(false);
        resetForm();
        getPartiesList("");
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error saving party",
        description: err.message || "Something went wrong",
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
        variant: "default"
      });
      getPartiesList("");
    },
    onError: (err: any) => {
      toast({
        title: "Error deleting party",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // 🟩 Form Handlers
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPartyMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    getPartiesList(search);
  };

  const handleEditParty = (party: IParty) => {
    setEditingParty(true);
    setFormData(party);
    setOpen(true);
  };

  const handleDeleteParty = (partyId: string) => {
    deletePartyMutation.mutate({ partyId });
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Party Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers and suppliers
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Party
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto w-full">
            <SheetHeader>
              <SheetTitle>{editingParty ? "Edit Party" : "Add New Party"}</SheetTitle>
            </SheetHeader>

            <Form.Root onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Party Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Field name="partyName">
                  <Form.Label>Party Name</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="partyName"
                      placeholder="Enter name"
                      value={formData.partyName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter party name
                  </Form.Message>
                </Form.Field>

                <Form.Field name="mobileNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="mobileNumber"
                      placeholder="Enter mobile"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.mobileNo}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter mobile number
                  </Form.Message>
                  <Form.Message
                    match="patternMismatch"
                    className="text-sm text-red-500"
                  >
                    Mobile number must be 10 digits
                  </Form.Message>
                </Form.Field>
              </div>

              {/* GST & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Field name="gstNumber">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="gstNumber"
                      placeholder="Enter GST"
                      required
                      pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter GST number
                  </Form.Message>
                  <Form.Message
                    match="patternMismatch"
                    className="text-sm text-red-500"
                  >
                    Invalid GST number format
                  </Form.Message>
                </Form.Field>

                <Form.Field name="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control asChild>
                    <Select
                      value={formData.stateName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, stateName: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem value={state.stateID.toString()} key={state.stateID}>{state.stateName}</SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please select a state
                  </Form.Message>
                </Form.Field>
              </div>

              {/* PAN & Aadhaar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PAN Number */}
                <Form.Field name="panNumber" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    PAN Number
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="panNumber"
                      placeholder="ABCDE1234F"
                      required
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      value={formData.panNumber}
                      onChange={handleChange}
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter PAN number
                  </Form.Message>
                  <Form.Message match="patternMismatch" className="text-sm text-red-500">
                    Invalid PAN format (e.g., ABCDE1234F)
                  </Form.Message>
                </Form.Field>


                {/* Aadhaar Number */}
                <Form.Field name="aadharNumber" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Aadhaar Number
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="aadharNumber"
                      placeholder="123412341234"
                      required
                      pattern="[0-9]{12}"
                      maxLength={12}
                      value={formData.aadharNumber}
                      onChange={handleChange}
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter Aadhaar number
                  </Form.Message>
                  <Form.Message match="patternMismatch" className="text-sm text-red-500">
                    Aadhaar number must be 12 digits
                  </Form.Message>
                </Form.Field>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <Form.Field name="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter address
                  </Form.Message>
                </Form.Field>

                <Form.Field name="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control asChild>
                    <Select
                      value={formData.cityName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, cityName: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem value={city.cityID.toString()} key={city.cityID}>{city.cityName}</SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please select a state
                  </Form.Message>
                </Form.Field>

              </div>


              {/* Document Upload */}
              <Form.Field name="document">
                <Form.Label>Upload Document</Form.Label>
                <Form.Control asChild>
                  <Input
                    name="document"
                    type="file"
                    onChange={() => { }}
                  />
                </Form.Control>
              </Form.Field>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                    setEditingParty(false);
                  }}
                >
                  Cancel
                </Button>
                <Form.Submit asChild>
                  <Button type="submit">
                    {editingParty ? "Update Party" : "Save Party"}
                  </Button>
                </Form.Submit>
              </div>
            </Form.Root>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parties..."
                className="pl-9"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
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
                    {/* <TableHead>Created At</TableHead> */}
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
                      {/* <TableCell>{new Date(party.createdAt).toLocaleString()}</TableCell> */}
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
                          onClick={() => handleDeleteParty(party.partyID)}
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
