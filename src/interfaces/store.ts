export interface Store {
    id: string;
    name: string;
    city: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStoreData {
    storeName:string;
    cityName:string;
    vendorId:string;
}