"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProducts, type ProductItem } from "@/app/actions/product/get-products"
import getCities from "@/app/actions/city/get-cities"

type WarehouseSummary = {
  warehouseId: string
  warehouseName: string
  warehouseCapacity: number
  remainingSpace: number
  cityId?: string
  cityName: string
  totalStock: number
  productCount: number
}

export default function AdminWarehousePage() {
  const [warehouses, setWarehouses] = React.useState<WarehouseSummary[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [products, cities] = await Promise.all([getAllProducts(), getCities()])
        const cityMap = new Map(cities.map((city) => [city.id, city.name]))
        const warehouseMap = new Map<string, WarehouseSummary>()

        for (const product of products as ProductItem[]) {
          for (const item of product.inventory ?? []) {
            if (!item.warehouse?.warehouseId) continue

            const current = warehouseMap.get(item.warehouse.warehouseId)
            if (current) {
              current.totalStock += item.quantity ?? 0
              current.productCount += 1
              continue
            }

            warehouseMap.set(item.warehouse.warehouseId, {
              warehouseId: item.warehouse.warehouseId,
              warehouseName: item.warehouse.warehouseName,
              warehouseCapacity: item.warehouse.warehouseCapacity ?? 0,
              remainingSpace: item.warehouse.remainingSpace ?? 0,
              cityId: item.warehouse.cityId,
              cityName: cityMap.get(item.warehouse.cityId ?? "") ?? "Unknown city",
              totalStock: item.quantity ?? 0,
              productCount: 1,
            })
          }
        }

        setWarehouses(
          Array.from(warehouseMap.values()).sort(
            (a, b) => b.totalStock - a.totalStock
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load warehouses")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Warehouse Coverage</h1>
        <p className="mt-1 text-sm text-blue-700/70">
          Derived from live product inventory across known warehouse links.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-blue-700/70">Loading warehouses...</p>
      ) : warehouses.length === 0 ? (
        <p className="text-sm text-blue-700/70">No warehouse-linked inventory found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Card key={warehouse.warehouseId} className="border-blue-200 bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">{warehouse.warehouseName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-900/80">
                <div className="flex items-center justify-between">
                  <span>City</span>
                  <span>{warehouse.cityName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capacity</span>
                  <span>{warehouse.warehouseCapacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remaining</span>
                  <span>{warehouse.remainingSpace}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tracked Stock</span>
                  <span>{warehouse.totalStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Products</span>
                  <span>{warehouse.productCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
