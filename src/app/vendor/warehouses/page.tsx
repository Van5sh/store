"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/vendor-ui/Modal";

const WarehouseVendorPage = () => {
    const [openModal,setOpenModal]=useState<boolean>(false);
    const [warehouseTitle,setWarehouseTitle]=useState("");
    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-2">Warehouse Management</h1>
                <p className="text-sm text-[#5B6770] dark:text-[#D8DEE5]">
                    Manage your warehouse inventory and settings.
                </p>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center text-center gap-4">
                    <Image
                        src="/warehouse.png"
                        alt="Warehouse Illustration"
                        width={600}
                        height={600}
                        className="opacity-60"
                    />
                <p className="text-gray-500 italic">
                    You don't have any listed warehouses right now
                </p>
                <Button onClick={()=>{setOpenModal(true)}} className="bg-[#196da7] hover:cursor-pointer hover:bg-[#176db6]">
                    <p className="font-bold">+ Create Your Warehouse</p>
                </Button>
                <Modal title="NEW WAREHOUSE" isOpen={openModal} onClose={()=>setOpenModal(false)}>
                    <span>Warehouse Name</span>
                    <Input
                      value={warehouseTitle}
                      onChange={(e)=>setWarehouseTitle(e.target.value)}
                    />
                    <span>Warehouse Capacity</span>
                    <Input
                      value={warehouseTitle}
                      onChange={(e)=>setWarehouseTitle(e.target.value)}
                    />
                    <span>Warehouse City Name</span>
                    <Input
                      value={warehouseTitle}
                      onChange={(e)=>setWarehouseTitle(e.target.value)}
                    />
                </Modal>
            </div>
        </div>
    )
}

export default WarehouseVendorPage;