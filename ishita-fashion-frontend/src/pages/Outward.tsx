import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Search, Edit, Trash, Eye, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetItemsDropDownList } from "@/services/item/Item.Service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useGetPartiesWithoutFilter } from "@/services/party/Party.Service";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IPartyDropdown } from "@/interfaces/party/Party";
import { useToast } from "@/hooks/use-toast";
import { IItemDropDownList } from "@/interfaces/item/Item";
import { IOutward, IOutwardBillRes } from "@/interfaces/outward/Outward";
import { useAddOutward, useGetOutwards, useDeleteOutward } from "@/services/outward/Outward.Service";
import { Pagination } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const Outward = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [editingOutward, setEditingOutward] = useState(false);
  const [search, setSearch] = useState("");
  const [parties, setParties] = useState<IPartyDropdown[]>([]);
  const [items, setItems] = useState<IItemDropDownList[]>([]);
  const [outwardItems, setOutwardItems] = useState<IOutwardBillRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IOutward>({
    billID: "",
    partyID: "",
    billNo: "",
    gstTypeID: 0,
    totalAmount: 0,
    billDate: "",
    isPaid: false,
    details: [
      {
        itemID: "",
        quantity: 0,
        price: 0
      }
    ],
    billPaymentRequest: {
      billPaymentID: "",
      partyID: "",
      billID: "",
      amountReceived: 0,
      receivedDate: "",
      remarks: "",
    }
  });

  const handleViewItems = (entry) => {
    setSelectedBill(entry);
    setIsItemsDialogOpen(true);
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    getpartiesDropDownList();
    getItemsDropDownList();
  }, [])

  useEffect(() => {
    if (search.trim() !== "") {
      getOutWardList(search);
    }
    else {
      getOutWardList("");
    }
  }, [search]);

  const onSearch = (value: string) => {
    pageNumber.current = 1;
    setSearch(value);
  }


  const getOutWardList = (value: string) => {
    setLoading(true);
    getInwardsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }
  const getInwardsMutation = useGetOutwards({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setOutwardItems(res.data.outwards);
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
    },
  });

  const getpartiesDropDownList = () => {
    getPartiesMutation.mutate({});
  };

  const getPartiesMutation = useGetPartiesWithoutFilter({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setParties(res.data);
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

  const useAddOutwardMutation = useAddOutward({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 201 || 200) {
        resetForm();
        getOutWardList("");
        setEditingOutward(false);
        toast({
          title: editingOutward ? "Outward Updated" : "Outward Added",
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

  const handleCancel = () => {
    setOpen(false);
    setEditingOutward(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      billID: "",
      partyID: "",
      billNo: "",
      gstTypeID: 0,
      totalAmount: 0,
      billDate: "",
      isPaid: false,
      details: [
        {
          itemID: "",
          quantity: 0,
          price: 0
        }
      ],
      billPaymentRequest: {
        billPaymentID: "",
        partyID: "",
        billID: "",
        amountReceived: 0,
        receivedDate: "",
        remarks: "",
      }
    });
    setDate(undefined);
    setValidationErrors({});
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedDetails = [...formData.details];
    const updatedValue = field === "quantity" || field === "price" ? Number(value) : value;

    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: updatedValue,
    };

    const newTotal = updatedDetails.reduce(
      (acc, item) => acc + (item.quantity * item.price),
      0
    );

    setFormData({
      ...formData,
      details: updatedDetails,
      totalAmount: newTotal,
    });
  };


  const addItem = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { itemID: "", quantity: 0, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: updatedDetails });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.partyID) errors.partyID = "Please select a party.";
    if (!formData.billDate) errors.billDate = "Please select a bill date.";
    if (!formData.gstTypeID) errors.gstTypeID = "Please select a GST type.";
    if (formData.details.length === 0)
      errors.details = "Please add at least one item.";

    formData.details.forEach((item, index) => {
      if (!item.itemID)
        errors[`item_${index}_itemID`] = `Select design for item ${index + 1}.`;
      if (item.quantity <= 0)
        errors[`item_${index}_quantity`] = `Quantity must be greater than 0 for item ${index + 1}.`;
      if (item.price <= 0)
        errors[`item_${index}_price`] = `Price must be greater than 0 for item ${index + 1}.`;
    });

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleSubmit = () => {
    if (!validateForm()) return;

    const finalData = {
      ...formData,
      totalAmount: calculateTotal(),
      billDate: formData.billDate || new Date().toISOString(),
      isPaid: formData.totalAmount > 0 && formData.totalAmount <= calculateTotal(),
    };
    useAddOutwardMutation.mutate({
      billID: finalData.billID,
      partyID: finalData.partyID,
      billNo: finalData.billNo,
      gstTypeID: finalData.gstTypeID,
      totalAmount: finalData.totalAmount,
      billDate: finalData.billDate,
      isPaid: true,
      details: formData.details,
      billPaymentRequest: formData.billPaymentRequest
    })
    setOpen(false);
    resetForm();
  };

  const handleEditOutward = (data: any) => {
    setOpen(true);
    setEditingOutward(true);

    // Parse main and payment dates
    const parsedDate = data.billDate ? new Date(data.billDate) : undefined;
    const firstPayment = data.billPayments && data.billPayments.length > 0 ? data.billPayments[0] : null;
    const parsedReceivedDate = firstPayment?.receivedDate ? new Date(firstPayment.receivedDate) : undefined;

    // Prepare form data
    const updatedFormData = {
      billID: data.billID || "",
      partyID: data.partyID || "",
      billNo: data.billNo || "",
      billDate: parsedDate ? parsedDate.toISOString().split("T")[0] : "", // yyyy-MM-dd
      gstTypeID: data.gstTypeID || 0,
      totalAmount: data.totalAmount || 0,
      isPaid: data.isPaid ?? false,

      details:
        data.items && data.items.length > 0
          ? data.items.map((item: any) => ({
            itemID: item.itemID || "",
            quantity: item.quantity || 0,
            price: item.price || 0,
          }))
          : [
            {
              itemID: "",
              quantity: 0,
              price: 0,
            },
          ],

      billPaymentRequest: {
        billPaymentID: firstPayment?.billPaymentID || "",
        partyID: data.partyID || "",
        billID: data.billID || "",
        amountReceived: firstPayment?.amountReceived || 0,
        receivedDate: parsedReceivedDate
          ? parsedReceivedDate.toISOString().split("T")[0]
          : "",
        remarks: firstPayment?.remarks || "",
      },
    };

    setFormData(updatedFormData);
  };

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    let size = pageSize;
    setPageSize(size);
    getOutWardList("");
  };

  const handleDeleteOutward = (billID: string) => {
    useDeleteInwardMutation.mutate({ billID: billID })
  }

  const useDeleteInwardMutation = useDeleteOutward({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        getOutWardList("");
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

  const calculateTotal = () => {
    return formData.details.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  };


  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Outward / Sale
          </h1>
          <p className="text-muted-foreground mt-1">
            Create sale bills for your customers
          </p>
        </div>

        <Button className="gap-2 w-full sm:w-auto" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Outward
        </Button>
      </div>

      {open && (
        <Card className="mb-3 w-full max-w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {editingOutward ? "Update Sale Bill" : "Create Sale Bill"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:gap-6">

              {/* Party and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party">Select Party</Label>
                  <Combobox
                    options={parties.map((party) => ({
                      value: party.partyID,
                      label: party.partyName,
                    }))}
                    onValueChange={(val) => setFormData({ ...formData, partyID: val })}
                    placeholder="Select party"
                    searchPlaceholder="Search party..."
                    value={formData.partyID}
                  />
                  {validationErrors.partyID && (
                    <p className="text-red-500 text-sm">{validationErrors.partyID}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Bill Date</Label>
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
                          setFormData({ ...formData, billDate: d ? d.toISOString() : "" });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {validationErrors.billDate && (
                    <p className="text-red-500 text-sm">{validationErrors.billDate}</p>
                  )}
                </div>
              </div>

              {/* GST and Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gst-type">GST Type</Label>
                  <Select
                    value={formData.gstTypeID.toString()}
                    onValueChange={(val) => setFormData({ ...formData, gstTypeID: Number(val) })}
                  >
                    <SelectTrigger id="gst-type">
                      <SelectValue placeholder="Select GST type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Select GST Type</SelectItem>
                      <SelectItem value="1">Gujarat (SGST + CGST)</SelectItem>
                      <SelectItem value="2">Other State (IGST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Total */}
                <div className="space-y-2">
                  <Label htmlFor="total">Grand Total</Label>
                  <Input
                    id="total"
                    type="number"
                    placeholder="Auto-calculated"
                    disabled
                    className="bg-muted text-lg font-semibold"
                    value={calculateTotal().toFixed(2)}
                  />
                </div>
              </div>

              {/* Item Details Table */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <Label className="text-base sm:text-lg font-semibold">Item Details</Label>
                  <Button onClick={addItem} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[600px] sm:min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[160px] sm:min-w-[200px]">Design</TableHead>
                          <TableHead className="min-w-[80px] sm:min-w-[100px]">Qty</TableHead>
                          <TableHead className="min-w-[100px] sm:min-w-[120px]">Cost/Piece</TableHead>
                          <TableHead className="min-w-[100px]">Total</TableHead>
                          <TableHead className="w-[50px] sm:w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {formData.details.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Combobox
                                options={items.map((x: any) => ({
                                  value: x.itemID.toString(),
                                  label: x.designNo + "-" + x.itemName,
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
                              {validationErrors[`item_${index}_quantity`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {validationErrors[`item_${index}_quantity`]}
                                </p>
                              )}
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
                              {validationErrors[`item_${index}_price`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {validationErrors[`item_${index}_price`]}
                                </p>
                              )}
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
                        ₹{(formData.billPaymentRequest?.amountReceived || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Due Amount</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(calculateTotal() - (formData.billPaymentRequest?.amountReceived || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="payment-amount">Amount Received</Label>
                      <Input
                        id="payment-amount"
                        type="number"
                        placeholder="Enter amount received"
                        value={formData.billPaymentRequest?.amountReceived || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billPaymentRequest: {
                              ...formData.billPaymentRequest,
                              amountReceived: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-date">Received Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="payment-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.billPaymentRequest?.receivedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            {formData.billPaymentRequest?.receivedDate
                              ? format(new Date(formData.billPaymentRequest.receivedDate), "dd MMM yyyy")
                              : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start" side="bottom">
                          <Calendar
                            mode="single"
                            selected={
                              formData.billPaymentRequest?.receivedDate
                                ? new Date(formData.billPaymentRequest.receivedDate)
                                : undefined
                            }
                            onSelect={(d) => {
                              setFormData({
                                ...formData,
                                billPaymentRequest: {
                                  ...formData.billPaymentRequest,
                                  receivedDate: d ? d.toISOString().split("T")[0] : "",
                                },
                              });
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Notes/Remarks */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-remarks">Notes</Label>
                    <Input
                      id="payment-remarks"
                      type="text"
                      placeholder="Add payment notes or remarks"
                      value={formData.billPaymentRequest?.remarks || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billPaymentRequest: {
                            ...formData.billPaymentRequest,
                            remarks: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button onClick={handleCancel} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="w-full sm:w-auto">
                  {editingOutward ? "Update Bill" : "Create Bill"}
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
              <Input placeholder="Search outward entries..." className="pl-9" value={search} onChange={(e) => onSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <Loader size={40} fullScreen={true} text="Loading outwards..." color="text-blue-500" />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Bill Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outwardItems
                      .map((entry) => (
                        <TableRow key={entry.billID}>
                          <TableCell className="font-medium">{entry.partyName}</TableCell>
                          <TableCell>{entry.totalQuantity}</TableCell>
                          <TableCell>{new Date(entry.billDate).toLocaleString()}</TableCell>
                          <TableCell>₹{entry.totalAmount}</TableCell>
                          <TableCell>
                            ₹{(entry.dueAmount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-1"
                              onClick={() => handleViewItems(entry)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-1"
                              onClick={() => handleEditOutward(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOutward(entry.billID)}
                            >
                              <Trash className="h-4 w-4" />
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
                    Party: {selectedBill?.partyName} | Date:{' '}
                    {selectedBill?.billDate
                      ? new Date(selectedBill.billDate).toLocaleDateString()
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
                      <span>{selectedBill?.totalQuantity}</span>
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
    </div>
  );
};

export default Outward;