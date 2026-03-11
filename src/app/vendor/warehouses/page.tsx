"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/vendor-ui/Modal"
import { createWarehouse } from "@/app/actions/warehouse/actions"
import type { createWarehouseType, WarehouseData } from "@/interfaces/warehouse"
import { useAuth } from "@/contexts/AuthContext"
import getCities from "@/app/actions/city/get-cities"
import { getWarehouses } from "@/app/actions/warehouse/actions"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface City {
  id: string
  name: string
  state: string
}

const WarehouseVendorPage = () => {
  const { user } = useAuth()

  const [openModal, setOpenModal] = useState(false)

  const [warehouseName, setWarehouseName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [city, setCity] = useState("")

  const [cities, setCities] = useState<City[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function fetchData() {
      try {
        const citiesdata = await getCities()
        setCities(citiesdata)
        const warehousesResponse = await getWarehouses()
        console.log("Warehouses:", warehousesResponse)
        const normalizedWarehouses = Array.isArray(warehousesResponse)
          ? warehousesResponse
          : warehousesResponse?.data ?? []
        setWarehouses(normalizedWarehouses)
      } catch (error) {
        console.error("Failed to load cities", error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload: createWarehouseType = {
        warehouseName,
        warehouseCapacity: Number(capacity),
        city,
        userID: user.id,
      }

      const res = await createWarehouse(payload)

      console.log("Warehouse created:", res)

      setWarehouseName("")
      setCapacity("")
      setCity("")
      setOpenModal(false)
    } catch (error) {
      console.error(error)
      alert("Failed to create warehouse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">

      <div className="p-4">
        <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Warehouse Management</h1>
          <Button
            onClick={() => setOpenModal(true)}
            className="bg-[#196da7] hover:bg-[#176db6]"
          >
            + Create Your Warehouse
          </Button>
        </div>
        <p className="text-sm text-[#5B6770] dark:text-[#D8DEE5]">
          Manage your warehouse inventory and settings.
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center items-center text-center gap-4">
        {warehouses.length > 0 ? (
          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Your Warehouses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((warehouse)=>{
                return (
                  <div key={warehouse.warehouseId} className="border rounded-lg p-4">
                    <h3 className="text-lg font-bold">{warehouse.warehouseName}</h3>
                    <p>Capacity: {warehouse.warehouseCapacity}</p>
                    <p>City: {warehouse.city.cityName}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
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
          </div>
        )}
        <Modal
          title="NEW WAREHOUSE"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <div className="flex flex-col gap-4">

            <div>
              <span>Warehouse Name</span>
              <Input
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </div>

            <div>
              <span>Warehouse Capacity</span>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div>
              <span>City</span>

              <Select onValueChange={(value) => setCity(value)}>

                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>

                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#196da7] hover:bg-[#176db6]"
            >
              {loading ? "Creating..." : "Create Warehouse"}
            </Button>

          </div>
        </Modal>

      </div>
    </div>
  )
}

export default WarehouseVendorPage