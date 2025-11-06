import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { CalendarIcon, Search, Plus, Trash2, Edit, Eye, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { IVendorDropdown } from "@/interfaces/vendor/Vendor";
import { useGetVendorsWithoutFilter } from "@/services/vendor/Vendor.Service";
import { useGetItemsDropDownList } from "@/services/item/Item.Service";
import { useToast } from "@/hooks/use-toast";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IItem, IItemDropDownList } from "@/interfaces/item/Item";
import { useAddInward, useGetInwards, useDeleteInward } from "@/services/inward/Inwars.Service"
import { IInward, InwardRes, InwardDetail } from "@/interfaces/Inward/Inward";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddDesignDialog from "@/pages/common/AddDesignDialog";
import { useAddItem } from "@/services/item/Item.Service";
import { Loader } from "@/components/ui/loader";

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
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formItemData, setFormItemData] = useState<IItem>({
    itemID: "",
    designNo: "",
    itemName: "",
    vendorID: "",
    vendorName: "",
    itemPhoto: "",
    manufacturingCost: 0,
    sellingPrice: 0,
    isActive: true,
    createdAt: ""
  });
  const [formData, setFormData] = useState<IInward>({
    inwardID: "",
    vendorID: "",
    billNo: "",
    challanNo: "",
    note: "",
    inwardDate: "",
    amountPaid: 0,
    paidDate: "",
    remarks: "",
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

  const handleViewItems = (entry) => {
    setSelectedBill(entry);
    setIsItemsDialogOpen(true);
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
      amountPaid: formData.amountPaid,
      paidDate: formData.paidDate,
      remarks: formData.remarks,
      details: formData.details
    })
    setOpen(false);
  }

  const resetForm = () => {
    setFormData({ inwardID: "", vendorID: "", billNo: "", challanNo: "", note: "", inwardDate: "", amountPaid: 0, paidDate: "", remarks: "", details: [{ itemID: "", quantity: 0, price: 0 }] })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormItemData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleitemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    e.currentTarget.reset();

    additemMutation.mutate({
      itemID: formItemData.itemID,
      designNo: formItemData.designNo,
      itemName: formItemData.itemName,
      vendorID: formItemData.vendorID,
      itemPhoto: formItemData.itemPhoto,
      manufacturingCost: formItemData.manufacturingCost,
      sellingPrice: formItemData.sellingPrice,
      isActive: true
    })

  }

  const resetFormItemData = () => {
    setFormItemData({
      itemID: "",
      designNo: "",
      itemName: "",
      vendorID: "",
      vendorName: "",
      itemPhoto: "",
      manufacturingCost: 0,
      sellingPrice: 0,
      isActive: true,
      createdAt: ""
    })
  }

  const additemMutation = useAddItem({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200 || 201) {
        setIsDesignDialogOpen(false);
        getItemsDropDownList()
        resetFormItemData();
        toast({
          title: "Item Added",
          description: res.statusMessage,
          variant: "default",
        });
        setLoading(false);
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";
      setIsDesignDialogOpen(false);
      setLoading(false);
      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    }
  })

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

  const getInwardList = (value: string) => {
    setLoading(true);
    getInwardsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }
  const getInwardsMutation = useGetInwards({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setInwardItems(res.data.inwards);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
        setLoading(false);
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";
      setLoading(false);
      toast({
        title: "Error occurred",
        description: errorMsg,
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
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while deleting inward.";

      toast({
        title: "Error occurred",
        description: errorMsg,
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
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while deleting inward.";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    }
  })

  const handleEditInward = (data: any) => {
    setOpen(true);
    setEditingInward(true);
    const parsedDate = data.inwardDate ? new Date(data.inwardDate) : undefined;
    setDate(parsedDate);
    console.log({ data });
    // Safely get first payment (if exists)
    const firstPayment = data.vendorPayments && data.vendorPayments.length > 0
      ? data.vendorPayments[0]
      : null;

    setFormData({
      inwardID: data.inwardID,
      vendorID: data.vendorID,
      billNo: data.billNo,
      challanNo: data.challanNo,
      note: data.note,
      inwardDate: data.inwardDate,
      amountPaid: firstPayment ? firstPayment.amountPaid : 0,
      paidDate: firstPayment ? firstPayment.paidDate : "",
      remarks: firstPayment ? firstPayment.remarks : "",
      details: data.items?.map((item: any) => ({
        itemID: item.itemID,
        quantity: item.quantity,
        price: item.price,
      })) || [],
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

  const calculateTotal = () => {
    return formData.details.reduce((acc, item) => acc + (item.quantity * item.price), 0);
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
                      label: `${x.vendorName}${x.mobileNo ? ` - ${x.mobileNo}` : ''}`,
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
                  <div
                    className="relative cursor-pointer"
                  >
                    <input
                      id="date"
                      type="date"
                      value={date ? format(date, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                        setDate(newDate);
                        setFormData({ ...formData, inwardDate: newDate?.toISOString() || "" });
                      }}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background pr-10 py-2 text-sm ring-offset-background cursor-pointer",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        !date && "text-muted-foreground",
                        "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      )}
                      style={{ paddingLeft: '0.5rem' }}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                  </div>
                  {validationErrors.inwardDate && (
                    <p className="text-red-500 text-sm">{validationErrors.inwardDate}</p>
                  )}
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

              {/* Item Details */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <Label className="text-lg font-semibold">Item Details</Label>
                  <div className="flex gap-2">
                    <AddDesignDialog
                      open={isDesignDialogOpen}
                      setOpen={setIsDesignDialogOpen}
                      vendors={vendors}
                      formItemData={formItemData}
                      handleChange={handleChange}
                      handleSubmit={handleitemSubmit}
                      resetFormItemData={resetFormItemData}
                      setFormItemData={setFormItemData}
                    />
                    <Button onClick={addItem} variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
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
                                onAddNew={() => {
                                  setIsDesignDialogOpen(true);
                                }}
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

              {/* Payment Details Section */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Summary Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Total Amount</Label>
                      <div className="text-2xl font-bold">
                        ₹{calculateTotal().toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Payment Made</Label>
                      <div className="text-2xl font-bold">
                        ₹{(formData.amountPaid || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Due Amount</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(calculateTotal() - (formData.amountPaid || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="payment-amount">Amount Paid</Label>
                      <Input
                        id="payment-amount"
                        type="number"
                        placeholder="Enter amount received"
                        value={formData.amountPaid || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amountPaid: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-date">Received Date</Label>
                      <div className="relative cursor-pointer">
                        <input
                          id="payment-date"
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          value={formData.paidDate || ""}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              paidDate: e.target.value,
                            });
                          }}
                          className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background pr-10 py-2 text-sm ring-offset-background cursor-pointer",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            !formData.paidDate && "text-muted-foreground",
                            "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          )}
                          style={{ paddingLeft: '0.5rem' }}
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                       
                      </div>
                    </div>
                  </div>

                  {/* Notes/Remarks */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-remarks">Notes</Label>
                    <Input
                      id="payment-remarks"
                      type="text"
                      placeholder="Add payment notes or remarks"
                      value={formData.remarks || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

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
      )
      }

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
            {loading ? (
              <Loader size={40} fullScreen={true} text="Loading inwards..." color="text-blue-500" />
            ) : (<><Table>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-1"
                        onClick={() => handleViewItems(entry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
            </>
            )}
            <Dialog open={isItemsDialogOpen} onOpenChange={setIsItemsDialogOpen}>
              <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg font-semibold">
                    Bill Items - {selectedBill?.billNo}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-gray-600">
                    Vendor: {selectedBill?.vendorName} | Date:{' '}
                    {selectedBill?.inwardDate
                      ? new Date(selectedBill.inwardDate).toLocaleDateString()
                      : ''}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                  {/* Bill Items Section */}
                  <details open className="group border rounded-xl p-3 sm:p-4 bg-gray-50">
                    <summary className="cursor-pointer font-semibold text-sm sm:text-base mb-2">
                      Bill Items
                    </summary>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Design No</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBill?.items?.map((item) => (
                            <TableRow key={item.billDetailID}>
                              <TableCell className="font-medium">{item.itemName}</TableCell>
                              <TableCell>{item.designNo}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                ₹{item.price.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{item.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3">
                      {selectedBill?.items?.map((item) => (
                        <div
                          key={item.billDetailID}
                          className="border rounded-lg p-3 bg-white shadow-sm"
                        >
                          <div className="flex justify-between">
                            <span className="font-semibold">{item.itemName}</span>
                            <span>₹{item.amount.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <div>Design No: {item.designNo}</div>
                            <div>Qty: {item.quantity}</div>
                            <div>Price: ₹{item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>

                  {/* Payment History Section */}
                  {selectedBill?.billPayments?.length > 0 && (
                    <details className="group border rounded-xl p-3 sm:p-4 bg-gray-50">
                      <summary className="cursor-pointer font-semibold text-sm sm:text-base mb-2">
                        Payment History
                      </summary>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount Received</TableHead>
                              <TableHead>Remarks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedBill.billPayments.map((payment) => (
                              <TableRow key={payment.billPaymentID}>
                                <TableCell>
                                  {new Date(payment.receivedDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  ₹{payment.amountReceived.toFixed(2)}
                                </TableCell>
                                <TableCell>{payment.remarks}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="sm:hidden space-y-3">
                        {selectedBill.billPayments.map((payment) => (
                          <div
                            key={payment.billPaymentID}
                            className="border rounded-lg p-3 bg-white shadow-sm"
                          >
                            <div className="flex justify-between">
                              <span className="font-semibold">
                                {new Date(payment.receivedDate).toLocaleDateString()}
                              </span>
                              <span>₹{payment.amountReceived.toFixed(2)}</span>
                            </div>
                            {payment.remarks && (
                              <div className="text-xs text-gray-600 mt-1">
                                Remarks: {payment.remarks}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Summary Section */}
                  <div className="pt-4 border-t text-sm sm:text-base space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Quantity:</span>
                      <span>{selectedBill?.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Amount:</span>
                      <span>₹{selectedBill?.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Received:</span>
                      <span>₹{selectedBill?.totalReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-3">
                      <span>Balance Due:</span>
                      <span className="text-red-600">
                        ₹{selectedBill?.dueAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div >
  );
};

export default Inward;