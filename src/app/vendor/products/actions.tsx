import { apiHandler } from "@/app/utils/ApiHandler";
import { CreateProduct } from "@/interfaces/Product-interface";

async function createProduct(productData:CreateProduct) {
    const response=await apiHandler.post("/products",{
        productName:productData.productName,
        productPrice:productData.productPrice,
        vendorId:productData.vendorId,
        storeId:productData.storeId,
        warehouseId:productData.warehouseId,
        quantity:productData.quantity,
        productCategory:productData.productCategory
    })
    return response.data;
}