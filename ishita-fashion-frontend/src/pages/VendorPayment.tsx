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

const VendorPayment = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Vendor Payment</h1>
        <p className="text-muted-foreground mt-1">
          Record payments made to vendors
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Record Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor-select">Select Vendor</Label>
              <Select>
                <SelectTrigger id="vendor-select">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ishita">Ishita Fashion</SelectItem>
                  <SelectItem value="style">Style Creations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inward-bill">Select Inward Bill</Label>
              <Select>
                <SelectTrigger id="inward-bill">
                  <SelectValue placeholder="Select bill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bill-501">
                    Bill #501 - ₹12,000 (Due: ₹8,000)
                  </SelectItem>
                  <SelectItem value="bill-502">
                    Bill #502 - ₹15,500 (Due: ₹15,500)
                  </SelectItem>
                  <SelectItem value="bill-503">
                    Bill #503 - ₹9,800 (Due: ₹4,000)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount-paid">Amount Paid</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid-date">Payment Date</Label>
                <Input id="paid-date" type="date" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Record Payment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 max-w-3xl">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium">Vendor {i}</p>
                  <p className="text-sm text-muted-foreground">
                    Bill #{500 + i} • Paid on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ₹{(5000 + i * 1000).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Payment</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayment;
