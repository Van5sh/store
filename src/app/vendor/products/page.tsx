"use client"

import React, { useEffect, useState } from "react"
import Modal from "@/components/vendor-ui/Modal"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateProduct, ProductCategory } from "@/interfaces/Product-interface"
import { getWarehouses } from "@/app/actions/warehouse/actions"
import { WarehouseData } from "@/interfaces/warehouse"
import { getVendorStores, VendorStore } from "@/app/actions/store/actions"
import { createProduct } from "@/app/actions/product/create-product"
import Image from "next/image"
import {
  getVendorProducts,
  type ProductItem,
  getProductsByStoreId,
} from "@/app/actions/product/get-products"
import { Trash2, Plus, Package, Upload, X, AlertCircle } from "lucide-react"
import { deleteProduct } from "@/app/actions/product/delete-product"
import { getStoredAuthUser } from "@/lib/auth-storage"

const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  [ProductCategory.electronics]: "Electronics",
  [ProductCategory.clothing]: "Clothing",
  [ProductCategory.home_appliances]: "Home Appliances",
  [ProductCategory.books]: "Books",
  [ProductCategory.toys]: "Toys",
  [ProductCategory.sports]: "Sports",
}

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  [ProductCategory.electronics]: "bg-blue-50 text-blue-700 border-blue-100",
  [ProductCategory.clothing]: "bg-purple-50 text-purple-700 border-purple-100",
  [ProductCategory.home_appliances]: "bg-amber-50 text-amber-700 border-amber-100",
  [ProductCategory.books]: "bg-green-50 text-green-700 border-green-100",
  [ProductCategory.toys]: "bg-pink-50 text-pink-700 border-pink-100",
  [ProductCategory.sports]: "bg-orange-50 text-orange-700 border-orange-100",
}

const VendorProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
  const [stores, setStores] = useState<VendorStore[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const openModal = () => { setIsModalOpen(true); setError(null) }
  const closeModal = () => { setIsModalOpen(false); setImagePreview(null); setError(null) }

  const getVendorId = () => {
    return getStoredAuthUser()?.id ?? ""
  }

  const getActiveStoreId = () => {
    if (typeof window === "undefined") return ""
    return localStorage.getItem("active_store_id") ?? ""
  }

  const [productData, setProductData] = useState<CreateProduct>(() => ({
    productName: "",
    productPrice: 0,
    vendorId: getVendorId(),
    storeId: getActiveStoreId(),
    warehouseId: "",
    quantity: 0,
    productCategory: ProductCategory.electronics,
    file: null,
  }))

  useEffect(() => {
    const fetchWarehouses = async () => {
      const res = await getWarehouses()
      setWarehouses(res)
    }
    const fetchStores = async () => {
      const vendorId = getVendorId()
      if (vendorId) {
        try {
          const res = await getVendorStores(vendorId)
          setStores(res)
        } catch (e) {
          console.error("Failed to fetch stores", e)
        }
      }
    }
    fetchWarehouses()
    fetchStores()
  }, [])

  useEffect(() => {
    setProductData((prev) => ({
      ...prev,
      vendorId: getVendorId(),
      storeId: getActiveStoreId(),
    }))
  }, [])

  const fetchProducts = React.useCallback(async () => {
    setLoadingProducts(true)
    setError(null)
    try {
      const storeId = getActiveStoreId()
      const nextProducts = storeId
        ? await getProductsByStoreId(storeId)
        : await getVendorProducts()
      setProducts(nextProducts)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch products")
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 50)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "active_store_id" || e.key === "auth_user") fetchProducts()
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [fetchProducts])

  useEffect(() => {
    const syncSelections = () => {
      setProductData((prev) => ({
        ...prev,
        vendorId: getVendorId(),
        storeId: getActiveStoreId(),
      }))
    }

    syncSelections()
    window.addEventListener("storage", syncSelections)
    return () => window.removeEventListener("storage", syncSelections)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setProductData((prev) => ({ ...prev, file }))
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    setError(null)

    if (!productData.productName.trim()) return setError("Product name is required")
    if (productData.productPrice <= 0) return setError("Price must be greater than 0")
    if (productData.quantity <= 0) return setError("Quantity must be greater than 0")
    if (!productData.storeId) return setError("Select a store first")
    if (!productData.warehouseId) return setError("Select a warehouse")
    if (!productData.file) return setError("Upload a product image")

    setSubmitting(true)
    try {
      const res = await createProduct(productData)
      const created = res?.data as ProductItem
      if (created?.productId) {
        setProducts((prev) => [created, ...prev])
      } else {
        fetchProducts()
      }
      setProductData((prev) => ({
        ...prev,
        productName: "",
        productPrice: 0,
        quantity: 0,
        warehouseId: "",
        storeId: getActiveStoreId(),
        file: null,
      }))
      setImagePreview(null)
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!productId || !confirm("Delete this product?")) return
    setDeletingId(productId)
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.productId !== productId))
    } catch {
      setError("Delete failed")
    } finally {
      setDeletingId(null)
    }
  }

  const getWarehouseSummary = (p: ProductItem) => {
    const inv = p.inventory ?? []
    const quantity = inv.reduce((sum, i) => sum + (i.quantity || 0), 0)
    const names = inv.map((i) => i.warehouse?.warehouseName).filter(Boolean).join(", ")
    return { quantity, names: names || "—" }
  }

  const totalStock = products.reduce((sum, p) => sum + getWarehouseSummary(p).quantity, 0)
  const totalValue = products.reduce((sum, p) => sum + (p.productPrice ?? 0) * getWarehouseSummary(p).quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your store inventory</p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium
              hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Products", value: products.length },
              { label: "Total Stock", value: `${totalStock.toLocaleString()} units` },
              { label: "Inventory Value", value: `₹${totalValue.toLocaleString()}` },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X size={14} />
            </button>
          </div>
        )}

        {loadingProducts ? (
          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-44 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-medium mb-1">No products yet</h3>
            <p className="text-sm text-gray-400 mb-6">Add your first product to get started</p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700
                hover:bg-gray-50 transition-all"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {products.map((p) => {
              const meta = getWarehouseSummary(p)
              const isDeleting = deletingId === p.productId

              return (
                <div
                  key={p.productId}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm
                    hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
                    <Image
                      src={p.productPhoto || "/file.svg"}
                      alt={p.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border
                        ${CATEGORY_COLORS[p.category as ProductCategory] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                        {PRODUCT_CATEGORY_LABEL[p.category as ProductCategory] ?? p.category}
                      </span>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(p.productId)}
                      disabled={isDeleting}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm
                        flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white
                        opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm border border-gray-100
                        disabled:opacity-50"
                    >
                      {isDeleting
                        ? <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm leading-snug mb-0.5 truncate">{p.productName}</h3>
                    <p className="text-xs text-gray-400 mb-3 truncate">{meta.names}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        ₹{p.productPrice?.toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                        ${meta.quantity > 10
                          ? "bg-green-50 text-green-700"
                          : meta.quantity > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"}`}>
                        {meta.quantity} in stock
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal title="New Product" isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">New Product</h2>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Image Upload */}
          <label className="block mb-5 cursor-pointer">
            <div className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors
              ${imagePreview ? "border-gray-200 bg-gray-50" : "border-gray-200 hover:border-gray-400 bg-gray-50"}`}>
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-xl p-2" />
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-gray-300" />
                  <span className="text-sm text-gray-400 font-medium">Upload product image</span>
                  <span className="text-xs text-gray-300">PNG, JPG up to 10MB</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Product Name</label>
              <Input
                placeholder="e.g. Wireless Earbuds Pro"
                value={productData.productName}
                onChange={(e) => setProductData((prev) => ({ ...prev, productName: e.target.value }))}
                className="rounded-xl border-gray-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Price (₹)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={productData.productPrice || ""}
                  onChange={(e) => setProductData((prev) => ({ ...prev, productPrice: Number(e.target.value) }))}
                  className="rounded-xl border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Quantity</label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={productData.quantity || ""}
                  onChange={(e) => setProductData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="rounded-xl border-gray-200 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Store</label>
                <Select
                  value={productData.storeId}
                  onValueChange={(v) => setProductData((prev) => ({ ...prev, storeId: v }))}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.storeId} value={s.storeId}>
                        {s.storeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Category</label>
                <Select
                  value={productData.productCategory}
                  onValueChange={(v) => setProductData((prev) => ({ ...prev, productCategory: v as ProductCategory }))}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRODUCT_CATEGORY_LABEL).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Warehouse</label>
              <Select
                value={productData.warehouseId}
                onValueChange={(v) => setProductData((prev) => ({ ...prev, warehouseId: v }))}
              >
                <SelectTrigger className="rounded-xl border-gray-200 text-sm">
                  <SelectValue placeholder="Select a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.warehouseId} value={w.warehouseId}>
                      {w.warehouseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
                hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : "Add Product"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default VendorProductsPage
