import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Search, Edit, Trash, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetItemsDropDownList } from "@/services/item/Item.Service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPartiesWithoutFilter } from "@/services/party/Party.Service";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IPartyDropdown } from "@/interfaces/party/Party";
import { useToast } from "@/hooks/use-toast";
import { IItemDropDownList } from "@/interfaces/item/Item";
import { IOutward, IOutwardBillRes } from "@/interfaces/outward/Outward";
import { useAddOutward, useGetOutwards, useDeleteOutward } from "@/services/outward/Outward.Service";
import { Pagination } from "@/components/ui/pagination";

const Outward = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [editingOutward, setEditingOutward] = useState(false);
  const [search, setSearch] = useState("");
  const [parties, setParties] = useState<IPartyDropdown[]>([]);
  const [items, setItems] = useState<IItemDropDownList[]>([]);
  const [outwardItems, setOutwardItems] = useState<IOutwardBillRes[]>([]);
  const { toast } = useToast();
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
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
    ]
  });

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
    getInwardsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }
  const getInwardsMutation = useGetOutwards({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setOutwardItems(res.data.outwards);
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
      ]
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

    console.log("📦 Submitting Final Payload:", finalData);

    // Example: Call your API here
    // await addOutwardMutation.mutateAsync(finalData);
    useAddOutwardMutation.mutate({
      billID: finalData.billID,
      partyID: finalData.partyID,
      billNo: finalData.billNo,
      gstTypeID: finalData.gstTypeID,
      totalAmount: finalData.totalAmount,
      billDate: finalData.billDate,
      isPaid: true,
      details: formData.details
    })
    setOpen(false);
    resetForm();
  };


  const handleEditOutward = (data: any) => {
    setOpen(true);
    setEditingOutward(true);
    console.log(data);
    const parsedDate = data.billDate ? new Date(data.billDate) : undefined;
    // setDate(parsedDate);
    setFormData({
      billID: data.billID || "",                    // match backend
      partyID: data.partyID || "",                  // fallback empty
      billNo: data.billNo || "",                    // include if editable
      billDate: parsedDate ? parsedDate.toISOString() : "",
      gstTypeID: data.gstTypeID || 0,               // proper field name
      totalAmount: data.totalAmount || 0,           // prefilled for UI
      isPaid: data.isPaid ?? false,                 // new boolean field
      details: data.items && data.items.length > 0
        ? data.items.map((item: any) => ({
          itemID: item.itemID || "",
          quantity: item.quantity || 0,
          price: item.price || 0
        }))
        : [
          {
            itemID: "",
            quantity: 0,
            price: 0
          }
        ]
    });

    // Optional: if you maintain a `date` state for the calendar picker
    // setDate(parsedDate);
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
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{new Date(entry.billDate).toLocaleString()}</TableCell>
                      <TableCell>₹{entry.totalAmount}</TableCell>
                      <TableCell>
                        ₹{(entry.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Outward;