import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Items = () => {
  const [open, setOpen] = useState(false);
  const [items] = useState([
    {
      id: 1,
      designNo: "KRT-001",
      name: "Floral Kurti",
      vendor: "Ishita Fashion",
      cost: "₹450",
      price: "₹750",
    },
    {
      id: 2,
      designNo: "KRT-002",
      name: "Plain Midi Dress",
      vendor: "Style Creations",
      cost: "₹380",
      price: "₹650",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Item Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="design-no">Design Number</Label>
                  <Input id="design-no" placeholder="Enter design number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="design-name">Design Name</Label>
                  <Input id="design-name" placeholder="Enter design name" />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Manufacturing Cost</Label>
                  <Input id="cost" type="number" placeholder="Enter cost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price</Label>
                  <Input id="price" type="number" placeholder="Enter price" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Item Photo</Label>
                <Input id="photo" type="file" accept="image/*" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save Item</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Design No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.designNo}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Items;
