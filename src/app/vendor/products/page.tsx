"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/vendor-ui/Modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateProduct, ProductCategory } from "@/interfaces/Product-interface";
import { getWarehouses } from "@/app/actions/warehouse/actions";
import { WarehouseData } from "@/interfaces/warehouse";

const VendorProductsPage = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState(1);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
    const [productData,setProductData]=useState<CreateProduct>({
        productName:"",
        productPrice:0,
        vendorId:"",
        storeId:"",
        warehouseId:"",
        quantity:0,
        productCategory:ProductCategory.Electronics,
        file:new File([], "")
    })
    useEffect(()=>{
        const user=localStorage.getItem("auth_user")
        if (user) {
            const userData=JSON.parse(user)
            setProductData((prev)=>({
                ...prev,
                vendorId:userData.id
            }))
        }
        const fetchWarehouses=async()=>{
            const warehouses=await getWarehouses()
            setWarehouses(warehouses.data)
        }
        fetchWarehouses()
    },[])
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
                        {(modalContent>1)&&(<Button
                            variant="outline"
                            onClick={() => setModalContent((prev) => prev - 1)}
                        >
                            Back
                        </Button>)}
                        <Button
                            className="bg-[#203A43] text-[#F5F7FA] hover:bg-[#1B3138]"
                            onClick={() => {
                                if (modalContent < 3) {
                                    setModalContent((prev) => prev + 1);
                                } else {
                                    setModalContent(1);
                                    closeModal();
                                }
                            }}
                        >
                            {modalContent < 2 ? "Next" : "Add Product"}
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 gap-4">

                    {modalContent === 1 && (
                        <>
                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Product Name
                                </p>
                                <Input type="text" placeholder="Product Name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-[#5B6770] mb-2">
                                        Price
                                    </p>
                                    <Input type="number" placeholder="Price" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-[#5B6770] mb-2">
                                        Quantity
                                    </p>
                                    <Input type="number" placeholder="Quantity" />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Description
                                </p>
                                <Input type="text" placeholder="Description" />
                            </div>
                        </>
                    )}

                    {modalContent === 2 && (
                        <>
                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Warehouse
                                </p>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
                                                {warehouse.warehouseName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Category
                                </p>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
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
                            <div>
                                <p className="text-sm font-medium text-[#5B6770] mb-2">
                                    Upload Product Image
                                </p>
                                <Input type="file" />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
            <div>

            </div>
        </div>
    )
}

export default VendorProductsPage;
