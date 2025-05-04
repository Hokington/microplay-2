import type { APIContext } from "astro";
import type { Platform } from "../../utils/types";
import type { ApiResponse } from "../../utils/types";

const API_URL = import.meta.env.API_URL;

export async function getPlatform(token: string, id: number): Promise<ApiResponse<Platform>> {
    const res = await fetch(`${API_URL}/platforms/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return res.json();
}

export async function getPlatforms(token: string): Promise<ApiResponse<Platform>> {
    const res = await fetch(`${API_URL}/platforms`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return res.json();
}

export async function addPlatform(token: string, name: string): Promise<ApiResponse<Platform>> {
    const res = await fetch(`${API_URL}/platforms/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name}),
    });
    
    return res.json();
}

export async function editPlatform(token: string, PlatformId: number, name: string): Promise<ApiResponse<Platform>> {
    const res = await fetch(`${API_URL}/platforms/${PlatformId}/`, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
    });

    return res.json();
}

export async function deletePlatform(token: string, PlatformId: number) {
    const res = await fetch(`${API_URL}/platforms/${PlatformId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    return res.status === 204 ? { success: true } : { success: false, error: "Error deleting item from platforms" };
}
