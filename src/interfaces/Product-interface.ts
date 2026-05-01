export enum ProductCategory {
    electronics = "electronics",
    clothing = "clothing",
    home_appliances = "home_appliances",
    books = "books",
    toys = "toys",
    sports = "sports",
}

interface CreateProduct {
    productName:string;
    productPrice:number;
    vendorId:string;
    storeId:string;
    warehouseId:string;
    quantity:number;
    productCategory:ProductCategory;
    file:File | null;
}

export type { CreateProduct };
