import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye } from "lucide-react";
import type { BillDetail } from "@/services/PaymentReceived/PaymentReceived.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pagination } from "@/components/ui/pagination";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// === HOOKS & TYPES ===
import {
  useGetPartiesDropdown,
  useGetPartyById,
  useAddBillPayment,
  useGetBillPayments,
  PartyDropdown,
  PartyDetailsResponse,
  AddBillPaymentPayload,
} from "@/services/PaymentReceived/PaymentReceived.service";

const PaymentReceived = () => {
  const [open, setOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedBill, setSelectedBill] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bills, setBills] = useState<any[]>([]);
  const [filteredBills, setFilteredBills] = useState<any[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBillDetails, setSelectedBillDetails] = useState<any | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pageNumber = useRef(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [remarks, setRemarks] = useState<string>("");

  // === FETCH PARTIES DROPDOWN ===
  const getPartiesMutation = useGetPartiesDropdown();
  const [parties, setParties] = useState<PartyDropdown[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await getPartiesMutation.mutateAsync();
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setParties(res.data);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load customers",
          variant: "destructive",
        });
      }
    };
    fetchParties();
  }, []);

  // === FETCH PARTY BILLS BY PARTY ID ===
  const getPartyByIdMutation = useGetPartyById();
  const [partyBillDetails, setPartyBillDetails] = useState<PartyDetailsResponse | null>(null);

  useEffect(() => {
    if (!selectedParty) {
      setPartyBillDetails(null);
      setSelectedBill("");
      return;
    }

    const fetchPartyDetails = async () => {
      try {
        const res = await getPartyByIdMutation.mutateAsync({ partyId: selectedParty });
        if (res.statusCode === 200 && res.data) {
          setPartyBillDetails(res.data);
        } else {
          setPartyBillDetails(null);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load bills for this customer",
          variant: "destructive",
        });
        setPartyBillDetails(null);
      }
    };

    fetchPartyDetails();
  }, [selectedParty]);

  // === FETCH PAGINATED BILLS ===
  const getBillPaymentsMutation = useGetBillPayments({
    onSuccess: (res: any) => {
      if (res.statusCode === 200 && res.data?.outwards) {
        setBills(res.data.outwards);
        setTotalCount(res.data.totalCount || 0);
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage || err?.message || "Something went wrong";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    },
  });

  const loadBills = async () => {
    try {
      await getBillPaymentsMutation.mutateAsync({
        pageNumber: pageNumber.current,
        pageSize,
        searchQuery: searchQuery.trim() || undefined,
      });
    } catch (err) {
      console.error("Failed to load bills:", err);
    }
  };

  useEffect(() => {
    loadBills();
  }, []); // Load only on mount

  // If the bills list changes while a filter is active, re-apply the filter
  useEffect(() => {
    if (filteredBills !== null) {
      const q = searchQuery.trim().toLowerCase();
      if (q === "") {
        setFilteredBills(null);
      } else {
        setFilteredBills(
          bills.filter((b) => {
            const s = q;
            return (
              (b.partyName || "").toString().toLowerCase().includes(s) ||
              (b.billNo || "").toString().toLowerCase().includes(s) ||
              b.totalAmount?.toString().includes(s) ||
              b.dueAmount?.toString().includes(s) ||
              b.totalReceived?.toString().includes(s)
            );
          })
        );
      }
    }
  }, [bills]);

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    loadBills();
  };

  // === ADD BILL PAYMENT ===
  const addBillPaymentMutation = useAddBillPayment();

  const handleRecordPayment = async () => {
    if (!selectedBill || !amount || !date || !selectedParty) return;

    const payload: AddBillPaymentPayload = {
      partyID: selectedParty,
      billID: selectedBill,
      amountReceived: Number(amount),
      receivedDate: new Date(date).toISOString(),
      remarks: remarks.trim(),
    };

    try {
      const res = await addBillPaymentMutation.mutateAsync(payload);
      console.log("Add Bill Payment Response:", res);
      if (res.statusCode === 201) {
        toast({
          title: "Success",
          description: `₹${Number(amount).toLocaleString()} recorded for ${partyBillDetails?.party.partyName}`,
        });
        setOpen(false);
        setSelectedParty("");
        setSelectedBill("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setRemarks("");
        setPartyBillDetails(null);
        loadBills();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  // Derive current bills from party details
  const currentPartyBills: BillDetail[] = partyBillDetails?.billDetails ?? [];
  const currentBill = currentPartyBills.find((b) => b.billID === selectedBill);

  if (getBillPaymentsMutation.isPending && bills.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header + Record Payment Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Payment Received
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Record payments received from customers
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Record Payment</span>
              <span className="sm:hidden">New</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Record Payment</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {/* Customer Select */}
              <div className="space-y-2">
                <Label htmlFor="party-select">Customer *</Label>
                <Select
                  value={selectedParty}
                  onValueChange={(val) => {
                    setSelectedParty(val);
                    setSelectedBill("");
                  }}
                  disabled={getPartiesMutation.isPending}
                >
                  <SelectTrigger id="party-select">
                    <SelectValue placeholder={getPartiesMutation.isPending ? "Loading customers..." : "Choose customer"} />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {getPartiesMutation.isPending ? "Loading..." : "No customers found"}
                      </div>
                    ) : (
                      parties
                        .sort((a, b) => a.partyName.localeCompare(b.partyName))
                        .map((party) => (
                          <SelectItem key={party.partyID} value={party.partyID}>
                            {party.partyName}
                            {party.mobileNo && ` (${party.mobileNo})`}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Bill Select */}
              <div className="space-y-2">
                <Label htmlFor="sale-bill">Sale Bill *</Label>
                <Select
                  value={selectedBill}
                  onValueChange={setSelectedBill}
                  disabled={!selectedParty || getPartyByIdMutation.isPending}
                >
                  <SelectTrigger id="sale-bill">
                    <SelectValue
                      placeholder={
                        getPartyByIdMutation.isPending
                          ? "Loading bills…"
                          : currentPartyBills.length === 0
                            ? "No due bills"
                            : "Choose bill"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {getPartyByIdMutation.isPending ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                      </div>
                    ) : currentPartyBills.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No due bills found
                      </div>
                    ) : (
                      currentPartyBills
                        .filter((b) => b.dueAmount > 0)
                        .sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime())
                        .map((bill) => (
                          <SelectItem key={bill.billID} value={bill.billID}>
                            #{bill.billNo}{" "}
                            ({new Date(bill.billDate).toLocaleDateString("en-IN")})
                            {" – "}₹{bill.totalAmount.toLocaleString()}{" "}
                            | Due: <span className="font-semibold text-destructive">
                              ₹{bill.dueAmount.toLocaleString()}
                            </span>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Bill Summary */}
              {currentBill && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bill Amount</p>
                      <p className="text-sm font-semibold">₹{currentBill.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Due</p>
                      <p className="text-sm font-semibold text-destructive">
                        ₹{currentBill.dueAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Received</p>
                      <p className="text-sm font-semibold text-green-600">
                        ₹{currentBill.totalReceived.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount-received">Amount Received *</Label>
                <Input
                  id="amount-received"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={currentBill?.dueAmount}
                />
                {currentBill && amount && Number(amount) > currentBill.dueAmount && (
                  <p className="text-sm text-destructive">Amount exceeds due</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <Label htmlFor="received-date">Payment Date *</Label>
                <Input
                  id="received-date"
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="pr-10"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={
                    !selectedParty ||
                    !selectedBill ||
                    !amount ||
                    !date ||
                    Number(amount) <= 0 ||
                    (currentBill && Number(amount) > currentBill.dueAmount) ||
                    addBillPaymentMutation.isPending
                  }
                  onClick={handleRecordPayment}
                >
                  {addBillPaymentMutation.isPending ? "Recording..." : "Record Payment"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setSearchQuery(q);

                  // Live search (filter as user types)
                  if (q.trim() === "") {
                    setFilteredBills(null);
                    pageNumber.current = 1;
                    loadBills();
                    return;
                  }

                  const s = q.toLowerCase();
                  setFilteredBills(
                    bills.filter((b) =>
                      (b.partyName || "").toLowerCase().includes(s) ||
                      (b.billNo || "").toLowerCase().includes(s) ||
                      b.totalAmount?.toString().includes(s) ||
                      b.dueAmount?.toString().includes(s) ||
                      b.totalReceived?.toString().includes(s)
                    )
                  );
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Bill No.</TableHead>
                    <TableHead>Received amount</TableHead>
                    <TableHead>Due amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No bills found
                      </TableCell>
                    </TableRow>
                  ) : (
                    (filteredBills ?? bills).map((bill) => (
                      <TableRow key={bill.billID}>
                        <TableCell className="font-medium">{bill.partyName}</TableCell>
                        <TableCell className="font-medium">{bill.totalQuantity}</TableCell>
                        <TableCell>#{bill.billNo}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ₹{bill.totalReceived.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-destructive">
                          ₹{bill.dueAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(bill.billDate).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBillDetails(bill);
                              setShowPaymentDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {/* Pagination */}
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

      {/* Bill Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details - #{selectedBillDetails?.billNo}</DialogTitle>
            <DialogDescription>
              Customer: {selectedBillDetails?.partyName} | Date:{" "}
              {selectedBillDetails?.billDate
                ? new Date(selectedBillDetails.billDate).toLocaleDateString("en-IN")
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            {/* Items Table */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Design</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBillDetails?.items?.length ? (
                    selectedBillDetails.items.map((item: any) => (
                      <TableRow key={item.billDetailID}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.designNo}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Payment History */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Payment History</h3>
              {selectedBillDetails?.billPayments && selectedBillDetails.billPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBillDetails.billPayments.map((p: any) => (
                      <TableRow key={p.billPaymentID}>
                        <TableCell>{new Date(p.receivedDate).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          ₹{p.amountReceived.toLocaleString()}
                        </TableCell>
                        <TableCell>{p.remarks || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">No payments recorded yet</p>
              )}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Total Qty:</span>
                <span>{selectedBillDetails?.totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span>₹{selectedBillDetails?.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="font-semibold">Received:</span>
                <span>₹{selectedBillDetails?.totalReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span className="font-semibold">Due:</span>
                <span>₹{selectedBillDetails?.dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentReceived;