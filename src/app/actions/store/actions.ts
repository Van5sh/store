import { apiHandler } from "@/app/utils/ApiHandler";
import { CreateStoreData } from "@/interfaces/store";

export async function createStore(storeData:CreateStoreData){
    try {
        if (!storeData.storeName || !storeData.cityName || !storeData.vendorId) {
            throw new Error("Missing required store information");
        }
        const response=await apiHandler.post("/store/create",storeData,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.status !== 201) {
            throw new Error("Failed to create store");
        }
        return response.data;
    }catch (error) {
        throw new Error("Failed to create store");
    }
}