"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/vendor-ui/Modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategory } from "@/interfaces/Product-interface";

const VendorProductsPage = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className="flex">
            <Button
                variant="outline"
                className="ml-auto"
                onClick={openModal}
            >
                Add Product
            </Button>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Add New Product"
                footer={
                    <>
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button className="bg-[#203A43] text-[#F5F7FA] hover:bg-[#1B3138]">
                            Save Product
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <p className="text-xs font-medium text-[#5B6770] mb-2">
                            Product Name
                        </p>
                        <Input type="text" placeholder="Product Name" className="w-full" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-[#5B6770] mb-2">
                                Price
                            </p>
                            <Input type="number" placeholder="Price" className="w-full" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[#5B6770] mb-2">
                                Quantity
                            </p>
                            <Input type="number" placeholder="Quantity" className="w-full" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5B6770] mb-2">
                            Description
                        </p>
                        <Input type="text" placeholder="Description" className="w-full" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5B6770] mb-2">
                            Warehouse
                        </p>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="warehouse1">Warehouse 1</SelectItem>
                                <SelectItem value="warehouse2">Warehouse 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5B6770] mb-2">
                            Category
                        </p>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Product Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ProductCategory).map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default VendorProductsPage;
