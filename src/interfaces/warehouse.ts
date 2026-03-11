import { CityData } from "./city"

export interface createWarehouseType{
    city:string,
    userID:string,
    warehouseCapacity:number,
    warehouseName: string
}

export interface WarehouseData {
    warehouseId: string
    warehouseName: string
    warehouseCapacity: number
    cityId:string
    city: CityData    
    warehouseInventory: any[]
}