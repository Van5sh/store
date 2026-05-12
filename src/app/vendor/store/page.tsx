"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/vendor-ui/Modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { City } from "@/interfaces/city";
import getCities from "@/app/actions/city/get-cities";
import { useAuth } from "@/contexts/AuthContext";
import { createStore, getVendorStores } from "@/app/actions/store/actions";
import {
  Eye,
  Plus,
  Store,
  MapPin,
  CheckCircle2,
  X,
  Package,
  Loader2,
  AlertCircle,
  Warehouse,
} from "lucide-react";
import {
  getStoreProducts,
  getProductsByStoreId,
  type ProductItem,
} from "@/app/actions/product/get-products";
import Image from "next/image";

interface StoreData {
  storeId?: string;
  storeName: string;
  cityName: string;
}

const StorePage = () => {
  const [stores, setStores] = useState<StoreData[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const parsed = JSON.parse(localStorage.getItem("vendor_stores") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("active_store_id") ?? "";
  });
  const [storeForm, setStoreForm] = useState<StoreData>({ storeName: "", cityName: "" });
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Detail modal state
  const [detailStore, setDetailStore] = useState<StoreData | null>(null);
  const [detailProducts, setDetailProducts] = useState<ProductItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    getCities()
        .then(setCities)
        .catch((e) => console.error("Failed to fetch cities", e));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const remoteStores = await getVendorStores(user.id);
        if (cancelled) return;
        const mapped: StoreData[] = remoteStores.map((s) => ({
          storeId: s.storeId,
          storeName: s.storeName,
          cityName: s.cityName,
        }));
        setStores(mapped);
        localStorage.setItem("vendor_stores", JSON.stringify(mapped));
        if (!activeStoreId && mapped[0]?.storeId) {
          localStorage.setItem("active_store_id", mapped[0].storeId);
          setActiveStoreId(mapped[0].storeId);
        }
      } catch (e) {
        console.error("Failed to fetch stores", e);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleCreateStore = async () => {
    if (!storeForm.storeName.trim() || !storeForm.cityName) {
      setError("Please fill in all fields");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const created = await createStore({
        storeName: storeForm.storeName,
        cityName: storeForm.cityName,
        vendorId: user?.id,
      });
      const newStore: StoreData = {
        storeId: created?.storeId ?? created?.id,
        storeName: storeForm.storeName,
        cityName: storeForm.cityName,
      };
      setStores((prev) => {
        const next = [...prev, newStore];
        localStorage.setItem("vendor_stores", JSON.stringify(next));
        if (!activeStoreId && newStore.storeId) {
          localStorage.setItem("active_store_id", newStore.storeId);
          setActiveStoreId(newStore.storeId);
        }
        return next;
      });
      setStoreForm({ storeName: "", cityName: "" });
      setIsCreateModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  const openStoreDetail = async (store: StoreData) => {
    if (!store.storeId) return

    setDetailStore(store)
    setDetailProducts([])
    setDetailError(null)
    setLoadingDetail(true)

    try {
      const products = await getProductsByStoreId(store.storeId)
      setDetailProducts(products ?? [])
    } catch (e) {
      setDetailError(
          e instanceof Error ? e.message : "Failed to load products"
      )
    } finally {
      setLoadingDetail(false)
    }
  }

  const setActive = (store: StoreData) => {
    if (!store.storeId) return;
    localStorage.setItem("active_store_id", store.storeId);
    setActiveStoreId(store.storeId);
  };

  const totalStock = (p: ProductItem) =>
      (p.inventory ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0);

  return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Your Stores</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage your store locations</p>
            </div>
            <button
                onClick={() => { setIsCreateModalOpen(true); setError(null); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium
              hover:bg-gray-700 active:scale-[0.98] transition-all shadow-sm"
            >
              <Plus size={16} />
              Create Store
            </button>
          </div>

          {/* Store Grid */}
          {stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Store size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-800 font-medium mb-1">No stores yet</h3>
                <p className="text-sm text-gray-400 mb-6">Create your first store to get started</p>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
                text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <Plus size={15} /> Create Store
                </button>
              </div>
          ) : (
              <div className="grid grid-cols-3 gap-5">
                {stores.map((store, i) => {
                  const isActive = store.storeId === activeStoreId;
                  return (
                      <div
                          key={store.storeId ?? i}
                          className={`group bg-white rounded-2xl border shadow-sm transition-all duration-200
                    hover:shadow-md hover:border-gray-200
                    ${isActive ? "border-gray-900 ring-1 ring-gray-900/10" : "border-gray-100"}`}
                      >
                        {/* Card top */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Store size={18} className="text-gray-500" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              {isActive && (
                                  <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5
                            rounded-full bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle2 size={10} /> Active
                          </span>
                              )}
                              {/* Eye / Detail button */}
                              <button
                                  onClick={() => openStoreDetail(store)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400
                            hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                  title="View store products"
                              >
                                <Eye size={15} />
                              </button>
                            </div>
                          </div>

                          <h2 className="text-base font-semibold text-gray-900 truncate">{store.storeName}</h2>
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                            <MapPin size={12} />
                            {store.cityName}
                          </div>
                        </div>

                        {/* Card footer */}
                        <div className="px-5 pb-5">
                          <button
                              onClick={() => setActive(store)}
                              disabled={!store.storeId || isActive}
                              className={`w-full py-2 rounded-xl text-sm font-medium transition-all
                        ${isActive
                                  ? "bg-gray-900 text-white cursor-default"
                                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                              }`}
                          >
                            {isActive ? "Active Store" : "Set as Active"}
                          </button>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        <Modal title="" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">New Store</h2>
                <p className="text-xs text-gray-400 mt-0.5">Add a new store location</p>
              </div>
              <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Store Name</label>
                <Input
                    placeholder="e.g. Downtown Flagship"
                    value={storeForm.storeName}
                    onChange={(e) => setStoreForm((p) => ({ ...p, storeName: e.target.value }))}
                    className="rounded-xl border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">City</label>
                <Select
                    value={storeForm.cityName}
                    onValueChange={(v) => setStoreForm((p) => ({ ...p, cityName: v }))}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                      ))}
                    </SelectGroup>
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
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                  onClick={handleCreateStore}
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : "Create Store"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal title="Product" isOpen={!!detailStore} onClose={() => setDetailStore(null)}>
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{detailStore?.storeName}</h2>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                  <MapPin size={11} />
                  {detailStore?.cityName}
                </div>
              </div>
              <button
                  onClick={() => setDetailStore(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Products */}
            {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 size={22} className="animate-spin text-gray-400" />
                  <p className="text-sm text-gray-400">Loading products…</p>
                </div>
            ) : detailError ? (
                <div className="flex items-center gap-2 px-3 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertCircle size={14} className="shrink-0" />
                  {detailError}
                </div>
            ) : detailProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Package size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No products in this store</p>
                  <p className="text-xs text-gray-400">Add products from the Products page</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {detailProducts.map((p) => {
                    const stock = totalStock(p);
                    const warehouses = (p.inventory ?? [])
                        .map((i) => i.warehouse?.warehouseName)
                        .filter(Boolean)
                        .join(", ");

                    return (
                        <div
                            key={p.productId}
                            className="flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors"
                        >
                          {/* Image */}
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                            <Image
                                src={p.productPhoto || "/file.svg"}
                                alt={p.productName}
                                fill
                                className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{p.productName}</p>
                            {warehouses && (
                                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400 truncate">
                                  <Warehouse size={10} />
                                  {warehouses}
                                </div>
                            )}
                            {p.category && (
                                <span className="inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded-full
                          bg-gray-100 text-gray-500 font-medium">
                          {p.category}
                        </span>
                            )}
                          </div>

                          {/* Price + Stock */}
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-gray-900">₹{p.productPrice?.toLocaleString()}</p>
                            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full
                        ${stock > 10
                                ? "bg-green-50 text-green-700"
                                : stock > 0
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-600"}`}>
                        {stock} in stock
                      </span>
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}

            {/* Footer summary */}
            {detailProducts.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>{detailProducts.length} product{detailProducts.length !== 1 ? "s" : ""}</span>
                  <span>
                Total stock: {detailProducts.reduce((s, p) => s + totalStock(p), 0).toLocaleString()} units
              </span>
                </div>
            )}
          </div>
        </Modal>
      </div>
  );
};

export default StorePage;