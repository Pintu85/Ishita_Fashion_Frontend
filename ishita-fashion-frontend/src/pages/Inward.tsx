import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Inward = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Inward of Material</h1>
        <p className="text-muted-foreground mt-1">
          Record material received from vendors
        </p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Add Inward Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select>
                  <SelectTrigger id="vendor">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ishita">Ishita Fashion</SelectItem>
                    <SelectItem value="style">Style Creations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="design">Design</Label>
                <Select>
                  <SelectTrigger id="design">
                    <SelectValue placeholder="Select design" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="krt-001">KRT-001 - Floral Kurti</SelectItem>
                    <SelectItem value="krt-002">KRT-002 - Plain Midi</SelectItem>
                    <SelectItem value="add-new">+ Add New Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost per Piece</Label>
                <Input id="cost" type="number" placeholder="Enter cost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">Selling Price (Read Only)</Label>
                <Input
                  id="selling-price"
                  type="number"
                  placeholder="₹750"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bill-no">Bill Number</Label>
                <Input id="bill-no" placeholder="Enter bill number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challan-no">Challan Number</Label>
                <Input id="challan-no" placeholder="Enter challan number" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total Amount</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="Auto-calculated"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Payment Amount</Label>
              <Input
                id="payment"
                type="number"
                placeholder="Enter amount paid (optional)"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Inward Entry</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 max-w-4xl">
        <CardHeader>
          <CardTitle>Recent Inward Entries</CardTitle>
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
                    Design: KRT-00{i} • Qty: {10 + i} • Bill: #{500 + i}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{(12000 + i * 500).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inward;
