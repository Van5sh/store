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

  const totalCapacity = warehouses.reduce(
    (sum, warehouse) => sum + (warehouse.warehouseCapacity || 0),
    0
  )
  const maxCapacity = Math.max(
    0,
    ...warehouses.map((warehouse) => warehouse.warehouseCapacity || 0)
  )
  const topWarehouses = [...warehouses]
    .sort(
      (a, b) =>
        (b.warehouseCapacity || 0) - (a.warehouseCapacity || 0)
    )
    .slice(0, 3)
  const cityBreakdown = Object.entries(
    warehouses.reduce<Record<string, number>>((acc, warehouse) => {
      const cityName = warehouse.city?.cityName
      if (!cityName) return acc
      acc[cityName] = (acc[cityName] || 0) + 1
      return acc
    }, {})
  ).sort(([, aCount], [, bCount]) => bCount - aCount)
  const cityCount = new Set(
    warehouses
      .map((warehouse) => warehouse.city?.cityName)
      .filter((cityName): cityName is string => Boolean(cityName))
  ).size
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_45%,_#fefefe_85%)]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-slate-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-64 w-64 rounded-full bg-slate-300/30 blur-3xl" />

        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_26px_70px_-45px_rgba(15,23,42,0.75)] backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                Vendor Operations
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Warehouse Command Center
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600">
                Orchestrate every hub, monitor capacity, and keep fulfilment always in sync.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => setOpenModal(true)}
                  className="h-11 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800"
                >
                  + Create Warehouse
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Total Warehouses
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {warehouses.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">Active locations in your network.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Combined Capacity
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {totalCapacity || 0}
                </p>
                <p className="mt-1 text-xs text-slate-500">Aggregate storage capacity.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Cities Covered
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {cityCount}
                </p>
                <p className="mt-1 text-xs text-slate-500">Regions supported for fulfilment.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.65)]">
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Your Warehouses</h2>
              <p className="text-sm text-slate-600">
                Monitor every facility and adjust capacity in minutes.
              </p>
            </div>

            {warehouses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {warehouses.map((warehouse) => {
                  const capacityRatio =
                    maxCapacity > 0
                      ? Math.round(
                          ((warehouse.warehouseCapacity || 0) / maxCapacity) * 100
                        )
                      : 0
                  return (
                    <div
                      key={warehouse.warehouseId}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {warehouse.warehouseName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {warehouse.city?.cityName || "City not set"}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Active
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Capacity
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                              {warehouse.warehouseCapacity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Utilization
                            </p>
                            <p className="mt-1 text-sm font-medium text-emerald-600">
                              {capacityRatio}%
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-slate-900 transition-all"
                            style={{ width: `${capacityRatio}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                <Image
                  src="/warehouse.png"
                  alt="Warehouse Illustration"
                  width={320}
                  height={320}
                  className="opacity-70"
                />
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    No warehouses listed yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Create your first location to start tracking inventory capacity.
                  </p>
                </div>
                <Button
                  onClick={() => setOpenModal(true)}
                  className="h-10 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                >
                  Create Warehouse
                </Button>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.6)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Top Capacity
              </p>
              <div className="mt-4 space-y-4">
                {topWarehouses.length > 0 ? (
                  topWarehouses.map((warehouse) => (
                    <div key={warehouse.warehouseId} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                        <span>{warehouse.warehouseName}</span>
                        <span>{warehouse.warehouseCapacity}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{
                            width: maxCapacity
                              ? `${Math.round(
                                  ((warehouse.warehouseCapacity || 0) / maxCapacity) * 100
                                )}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No capacity data yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.6)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                City Coverage
              </p>
              <div className="mt-4 space-y-3">
                {cityBreakdown.length > 0 ? (
                  cityBreakdown.slice(0, 5).map(([cityName, count]) => (
                    <div key={cityName} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{cityName}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {count} site{count === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No cities captured yet.</p>
                )}
              </div>
            </div>
          </aside>
        </section>

        <Modal
          title="NEW WAREHOUSE"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Warehouse Name</span>
              <Input
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="e.g. East Hub"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Warehouse Capacity</span>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 1200"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">City</span>

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

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="h-11 rounded-full bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
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
