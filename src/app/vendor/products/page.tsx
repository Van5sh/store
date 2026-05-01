"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/vendor-ui/Modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateProduct, ProductCategory } from "@/interfaces/Product-interface";
import { getWarehouses } from "@/app/actions/warehouse/actions";
import { WarehouseData } from "@/interfaces/warehouse";
import { createProduct } from "@/app/actions/product/create-product";
import Image from "next/image";
import { getAllProducts, getStoreProducts, type ProductItem } from "@/app/actions/product/get-products";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/product/delete-product";

const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
    [ProductCategory.electronics]: "Electronics",
    [ProductCategory.clothing]: "Clothing",
    [ProductCategory.home_appliances]: "Home Appliances",
    [ProductCategory.books]: "Books",
    [ProductCategory.toys]: "Toys",
    [ProductCategory.sports]: "Sports",
}

const VendorProductsPage = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState(1);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
    const [products, setProducts] = useState<ProductItem[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [stores] = useState<Array<{ storeId?: string; storeName: string; cityName: string }>>(() => {
        if (typeof window === "undefined") return []
        const storedStores = localStorage.getItem("vendor_stores")
        if (!storedStores) return []
        try {
            const parsed = JSON.parse(storedStores)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            localStorage.removeItem("vendor_stores")
            return []
        }
    })
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [productData,setProductData]=useState<CreateProduct>(() => {
        if (typeof window === "undefined") {
            return {
                productName:"",
                productPrice:0,
                vendorId:"",
                storeId:"",
                warehouseId:"",
                quantity:0,
                productCategory:ProductCategory.electronics,
                file:null
            }
        }
        const userRaw = localStorage.getItem("auth_user")
        const activeStoreId = localStorage.getItem("active_store_id") ?? ""
        let vendorId = ""
        if (userRaw) {
            try {
                const parsed = JSON.parse(userRaw) as { id?: string }
                vendorId = parsed?.id ?? ""
            } catch {
                // ignore
            }
        }
        return {
            productName:"",
            productPrice:0,
            vendorId,
            storeId:activeStoreId,
            warehouseId:"",
            quantity:0,
            productCategory:ProductCategory.electronics,
            file:null
        }
    })
    useEffect(()=>{
        const fetchWarehouses=async()=>{
            const warehouses=await getWarehouses()
            setWarehouses(warehouses.data)
        }
        fetchWarehouses()
    },[])

    const fetchProducts = React.useCallback(async () => {
        const storeId = (typeof window !== "undefined" ? (localStorage.getItem("active_store_id") ?? "") : "")
        if (!storeId) {
            setProducts([])
            return
        }
        setLoadingProducts(true)
        setError(null)
        try {
            const [storeLinks, all] = await Promise.all([
                getStoreProducts(storeId),
                getAllProducts(),
            ])
            const ids = new Set((storeLinks ?? []).map((p) => p.productId))
            setProducts((all ?? []).filter((p) => ids.has(p.productId)))
        } catch (e) {
            const message = e instanceof Error ? e.message : "Failed to fetch products"
            setError(message)
        } finally {
            setLoadingProducts(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === "active_store_id") fetchProducts()
        }
        window.addEventListener("storage", handler)
        return () => window.removeEventListener("storage", handler)
    }, [fetchProducts])

    const handleSubmit = async () => {
        if (submitting) return
        setError(null)
        if (!productData.productName.trim()) return setError("Product name is required")
        if (!productData.productPrice || productData.productPrice <= 0) return setError("Product price must be greater than 0")
        if (!productData.quantity || productData.quantity <= 0) return setError("Quantity must be greater than 0")
        if (!productData.storeId) return setError("Please select a store (set an active store first)")
        if (!productData.warehouseId) return setError("Please select a warehouse")
        if (!productData.file) return setError("Please upload a product image")

        setSubmitting(true)
        try {
            const res = await createProduct(productData)
            const created = res?.data as ProductItem | undefined
            if (created?.productId) {
                setProducts((prev) => [created, ...prev.filter((p) => p.productId !== created.productId)])
            } else {
                fetchProducts()
            }
            setProductData((prev) => ({
                ...prev,
                productName: "",
                productPrice: 0,
                quantity: 0,
                warehouseId: "",
                productCategory: ProductCategory.electronics,
                file: null,
            }))
            setModalContent(1)
            closeModal()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create product"
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (productId: string) => {
        if (!productId || deletingId) return
        setError(null)
        const ok = confirm("Delete this product? This cannot be undone.")
        if (!ok) return
        setDeletingId(productId)
        try {
            await deleteProduct(productId)
            setProducts((prev) => prev.filter((p) => p.productId !== productId))
        } catch (e) {
            const message = e instanceof Error ? e.message : "Failed to delete product"
            setError(message)
        } finally {
            setDeletingId(null)
        }
    }

    const getWarehouseSummary = (p: ProductItem) => {
        const inv = p.inventory ?? []
        if (!inv.length) return { names: "—", quantity: 0 }
        const names = inv
            .map((i) => i.warehouse?.warehouseName)
            .filter(Boolean)
            .join(", ")
        const quantity = inv.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
        return { names: names || "—", quantity }
    }

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex items-center">
                <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={openModal}
                >
                    Add Product
                </Button>
            </div>

            {error && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                </div>
            )}
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
                                if (modalContent < 2) {
                                    setModalContent((prev) => prev + 1);
                                } else {
                                    handleSubmit()
                                }
                            }}
                            disabled={submitting}
                        >
                            {submitting ? "Adding..." : (modalContent < 2 ? "Next" : "Add Product")}
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
                                <Input
                                    type="text"
                                    placeholder="Product Name"
                                    value={productData.productName}
                                    onChange={(e) => setProductData((prev) => ({ ...prev, productName: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-[#5B6770] mb-2">
                                        Price
                                    </p>
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={productData.productPrice || ""}
                                        onChange={(e) => setProductData((prev) => ({ ...prev, productPrice: Number(e.target.value) }))}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-[#5B6770] mb-2">
                                        Quantity
                                    </p>
                                    <Input
                                        type="number"
                                        placeholder="Quantity"
                                        value={productData.quantity || ""}
                                        onChange={(e) => setProductData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Description
                                </p>
                                <Input type="text" placeholder="Description (optional)" disabled />
                            </div>
                        </>
                    )}

                    {modalContent === 2 && (
                        <>
                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Store
                                </p>
                                <Select
                                    value={productData.storeId}
                                    onValueChange={(value) => setProductData((prev) => ({ ...prev, storeId: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={stores.length ? "Select Store" : "Create a store first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stores.filter((s) => !!s.storeId).map((store) => (
                                            <SelectItem
                                                key={store.storeId ?? `${store.storeName}-${store.cityName}`}
                                                value={store.storeId as string}
                                            >
                                                {store.storeName} ({store.cityName})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#5B6770] mb-2">
                                    Warehouse
                                </p>
                                <Select
                                    value={productData.warehouseId}
                                    onValueChange={(value) => setProductData((prev) => ({ ...prev, warehouseId: value }))}
                                >
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
                                <Select
                                    value={productData.productCategory}
                                    onValueChange={(value) => setProductData((prev) => ({ ...prev, productCategory: value as ProductCategory }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ProductCategory).map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {PRODUCT_CATEGORY_LABEL[category as ProductCategory] ?? category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#5B6770] mb-2">
                                    Upload Product Image
                                </p>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] ?? null
                                        setProductData((prev) => ({ ...prev, file: f }))
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#203A43] dark:text-[#F5F7FA]">Products</h2>
                    <Button variant="outline" onClick={fetchProducts} disabled={loadingProducts}>
                        {loadingProducts ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>

                {loadingProducts && products.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-300">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                        No products for this store yet. Create a product to see it here.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((p) => {
                            const meta = getWarehouseSummary(p)
                            return (
                                <div
                                    key={p.productId}
                                    className="border rounded-xl overflow-hidden bg-white/70 dark:bg-[#1B3138]/70 dark:border-[#254757]"
                                >
                                    <div className="relative w-full h-44 bg-gray-100 dark:bg-black/20">
                                        <Image
                                            src={p.productPhoto || "/file.svg"}
                                            alt={p.productName}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(p.productId)}
                                            disabled={deletingId === p.productId}
                                            className="
                                                absolute bottom-3 right-3
                                                inline-flex items-center justify-center
                                                h-9 w-9 rounded-full
                                                bg-white/90 hover:bg-white
                                                border border-[#D8DEE5]
                                                text-[#B3261E]
                                                shadow-sm
                                                dark:bg-[#16272D]/90 dark:hover:bg-[#16272D]
                                                dark:border-[#254757]
                                                disabled:opacity-60 disabled:cursor-not-allowed
                                            "
                                            aria-label="Delete product"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="font-semibold text-[#203A43] dark:text-[#F5F7FA]">
                                                {p.productName}
                                            </div>
                                            <div className="font-bold text-[#B45309] dark:text-[#FBBF24] whitespace-nowrap">
                                                ₹{Number(p.productPrice).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            Quantity: <span className="font-medium">{meta.quantity}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            Warehouse: <span className="font-medium">{meta.names}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VendorProductsPage;
