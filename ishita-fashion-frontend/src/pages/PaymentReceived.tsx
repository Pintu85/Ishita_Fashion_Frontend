import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaymentReceived = () => {
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedBill, setSelectedBill] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const bills = {
    party1: [
      { id: "bill-1001", number: "1001", total: 45000, due: 20000 },
      { id: "bill-1003", number: "1003", total: 52000, due: 15000 },
    ],
    party2: [
      { id: "bill-1002", number: "1002", total: 38500, due: 38500 },
    ],
  };

  const currentBills = selectedParty ? bills[selectedParty as keyof typeof bills] || [] : [];
  const currentBill = currentBills.find(b => b.id === selectedBill);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payment Received</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Record payments received from parties
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Record New Payment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="party-select" className="text-base">Party Name *</Label>
                  <Select value={selectedParty} onValueChange={(val) => {
                    setSelectedParty(val);
                    setSelectedBill("");
                  }}>
                    <SelectTrigger id="party-select" className="h-11">
                      <SelectValue placeholder="Choose party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="party1">Shree Garments</SelectItem>
                      <SelectItem value="party2">Fashion Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale-bill" className="text-base">Sale Bill *</Label>
                  <Select value={selectedBill} onValueChange={setSelectedBill} disabled={!selectedParty}>
                    <SelectTrigger id="sale-bill" className="h-11">
                      <SelectValue placeholder="Choose bill" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentBills.map(bill => (
                        <SelectItem key={bill.id} value={bill.id}>
                          Bill #{bill.number} - Total: ₹{bill.total.toLocaleString()} | Due: ₹{bill.due.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentBill && (
                <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bill Amount</p>
                      <p className="text-lg font-semibold text-foreground">₹{currentBill.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                      <p className="text-lg font-semibold text-destructive">₹{currentBill.due.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Paid Amount</p>
                      <p className="text-lg font-semibold text-green-600">₹{(currentBill.total - currentBill.due).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount-received" className="text-base">Amount Received (₹) *</Label>
                  <Input
                    id="amount-received"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-11 text-base"
                    max={currentBill?.due}
                  />
                  {currentBill && amount && Number(amount) > currentBill.due && (
                    <p className="text-sm text-destructive">Amount exceeds due amount</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received-date" className="text-base">Payment Date *</Label>
                  <Input 
                    id="received-date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11" 
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Clear</Button>
                <Button size="lg" disabled={!selectedParty || !selectedBill || !amount} className="w-full sm:w-auto">
                  Record Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { party: "Shree Garments", bill: "1001", amount: 20000, date: "2025-10-05" },
                { party: "Fashion Hub", bill: "1002", amount: 15000, date: "2025-10-04" },
                { party: "Shree Garments", bill: "1003", amount: 18000, date: "2025-10-03" },
              ].map((payment, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors gap-2 sm:gap-0"
                >
                  <div className="w-full sm:w-auto">
                    <p className="font-semibold text-foreground">{payment.party}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Bill #{payment.bill} • {new Date(payment.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReceived;

