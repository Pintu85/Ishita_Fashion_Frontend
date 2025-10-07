import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
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

const Outward = () => {
  const [items, setItems] = useState([{ id: 1 }]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Outward / Sale</h1>
        <p className="text-muted-foreground mt-1">
          Create sale bills for your customers
        </p>
      </div>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Create Sale Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="party">Select Party</Label>
                <Select>
                  <SelectTrigger id="party">
                    <SelectValue placeholder="Select party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="party1">Shree Garments</SelectItem>
                    <SelectItem value="party2">Fashion Hub</SelectItem>
                    <SelectItem value="add-new">+ Add New Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-date">Bill Date</Label>
                <Input id="bill-date" type="date" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Item Details</Label>
                <Button onClick={addItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Design</TableHead>
                      <TableHead className="w-[120px]">Quantity</TableHead>
                      <TableHead className="w-[120px]">Price</TableHead>
                      <TableHead className="w-[120px]">Total</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select design" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="krt-001">KRT-001 - Floral Kurti</SelectItem>
                              <SelectItem value="krt-002">KRT-002 - Plain Midi</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Qty" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Price" />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="₹0"
                            disabled
                            className="bg-muted"
                          />
                        </TableCell>
                        <TableCell>
                          {items.length > 1 && (
                            <Button
                              onClick={() => removeItem(item.id)}
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

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-4">
                <h3 className="font-semibold">GST Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="gst-type">GST Type</Label>
                  <Select>
                    <SelectTrigger id="gst-type">
                      <SelectValue placeholder="Select GST type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gujarat">Gujarat (SGST + CGST)</SelectItem>
                      <SelectItem value="other">Other State (IGST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Payment Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Received</Label>
                  <Input id="payment" type="number" placeholder="Enter amount received" />
                  <p className="text-sm text-muted-foreground">
                    Enter full amount to mark as "No Due"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Grand Total:</span>
                <span>₹0.00</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Create Bill</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Outward;
