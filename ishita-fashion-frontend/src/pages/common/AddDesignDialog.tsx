import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";

interface AddDesignDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    vendors: any[];
    formItemData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    resetFormItemData: () => void;
    setFormItemData: (data: any) => void;
}

const AddDesignDialog: React.FC<AddDesignDialogProps> = ({
    open,
    setOpen,
    vendors,
    formItemData,
    handleChange,
    handleSubmit,
    resetFormItemData,
    setFormItemData,
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Design</DialogTitle>
                    <DialogDescription>
                        Add a new design to your catalog
                    </DialogDescription>
                </DialogHeader>

                <Form.Root onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Field name="designNo" className="space-y-2">
                            <Form.Label>Design Number</Form.Label>
                            <Form.Control asChild>
                                <Input
                                    name="designNo"
                                    placeholder="Enter design number"
                                    value={formItemData.designNo}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field name="itemName" className="space-y-2">
                            <Form.Label>Design Name</Form.Label>
                            <Form.Control asChild>
                                <Input
                                    name="itemName"
                                    placeholder="Enter design name"
                                    value={formItemData.itemName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>
                    </div>

                    <Form.Field name="vendor" className="space-y-2">
                        <Form.Label>Vendor</Form.Label>
                        <Combobox
                            options={vendors.map((x: any) => ({
                                value: x.vendorID.toString(),
                                label: `${x.vendorName} - ${x.mobileNo}`,
                            }))}
                            placeholder="Select vendor"
                            searchPlaceholder="Search vendor..."
                            value={formItemData.vendorID}
                            onValueChange={(val) => setFormItemData({ ...formItemData, vendorID: val })}
                        />
                        <Form.Control asChild>
                            <input type="hidden" name="vendorID" value={formItemData.vendorID || ""} required />
                        </Form.Control>
                    </Form.Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Field name="manufacturingCost" className="space-y-2">
                            <Form.Label>Manufacturing Cost</Form.Label>
                            <Form.Control asChild>
                                <Input
                                    name="manufacturingCost"
                                    type="number"
                                    placeholder="₹0"
                                    value={formItemData.manufacturingCost}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field name="sellingPrice" className="space-y-2">
                            <Form.Label>Selling Price</Form.Label>
                            <Form.Control asChild>
                                <Input
                                    name="sellingPrice"
                                    type="number"
                                    placeholder="₹0"
                                    value={formItemData.sellingPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>
                    </div>

                    <Form.Field name="photo" className="space-y-2">
                        <Form.Label>Photo</Form.Label>
                        <Form.Control asChild>
                            <Input
                                name="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </Form.Control>
                    </Form.Field>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetFormItemData();
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Form.Submit asChild>
                            <Button type="submit">Add Design</Button>
                        </Form.Submit>
                    </DialogFooter>
                </Form.Root>
            </DialogContent>
        </Dialog>
    );
};

export default AddDesignDialog;
