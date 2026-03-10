"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/vendor-ui/Modal"
import { createWarehouse } from "@/app/actions/warehouse/actions"
import type { createWarehouseType } from "@/interfaces/warehouse"
import { useAuth } from "@/contexts/AuthContext"
import getCities from "@/app/actions/city/get-cities"

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

  const [loading, setLoading] = useState(false)

  // fetch cities
  useEffect(() => {
    async function loadCities() {
      try {
        const data = await getCities()
        setCities(data)
      } catch (error) {
        console.error("Failed to load cities", error)
      }
    }

    loadCities()
  }, [])

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload: createWarehouseType = {
        warehouseName,
        warehouseCapacity: Number(capacity),
        city,
        userID: user?.id ?? "",
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
      
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Warehouse Management</h1>

        <p className="text-sm text-[#5B6770] dark:text-[#D8DEE5]">
          Manage your warehouse inventory and settings.
        </p>
      </div>

      {/* Empty state */}
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

        <Button
          onClick={() => setOpenModal(true)}
          className="bg-[#196da7] hover:bg-[#176db6]"
        >
          + Create Your Warehouse
        </Button>

        {/* Modal */}
        <Modal
          title="NEW WAREHOUSE"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <div className="flex flex-col gap-4">

            {/* Warehouse Name */}
            <div>
              <span>Warehouse Name</span>
              <Input
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div>
              <span>Warehouse Capacity</span>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            {/* City Select */}
            <div>
              <span>City</span>

              <Select onValueChange={(value) => setCity(value)}>

                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>

                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
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