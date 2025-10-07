import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download } from "lucide-react";

const Reports = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">
          View and analyze your business data
        </p>
      </div>

      <Tabs defaultValue="party-sales" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="party-sales">Party Sales</TabsTrigger>
          <TabsTrigger value="vendor-inward">Vendor Inward</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="party-sales">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Party-wise Sales Report</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="party-filter">Select Party</Label>
                  <Select>
                    <SelectTrigger id="party-filter">
                      <SelectValue placeholder="All parties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parties</SelectItem>
                      <SelectItem value="party1">Shree Garments</SelectItem>
                      <SelectItem value="party2">Fashion Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-date">From Date</Label>
                  <Input id="from-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-date">To Date</Label>
                  <Input id="to-date" type="date" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party Name</TableHead>
                    <TableHead>Total Bills</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Shree Garments</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>₹2,45,000</TableCell>
                    <TableCell className="text-green-600">₹1,80,000</TableCell>
                    <TableCell className="text-orange-600">₹65,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fashion Hub</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>₹1,95,500</TableCell>
                    <TableCell className="text-green-600">₹1,95,500</TableCell>
                    <TableCell className="text-green-600">₹0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor-inward">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vendor-wise Inward Report</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="vendor-filter">Select Vendor</Label>
                  <Select>
                    <SelectTrigger id="vendor-filter">
                      <SelectValue placeholder="All vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vendors</SelectItem>
                      <SelectItem value="ishita">Ishita Fashion</SelectItem>
                      <SelectItem value="style">Style Creations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-date-vendor">From Date</Label>
                  <Input id="from-date-vendor" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-date-vendor">To Date</Label>
                  <Input id="to-date-vendor" type="date" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Design</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ishita Fashion</TableCell>
                    <TableCell>KRT-001</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>₹67,500</TableCell>
                    <TableCell className="text-green-600">₹50,000</TableCell>
                    <TableCell className="text-orange-600">₹17,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Style Creations</TableCell>
                    <TableCell>KRT-002</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>₹45,600</TableCell>
                    <TableCell className="text-green-600">₹45,600</TableCell>
                    <TableCell className="text-green-600">₹0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Stock Report</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Stock Value
                  </p>
                  <p className="text-4xl font-bold text-primary">₹8,45,670</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Design No</TableHead>
                    <TableHead>Design Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Piece</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">KRT-001</TableCell>
                    <TableCell>Floral Kurti</TableCell>
                    <TableCell>85</TableCell>
                    <TableCell>₹450</TableCell>
                    <TableCell className="font-semibold">₹38,250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">KRT-002</TableCell>
                    <TableCell>Plain Midi Dress</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>₹380</TableCell>
                    <TableCell className="font-semibold">₹45,600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">KRT-003</TableCell>
                    <TableCell>Designer Kurti</TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>₹520</TableCell>
                    <TableCell className="font-semibold">₹33,800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sales Bills Created</p>
                      <p className="text-2xl font-bold">12 Bills</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹45,230</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Inward Entries</p>
                      <p className="text-2xl font-bold">8 Entries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹32,450</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">New Parties Added</p>
                  <p className="text-2xl font-bold">3 Parties</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Payments Received</p>
                  <p className="text-2xl font-bold text-green-600">₹28,000</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Vendor Payments Made</p>
                  <p className="text-2xl font-bold text-orange-600">₹15,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
