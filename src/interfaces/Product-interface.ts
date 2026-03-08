export enum ProductCategory {
    Electronics = "Electronics",
    Clothing = "Clothing",
    HomeAppliances = "Home Appliances",
    Books = "Books",
    Beauty = "Beauty",
    Sports = "Sports",
    Toys = "Toys",
    Furniture = "Furniture",
    Automotive = "Automotive",
    Grocery = "Grocery",
    Health = "Health"
}

interface CreateProduct {
    productName:string;
    productPrice:number;
    vendorId:string;
    storeId:string;
    warehouseId:string;
    quantity:number;
    productCategory:ProductCategory;
    file:File;
}

export type { CreateProduct };
