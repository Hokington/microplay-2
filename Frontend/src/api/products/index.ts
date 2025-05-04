import type { Product } from "../../utils/types";
import type { ApiResponse } from "../../utils/types";

const BASE_URL = import.meta.env.API_URL;



export async function getProducts(token: string): Promise<ApiResponse<Product>> {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}

export async function getProduct(token: string, id: number): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}

export async function createProduct(token: string, data: any): Promise<ApiResponse<Product>> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("release_date", data.release_date);
    formData.append("platform_id", data.platform);
    formData.append("category_id", data.category);
    if (data.image) {
        formData.append("image", data.image);
    }

    const res = await fetch(`${BASE_URL}/products/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
        body: formData,
    });
    
    return res.json();
}

export async function editProduct(token: string, id: number, data: any): Promise<ApiResponse<Product>> {

    console.log(data);


    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("release_date", data.release_date);
    formData.append("platform_id", data.platform);
    formData.append("category_id", data.category);
    if (data.image) {
        formData.append("image", data.image);
    }

    const res = await fetch(`${BASE_URL}/products/${id}/`, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
        },
        body: formData,
    });


    return res.json();
}

export async function deleteProduct(token: string, id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

}
