import { apiHandler } from "@/app/utils/ApiHandler";
import { CreateProduct, ProductCategory } from "@/interfaces/Product-interface";

export interface ProductCreate {
  productName: string;

  productPrice: number;
  
  vendorId: string;

  storeId: string;

  warehouseId: string;

  quantity: number;

  productCategory: ProductCategory;
}


export async function createProduct(data:CreateProduct) {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("productPrice", data.productPrice.toString());
    formData.append("vendorId", data.vendorId);
    formData.append("storeId", data.storeId);
    formData.append("warehouseId", data.warehouseId);
    formData.append("quantity", data.quantity.toString());
    formData.append("productCategory", data.productCategory);
    formData.append("image", data.file);

    const res = await apiHandler.post("/products", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`
        }
    });
    return res;
}