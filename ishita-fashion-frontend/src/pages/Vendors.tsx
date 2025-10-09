import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import * as Form from "@radix-ui/react-form";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IVendor } from "@/interfaces/vendor/Vendor";
import { useAddVendor, useGetVendors, useDeleteVendor } from "../services/vendor/Vendor.Service"
import { IResponseModel } from "@/interfaces/ResponseModel";
import { Pagination } from "@/components/ui/pagination";

const Vendors = () => {
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [editingVendor, setEditingVendor] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [formData, setFormData] = useState<IVendor>({
    vendorID: "",
    vendorName: "",
    gstNumber: "",
    address: "",
    mobileNo: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setOpen(false);

    addVendorMutation.mutate({
      vendorID: formData.vendorID,
      vendorName: formData.vendorName,
      gstNumber: formData.gstNumber,
      mobileNo: formData.mobileNo,
      isActive: formData.isActive,
      address: formData.address
    })
  };

  const getVendorsList = (value: string) => {
    setLoading(true);
    getVendorsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const getVendorsMutation = useGetVendors({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setVendors(res.data.vendors);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
        setLoading(false);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
      setLoading(false);
    }
  })

  const handleDeletevendor = (vendorId: string) => {
    if (vendorId != "") {
      deleteVendorMutation.mutate({ vendorId: vendorId })
    }
  };

  const addVendorMutation = useAddVendor({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 201 || 200) {
        setOpen(false);
        getVendorsList("");
        resetForm();
        toast({
          title: editingVendor ? "Vendor Edited" : "Added",
          description: res.statusMessage,
          variant: "default",
        });
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    }
  })

  const deleteVendorMutation = useDeleteVendor({
    onSuccess: (res: IResponseModel) => {
      getVendorsList("");
      toast({
        title: "Vendor Deleted",
        description: "The vendors has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    }
  })

  const resetForm = () => {
    setFormData({
      vendorID: "",
      vendorName: "",
      gstNumber: "",
      address: "",
      mobileNo: "",
      isActive: true,
    })
  }

  const handleEditVendor = (vendor: IVendor) => {
    setOpen(true);
    setEditingVendor(true);
    setFormData(vendor);
  }

  useEffect(() => {
    if (search.trim() !== "") {
      getVendorsList(search);
    }
    else {
      getVendorsList("");
    }
  }, [search]);

  const onSearch = (value: string) => {
    console.log(value);
    pageNumber.current = 1;
    setSearch(value);
  }

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    let size = pageSize;
    setPageSize(size);
    getVendorsList("");
  };

  return (

    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your suppliers and vendors
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto w-full">
            <SheetHeader>
              <SheetTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</SheetTitle>
            </SheetHeader>
            <Form.Root onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-4">
                {/* Vendor Name */}
                <Form.Field name="vendorName" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Vendor Name
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleChange}
                      required
                      placeholder="Enter the vendor name"
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter vendor name
                  </Form.Message>
                  <Form.Message
                    match={(value) => value.length < 2}
                    className="text-sm text-red-500"
                  >
                    Vendor name must be at least 2 characters
                  </Form.Message>
                </Form.Field>

                {/* GST Number */}
                <Form.Field name="gstNumber" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    GST Number
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="gstNumber"
                      placeholder="24AAAAA0000A1Z5"
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

                {/* Mobile Number */}
                <Form.Field name="mobileNo" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mobile Number
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="mobileNo"
                      placeholder="9876543210"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.mobileNo}
                      onChange={handleChange}
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

                {/* Address */}
                <Form.Field name="address" className="space-y-2">
                  <Form.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Address
                  </Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="address"
                      placeholder="Enter address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Control>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter address
                  </Form.Message>
                  <Form.Message
                    match={(value) => value.length < 5}
                    className="text-sm text-red-500"
                  >
                    Address must be at least 5 characters
                  </Form.Message>
                </Form.Field>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                    setEditingVendor(false);
                  }}
                >
                  Cancel
                </Button>
                <Form.Submit asChild>
                  <Button type="submit">Save Vendor</Button>
                </Form.Submit>
              </div>
            </Form.Root>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-9" value={search} onChange={(e) => onSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader size={40} fullScreen={true} text="Loading vendors..." color="text-blue-500" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>GST Number</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.vendorID}>
                      <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                      <TableCell>{vendor.gstNumber}</TableCell>
                      <TableCell>{vendor.mobileNo}</TableCell>
                      <TableCell>{vendor.address}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-1" onClick={() => handleEditVendor(vendor)}>
                          <Edit />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletevendor(vendor.vendorID)}>
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

export default Vendors;
