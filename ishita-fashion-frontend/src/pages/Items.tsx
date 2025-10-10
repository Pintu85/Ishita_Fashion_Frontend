import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import * as Form from "@radix-ui/react-form";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
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
import { IItem } from "@/interfaces/item/Item";
import { useAddItem, useGetItems, useDeleteItem } from "@/services/item/Item.Service";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { useGetVendorsWithoutFilter } from "@/services/vendor/Vendor.Service";
import { IVendorDropdown } from "@/interfaces/vendor/Vendor";
import { useToast } from "@/hooks/use-toast";


const Items = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<boolean>(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [vendors, setVendors] = useState<IVendorDropdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [vendorId, setVendorId] = useState<string>("");
  const { toast } = useToast();
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [search, setSearch] = useState<string>("");
  const [formData, setFormData] = useState<IItem>({
    itemID: "",
    designNo: "",
    itemName: "",
    vendorID: "",
    vendorName: "",
    itemPhoto: "",
    manufacturingCost: 0,
    sellingPrice: 0,
    isActive: true,
    createdAt: ""
  });

  const resetForm = () => {
    setFormData({
      itemID: "",
      designNo: "",
      itemName: "",
      vendorID: "",
      vendorName: "",
      itemPhoto: "",
      manufacturingCost: 0,
      sellingPrice: 0,
      isActive: true,
      createdAt: ""
    })
  }

  useEffect(() => {
    getvendorsDropDownList();
  }, [])

  useEffect(() => {
    if (search.trim() !== "") {
      getItemsList(search);
    }
    else {
      getItemsList("");
    }
  }, [search]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    additemMutation.mutate({
      itemID: formData.itemID,
      designNo: formData.designNo,
      itemName: formData.itemName,
      vendorID: vendorId,
      itemPhoto: formData.itemPhoto,
      manufacturingCost: formData.manufacturingCost,
      sellingPrice: formData.sellingPrice,
      isActive: true
    })

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = () => {

  }

  const getvendorsDropDownList = () => {
    getVendorsMutation.mutate({});
  }

  const getItemsList = (value: string) => {
    getItemsMutation.mutate({ searchFilter: value, pageNumber: pageNumber.current, pageSize: pageSize });
  }

  const getVendorsMutation = useGetVendorsWithoutFilter({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setVendors(res.data)
      }
    },
    onError: (err: any) => {

    }
  })

  const getItemsMutation = useGetItems({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setItems(res.data.item);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
        setLoading(false);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
      setLoading(false);
    }
  })

  const additemMutation = useAddItem({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200 || 201) {
        setOpen(false);
        getItemsList("");
        setVendorId("");
        setEditingItem(false);
        resetForm();
        toast({
          title: editingItem ? "Item Edited" : "Added",
          description: res.statusMessage,
          variant: "default",
        });
      }
    },
    onError: (err: any) => {

    }
  })

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    let size = pageSize;
    setPageSize(size);
    getItemsList("");
  };

  const handleEditItem = (item: IItem) => {
    setOpen(true);
    setEditingItem(true);
    setFormData(item);
    setVendorId(item.vendorID);
  }

  const handleDeleteItem = (itemId: string) => {

    if (itemId != "") {
      deleteItemMutation.mutate({ itemId: itemId })
    }
  };

  const deleteItemMutation = useDeleteItem({
    onSuccess: (res: IResponseModel) => {
      getItemsList("");
      toast({
        title: "Item Deleted",
        description: "The Item has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error occured",
        description: err,
        variant: "destructive",
      });
    }
  })

  const onSearch = (value: string) => {
    pageNumber.current = 1;
    setSearch(value);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Item Master</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </SheetTrigger>

          <SheetContent
            className="sm:max-w-lg overflow-y-auto w-full"
          >
            <SheetHeader>
              <SheetTitle>{editingItem ? "Edit Item" : "Add New Item"}</SheetTitle>
            </SheetHeader>

            <Form.Root onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Design Number & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Field name="designNo" className="space-y-2">
                  <Form.Label>Design Number</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="designNo"
                      placeholder="Enter design number"
                      value={formData.designNo}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter design number
                  </Form.Message>
                </Form.Field>

                <Form.Field name="itemName" className="space-y-2">
                  <Form.Label>Design Name</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="itemName"
                      placeholder="Enter design name"
                      value={formData.itemName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter design name
                  </Form.Message>
                </Form.Field>
              </div>

              {/* Vendor Select */}
              <Form.Field name="vendorID" className="space-y-2">
                <Form.Label>Vendor</Form.Label>
                <Form.Control asChild>
                  <Select value={vendorId} onValueChange={(value) => setVendorId(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.vendorID} value={vendor.vendorID}>{vendor.vendorName}</SelectItem>)
                      )}
                    </SelectContent>
                  </Select>
                </Form.Control>
                <Form.Message match="valueMissing" className="text-sm text-red-500">
                  Please select a vendor
                </Form.Message>
              </Form.Field>

              {/* Cost & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Field name="manufacturingCost" className="space-y-2">
                  <Form.Label>Manufacturing Cost</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="manufacturingCost"
                      type="number"
                      placeholder="Enter cost"
                      value={formData.manufacturingCost}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter cost
                  </Form.Message>
                </Form.Field>

                <Form.Field name="sellingPrice" className="space-y-2">
                  <Form.Label>Selling Price</Form.Label>
                  <Form.Control asChild>
                    <Input
                      name="sellingPrice"
                      type="number"
                      placeholder="Enter price"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing" className="text-sm text-red-500">
                    Please enter selling price
                  </Form.Message>
                </Form.Field>
              </div>

              {/* Photo Upload */}
              <Form.Field name="photo" className="space-y-2">
                <Form.Label>Item Photo</Form.Label>
                <Form.Control asChild>
                  <Input
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}

                  />
                </Form.Control>
                {/* <Form.Message match="valueMissing" className="text-sm text-red-500">
                  Please upload a photo
                </Form.Message> */}
              </Form.Field>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                    setEditingItem(false);
                  }}
                >
                  Cancel
                </Button>
                <Form.Submit asChild>
                  <Button type="submit">{editingItem ? "Update Item" : "Save Item"}</Button>
                </Form.Submit>
              </div>
            </Form.Root>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." className="pl-9" value={search} onChange={(e) => onSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader size={40} fullScreen={true} text="Loading vendors..." color="text-blue-500" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Design No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Created At </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.itemID}>
                      <TableCell className="font-medium">{item.designNo}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.vendorName}</TableCell>
                      <TableCell>{item.manufacturingCost}</TableCell>
                      <TableCell>{item.sellingPrice}</TableCell>
                      <TableCell>  {new Date(item.createdAt).toLocaleString()} </TableCell>

                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-1" onClick={() => handleEditItem(item)}>
                          <Edit />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.itemID)}>
                          <Trash />
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
            </>)}

        </CardContent>
      </Card>
    </div>
  );
};

export default Items;
