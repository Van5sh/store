import { apiHandler } from "@/app/utils/ApiHandler";
import { CreateStoreData } from "@/interfaces/store";

export async function createStore(storeData:CreateStoreData){
    try {
        if (!storeData.storeName || !storeData.cityName || !storeData.vendorId) {
            throw new Error("Missing required store information");
        }
        const response=await apiHandler.post("/store/create",storeData,{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
        });
        if (response.status !== 201) {
            throw new Error("Failed to create store");
        }
        return response.data;
    }catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create store"
        throw new Error(message);
    }
}

export type VendorStore = {
    storeId: string
    storeName: string
    cityName: string
    vendorId: string
}

export async function getVendorStores(vendorId: string): Promise<VendorStore[]> {
    if (!vendorId) throw new Error("Missing vendorId")

    const res = await apiHandler.get("/store", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
    })

    const stores = (res.data ?? []) as VendorStore[]
    return Array.isArray(stores) ? stores.filter((s) => s?.vendorId === vendorId) : []
}
