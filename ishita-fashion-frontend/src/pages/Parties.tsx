import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const Parties = () => {
  const [open, setOpen] = useState(false);
  const [parties] = useState([
    {
      id: 1,
      name: "Shree Garments",
      mobile: "9123456789",
      gst: "24CCCCC0000C1Z5",
      state: "Gujarat",
    },
    {
      id: 2,
      name: "Fashion Hub",
      mobile: "9123456790",
      gst: "27DDDDD0000D1Z5",
      state: "Maharashtra",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Party Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers and parties
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party-name">Party Name</Label>
                  <Input id="party-name" placeholder="Enter party name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party-mobile">Mobile Number</Label>
                  <Input id="party-mobile" placeholder="Enter mobile number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party-gst">GST Number</Label>
                  <Input id="party-gst" placeholder="Enter GST number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party-state">State</Label>
                  <Select>
                    <SelectTrigger id="party-state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party-pan">PAN Number</Label>
                  <Input id="party-pan" placeholder="Enter PAN number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party-aadhar">Aadhar Number</Label>
                  <Input id="party-aadhar" placeholder="Enter Aadhar number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="party-address">Address</Label>
                <Input id="party-address" placeholder="Enter complete address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party-document">Upload Document</Label>
                <Input id="party-document" type="file" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save Party</Button>
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
              <Input placeholder="Search parties..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parties.map((party) => (
                <TableRow key={party.id}>
                  <TableCell className="font-medium">{party.name}</TableCell>
                  <TableCell>{party.mobile}</TableCell>
                  <TableCell>{party.gst}</TableCell>
                  <TableCell>{party.state}</TableCell>
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

export default Parties;
