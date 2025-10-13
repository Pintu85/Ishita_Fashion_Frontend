import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { CalendarIcon, Search, Plus, Trash2, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { IVendorDropdown } from "@/interfaces/vendor/Vendor";
import { useGetVendorsWithoutFilter } from "@/services/vendor/Vendor.Service";
import { useGetItemsDropDownList } from "@/services/item/Item.Service";
import { useToast } from "@/hooks/use-toast";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IItemDropDownList } from "@/interfaces/item/Item";
import { useAddInward, useGetInwards, useDeleteInward } from "@/services/inward/Inwars.Service"
import { IInward, InwardRes, InwardDetail } from "@/interfaces/Inward/Inward";
import { Pagination } from "@/components/ui/pagination";

const Inward = () => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<IVendorDropdown[]>([]);
  const [items, setItems] = useState<IItemDropDownList[]>([]);
  const [inwardItems, setInwardItems] = useState<InwardRes[]>([]);
  const [search, setSearch] = useState<string>("");
  const { toast } = useToast();
  const [editingInward, setEditingInward] = useState<boolean>(false);
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [formData, setFormData] = useState<IInward>({
    inwardID: "",
    vendorID: "",
    billNo: "",
    challanNo: "",
    note: "",
    inwardDate: "",
    details: [
      { itemID: "", quantity: 0, price: 0 }
    ]
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getvendorsDropDownList();
    getItemsDropDownList();
  }, []);

  useEffect(() => {
    if (search.trim() !== "") {
      getInwardList(search);
    }
    else {
      getInwardList("");
    }
  }, [search]);

  const handleCancel = () => {
    setOpen(false);
    setEditingInward(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    useAddInwardMutation.mutate({
      inwardID: formData.inwardID,
      vendorID: formData.vendorID,
      billNo: formData.billNo,
      challanNo: formData.challanNo,
      note: formData.note,
      inwardDate: formData.inwardDate,
      details: formData.details
    })
    setOpen(false);
  }

  const resetForm = () => {
    setFormData({ inwardID: "", vendorID: "", billNo: "", challanNo: "", note: "", inwardDate: "", details: [{ itemID: "", quantity: 0, price: 0 }] })
  }

  const handleItemChange = <K extends keyof InwardDetail>(
    index: number,
    field: K,
    value: InwardDetail[K]
  ) => {
    const updatedDetails = [...formData.details];
    const updatedValue =
      field === "quantity" || field === "price" ? Number(value) : value;

    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: updatedValue,
    };
    setFormData({ ...formData, details: updatedDetails });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { itemID: "", quantity: 0, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: updatedDetails });
  };

  const getvendorsDropDownList = () => {
    getVendorsMutation.mutate({});
  };

  const getVendorsMutation = useGetVendorsWithoutFilter({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setVendors(res.data);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    },
  });

  const getItemsDropDownList = () => {
    getItemsMutation.mutate({});
  };

  const getItemsMutation = useGetItemsDropDownList({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setItems(res.data);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    },
  });

  const getInwardList = (value: string) => {
    getInwardsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }
  const getInwardsMutation = useGetInwards({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setInwardItems(res.data.inwards);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    },
  });

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.vendorID) errors.vendorID = "Please select a vendor.";
    if (!formData.inwardDate) errors.inwardDate = "Please select a date.";
    if (!formData.billNo?.trim()) errors.billNo = "Please enter a bill number.";
    if (!formData.challanNo?.trim()) errors.challanNo = "Please enter a challan number.";
    if (formData.details.length === 0)
      errors.details = "Please add at least one item.";

    formData.details.forEach((item, index) => {
      if (!item.itemID)
        errors[`item_${index}_itemID`] = `Select design for item ${index + 1}.`;
      if (item.quantity <= 0)
        errors[`item_${index}_quantity`] = `Quantity must be greater than 0 for item ${index + 1}.`;
      if (item.price <= 0)
        errors[`item_${index}_price`] = `Cost must be greater than 0 for item ${index + 1}.`;
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields and try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleDeleteInward = (inwardId: string) => {
    useDeleteInwardMutation.mutate({ inwardId: inwardId })
  }

  const useDeleteInwardMutation = useDeleteInward({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        getInwardList("");
        toast({
          title: "Deleted",
          description: res.statusMessage,
          variant: "destructive",
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

  const useAddInwardMutation = useAddInward({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 201 || 200) {
        resetForm();
        getInwardList("");
        setEditingInward(false);
        toast({
          title: editingInward ? "Inward Updated" : "Inward Added",
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

  const handleEditInward = (data: any) => {
    setOpen(true);
    setEditingInward(true);
    const parsedDate = data.inwardDate ? new Date(data.inwardDate) : undefined;
    setDate(parsedDate);
    setFormData({
      inwardID: data.inwardID,
      vendorID: data.vendorID,
      billNo: data.billNo,
      challanNo: data.challanNo,
      note: data.note,
      inwardDate: data.inwardDate,
      details: data.items.map((item) => ({
        itemID: item.itemID,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  const onSearch = (value: string) => {
    pageNumber.current = 1;
    setSearch(value);
  }

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    let size = pageSize;
    setPageSize(size);
    getInwardList("");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Inward of Material
          </h1>
          <p className="text-muted-foreground mt-1">
            Record material received from vendors
          </p>
        </div>

        <Button className="gap-2 w-full sm:w-auto" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Inward
        </Button>
      </div>

      {open && (
        <Card className="mb-3">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              {editingInward ? "Update Inward Entry" : "Add Inward Entry"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Vendor & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vendor */}
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Combobox
                    options={vendors.map((x: any) => ({
                      value: x.vendorID,
                      label: x.vendorName,
                    }))}
                    onValueChange={(val) => setFormData({ ...formData, vendorID: val })}
                    placeholder="Select vendor"
                    searchPlaceholder="Search vendor..."
                    value={formData.vendorID}
                  />
                  {validationErrors.vendorID && (
                    <p className="text-red-500 text-sm">{validationErrors.vendorID}</p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setFormData({ ...formData, inwardDate: d?.toISOString() || "" });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {validationErrors.inwardDate && (
                    <p className="text-red-500 text-sm">{validationErrors.inwardDate}</p>
                  )}
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <Label className="text-lg font-semibold">Item Details</Label>
                  <Button onClick={addItem} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Design</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Cost/Piece</TableHead>
                          <TableHead>Selling Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {formData.details.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Combobox
                                options={items.map((x: any) => ({
                                  value: x.itemID.toString(),
                                  label: `${x.designNo} - ${x.itemName}`,
                                }))}
                                placeholder="Select design"
                                searchPlaceholder="Search design..."
                                value={item.itemID}
                                onValueChange={(val) => handleItemChange(index, "itemID", val)}
                              />
                              {validationErrors[`item_${index}_itemID`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {validationErrors[`item_${index}_itemID`]}
                                </p>
                              )}
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  handleItemChange(index, "quantity", Number(e.target.value))
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                placeholder="Cost"
                                value={item.price || ""}
                                onChange={(e) =>
                                  handleItemChange(index, "price", Number(e.target.value))
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <Input type="number" placeholder="₹0" disabled className="bg-muted" />
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                placeholder="₹0"
                                disabled
                                className="bg-muted"
                                value={
                                  item.quantity && item.price
                                    ? (item.quantity * item.price).toFixed(2)
                                    : ""
                                }
                              />
                            </TableCell>

                            <TableCell>
                              {formData.details.length > 1 && (
                                <Button
                                  onClick={() => removeItem(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Bill & Challan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bill-no">Bill Number</Label>
                  <Input
                    id="bill-no"
                    placeholder="Enter bill number"
                    value={formData.billNo}
                    onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challan-no">Challan Number</Label>
                  <Input
                    id="challan-no"
                    placeholder="Enter challan number"
                    value={formData.challanNo}
                    onChange={(e) => setFormData({ ...formData, challanNo: e.target.value })}
                  />
                </div>
              </div>

              {/* Note & Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    placeholder="Add note (optional)"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    type="number"
                    disabled
                    className="bg-muted"
                    value={formData.details
                      .reduce((acc, x) => acc + x.quantity * x.price, 0)
                      .toFixed(2)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button onClick={handleCancel} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="w-full sm:w-auto">
                  {editingInward ? "Update Inward Entry" : "Save Inward Entry"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inward entries..." className="pl-9" value={search} onChange={(e) => onSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  {/* <TableHead>Design</TableHead> */}
                  <TableHead>Quantity</TableHead>
                  <TableHead>Bill No</TableHead>
                  <TableHead>Challan No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inwardItems.map((entry) => (
                  <TableRow key={entry.inwardID}>
                    <TableCell className="font-medium">{entry.vendorName}</TableCell>
                    {/* <TableCell>{entry.items.name}</TableCell> */}
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell>{entry.billNo}</TableCell>
                    <TableCell>{entry.challanNo}</TableCell>
                    <TableCell>{new Date(entry.inwardDate).toLocaleString()}</TableCell>
                    <TableCell>₹{entry.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1" onClick={() => handleEditInward(entry)}>
                        <Edit />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteInward(entry.inwardID)}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inward;