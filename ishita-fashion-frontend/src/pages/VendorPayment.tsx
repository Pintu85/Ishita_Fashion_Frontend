import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetVendorsForPayment, useGetVendorById, useAddVendorPayment, useGetVendorPayments } from "@/services/vendor/Vendor.Service";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { IVendorDropdown } from "@/interfaces/vendor/Vendor";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { useGetInwardDropdownList } from "@/services/inward/Inwars.Service";
import { IInwardDropdown } from "@/interfaces/Inward/Inward";
import { Pagination } from "@/components/ui/pagination";
import { IVendorPayment } from "@/interfaces/vendor/VendorPayment";

const VendorPayment = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [vendors, setVendors] = useState<IVendorDropdown[]>([]);
  const [selectedVendorID, setSelectedVendorID] = useState<string>("");
  const [selectedInwardID, setSelectedInwardID] = useState<string>("");
  const [inwards, setInwards] = useState<IInwardDropdown[]>([]);
  const [amountPaid, setAmountPaid] = useState<number | string>("");
  const [paidDate, setPaidDate] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [editingPayment, setEditingPayment] = useState<IVendorPayment | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<IVendorPayment | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [payments, setPayments] = useState<IVendorPayment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedInwardDetails, setSelectedInwardDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPayments, setFilteredPayments] = useState<IVendorPayment[] | null>(null);
  const pageNumber = useRef(1);
  const { toast } = useToast();

  // Get paginated payments
  const getVendorPaymentsMutation = useGetVendorPayments({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200 && res.data) {
        setPayments(res.data.payments);
        setTotalCount(res.data.totalCount);
      }
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.statusMessage || err?.message || "Something went wrong";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    },
  });

  const loadPayments = async () => {
    try {
      await getVendorPaymentsMutation.mutateAsync({
        pageNumber: pageNumber.current,
        pageSize,
        searchQuery: searchQuery,
      });
    } catch (err) {
      console.error("Failed to load payments:", err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []); // Load only on mount

  // If the payments list changes while a filter is active, re-apply the filter
  useEffect(() => {
    if (filteredPayments !== null) {
      const q = searchQuery.trim().toLowerCase();
      if (q === "") {
        setFilteredPayments(null);
      } else {
        setFilteredPayments(
          payments.filter((p) => {
            const s = q;
            return (
              (p.vendorName || "").toString().toLowerCase().includes(s) ||
              (p.billNo || "").toString().toLowerCase().includes(s) ||
              (p.remarks || "").toString().toLowerCase().includes(s) ||
              p.amountPaid?.toString().includes(s) ||
              p.dueAmount?.toString().includes(s)
            );
          })
        );
      }
    }
  }, [payments]);

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    loadPayments();
  };

  // We'll fetch vendors when the Record Payment sheet opens so the list is fresh
  const getVendorsForPaymentMutation = useGetVendorsForPayment({
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

  useEffect(() => {
    if (open) {
      // use mutateAsync and catch errors to avoid unhandled promise rejections
      (async () => {
        try {
          await getVendorsForPaymentMutation.mutateAsync({});
        } catch (err: any) {
          const errorMsg =
            err?.response?.data?.statusMessage ||
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong";

          console.error("Failed to fetch vendors for payment:", err);
          toast({ title: "Error occurred", description: errorMsg, variant: "destructive" });
        }
      })();
    }
  }, [open]);

  // Fetch vendor details (inward list) when a vendor is selected
  const getVendorByIdMutation = useGetVendorById({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200 && res.data) {
        // expected res.data.inwardDetails
        setInwards(res.data.inwardDetails || []);
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

  useEffect(() => {
    if (selectedVendorID) {
      // call API to get vendor by id (API will receive jwt via Api interceptor)
      (async () => {
        try {
          await getVendorByIdMutation.mutateAsync({ vendorId: selectedVendorID });
        } catch (err: any) {
          const errorMsg =
            err?.response?.data?.statusMessage ||
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong";

          console.error("Failed to fetch vendor details:", err);
          toast({ title: "Error occurred", description: errorMsg, variant: "destructive" });
        }
      })();
    } else {
      setInwards([]);
      setSelectedInwardID("");
    }
  }, [selectedVendorID]);

  const addVendorPaymentMutation = useAddVendorPayment({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        toast({ title: "Success", description: "Payment recorded.", variant: "default" });
        // reset form
        setSelectedVendorID("");
        setSelectedInwardID("");
        setAmountPaid("");
        setPaidDate("");
        setRemarks("");
        setOpen(false);
        // Refresh payments list
        loadPayments();
      } else {
        toast({ title: "Error", description: res.statusMessage || "Failed to record payment", variant: "destructive" });
      }
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.statusMessage || err?.message || "Something went wrong";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setSelectedVendorID("");
    setSelectedInwardID("");
    setAmountPaid("");
    setPaidDate("");
    setRemarks("");
    setEditingPayment(null);
    setIsEditing(false);
  };

  const handleEditClick = (payment: IVendorPayment) => {
    setIsEditing(true);
    setEditingPayment(payment);
    setSelectedVendorID(payment.vendorID);
    setSelectedInwardID(payment.inwardID);
    setAmountPaid(payment.amountPaid);
    setPaidDate(new Date(payment.paidDate).toISOString().split('T')[0]);
    setRemarks(payment.remarks || "");
    setOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Vendor Payment</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Record payments made to vendors
          </p>
        </div>
        <Sheet open={open} onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            resetForm();
          }
        }}>
          <SheetTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Record Payment</span>
              <span className="sm:hidden">New Payment</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{isEditing ? 'Edit Payment' : 'Record Payment'}</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Combobox
                  options={vendors.map((x: any) => ({
                    value: x.vendorID,
                    // display as vendorName-mobileNo (no extra spaces)
                    label: `${x.vendorName}${x.mobileNo ? `-${x.mobileNo}` : ''}`,
                  }))}
                  value={selectedVendorID}
                  onValueChange={(val) => setSelectedVendorID(val)}
                  placeholder="Select vendor"
                  searchPlaceholder="Search vendor..."
                />
                {/* {validationErrors.vendorID && (
                                    <p className="text-red-500 text-sm">{validationErrors.vendorID}</p>
                                  )} */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inward-bill">Inward Bill *</Label>
                <Select value={selectedInwardID} onValueChange={setSelectedInwardID} disabled={!selectedVendorID}>
                  <SelectTrigger id="inward-bill">
                    <SelectValue placeholder="Choose bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {inwards && inwards.length > 0 ? (
                      inwards.map((inv: any) => (
                        <SelectItem key={inv.inwardID} value={inv.inwardID}>
                          Bill #{inv.billNo} - Total: ₹{(inv.totalPurchaseAmount || 0).toLocaleString()} | Due: ₹{(inv.dueAmount || 0).toLocaleString()}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-inward" disabled>
                        No inward bills
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedInwardID && inwards && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bill Amount</p>
                      <p className="text-sm font-semibold text-foreground">
                        ₹{(inwards.find(inv => inv.inwardID === selectedInwardID)?.totalPurchaseAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount Due</p>
                      <p className="text-sm font-semibold text-destructive">
                        ₹{(inwards.find(inv => inv.inwardID === selectedInwardID)?.dueAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paid Amount</p>
                      <p className="text-sm font-semibold text-green-600">
                        ₹{(inwards.find(inv => inv.inwardID === selectedInwardID)?.amountPaid || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount-paid">Amount Paid</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  placeholder="Enter amount"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid-date">Payment Date</Label>
                <Input id="paid-date" type="date" max={new Date().toISOString().split("T")[0]} value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => {
                  setOpen(false);
                  resetForm();
                }}>
                  Cancel  
                </Button>
                <Button onClick={async () => {
                  // validate
                  if (!selectedVendorID) {
                    toast({ title: "Validation", description: "Please select a vendor.", variant: "destructive" });
                    return;
                  }
                  if (!selectedInwardID) {
                    toast({ title: "Validation", description: "Please select an inward bill.", variant: "destructive" });
                    return;
                  }
                  if (!amountPaid || Number(amountPaid) <= 0) {
                    toast({ title: "Validation", description: "Please enter a valid amount.", variant: "destructive" });
                    return;
                  }
                  if (!paidDate) {
                    toast({ title: "Validation", description: "Please select a payment date.", variant: "destructive" });
                    return;
                  }

                  const payload = {
                    vendorPaymentID: isEditing ? editingPayment?.vendorPaymentID || null : null,
                    vendorID: selectedVendorID,
                    inwardID: selectedInwardID,
                    amountPaid: Number(amountPaid),
                    paidDate: new Date(paidDate).toISOString(),
                    remarks: remarks || "",
                  };

                  try {
                    await addVendorPaymentMutation.mutateAsync(payload);
                    // onSuccess will handle UI updates
                  } catch (err) {
                    // error handled in mutation onError, but catch to avoid unhandled
                    console.error('Add payment error', err);
                  }
                }}>{isEditing ? 'Update Payment' : 'Record Payment'}</Button>
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
              <div>
  <Input
    placeholder="Search payments..."
    className="pl-9"
    value={searchQuery}
    onChange={(e) => {
      const q = e.target.value;
      setSearchQuery(q);

      // Live search (filter as user types)
      if (q.trim() === "") {
        setFilteredPayments(null);
        pageNumber.current = 1;
        loadPayments();
        return;
      }

      const s = q.toLowerCase();
      setFilteredPayments(
        payments.filter((p) =>
          (p.vendorName || "").toLowerCase().includes(s) ||
          (p.billNo || "").toLowerCase().includes(s) ||
          (p.remarks || "").toLowerCase().includes(s) ||
          p.amountPaid?.toString().includes(s) ||
          p.dueAmount?.toString().includes(s)
        )
      );
    }}
  />
</div>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Bill No.</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Due Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredPayments ?? payments).map((payment) => (
                    <TableRow key={payment.vendorPaymentID}>
                      <TableCell className="font-medium">{payment.vendorName}</TableCell>
                      <TableCell>#{payment.billNo}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ₹{payment.amountPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-destructive">
                        ₹{payment.dueAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.paidDate).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentDetails(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(payment)}>
                          <Edit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg font-semibold">
                  Bill Details - #{selectedPayment?.billNo}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-600">
                  Vendor: {selectedPayment?.vendorName} | Date:{' '}
                  {selectedPayment?.paidDate
                    ? new Date(selectedPayment.paidDate).toLocaleDateString()
                    : ''}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {/* Bill Items Section */}
                <div className="border rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold mb-3">Inward Items</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPayment?.inwardDetails?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.price.toLocaleString()}</TableCell>
                            <TableCell>₹{(item.quantity * item.price).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="pt-4 border-t text-sm sm:text-base space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Quantity:</span>
                    <span>{selectedPayment?.inwardDetails?.reduce((sum: number, item: any) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span>₹{selectedPayment?.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span className="font-semibold">Balance Due:</span>
                    <span>₹{selectedPayment?.dueAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-4 flex justify-end">
            <Pagination
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={pageNumber.current}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayment;
