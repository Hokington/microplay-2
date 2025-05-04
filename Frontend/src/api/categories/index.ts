import type { APIContext } from "astro";
import type { Category } from "../../utils/types";
import type { ApiResponse } from "../../utils/types";

const API_URL = import.meta.env.API_URL;

export async function getCategory(token: string, id: number): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return res.json();
}

export async function getCategories(token: string): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return res.json();
}

export async function addCategory(token: string, name: string, parent: number | null): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/categories/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name, parent: parent}),
    });
    
    return res.json();
}

export async function editCategory(token: string, CategoryId: number, name: string, parent: number | null): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/categories/${CategoryId}/`, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, parent: parent }),
    });

    return res.json();
}

export async function deleteCategory(token: string, CategoryId: number) {
    const res = await fetch(`${API_URL}/categories/${CategoryId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    return res.status === 204 ? { success: true } : { success: false, error: "Error deleting item from categories" };
}
