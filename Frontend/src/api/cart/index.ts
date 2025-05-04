import type { CartItem } from "../../utils/types";
import type { ApiResponse } from "../../utils/types";

const API_URL = import.meta.env.API_URL;

export async function getCart(token: string): Promise<ApiResponse<CartItem>> {
    const res = await fetch(`${API_URL}/cart-items`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    // if (!res.ok) throw new Error("Error fetching cart items");
    return res.json();
}

export async function addToCart(token: string, product_id: number, quantity: number = 1): Promise<ApiResponse<CartItem>> {
    const res = await fetch(`${API_URL}/cart-items/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({product_id: product_id, quantity: quantity}),
    });

    // if (!res.ok) throw new Error("Error adding item to cart");
    return res.json();
}

export async function updateCart(token: string, cartItemId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    const res = await fetch(`${API_URL}/cart-items/${cartItemId}/`, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });

    // if (!res.ok) throw new Error("Error updating item in cart");
    return res.json();
}

export async function deleteFromCart(token: string, cartItemId: number) {
    const res = await fetch(`${API_URL}/cart-items/${cartItemId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    // if (!res.ok) throw new Error("Error deleting item from cart");
    return res.status === 204 ? { success: true } : { success: false, error: "Error deleting item from cart" };
}

export async function buyCart(token: string) {
    const res = await fetch(`${API_URL}/orders/from-cart/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
    })

    // const data = await res.text();
    // console.log("DATA:", data);
    // // console.log("STATUS:", res.status);
    // // console.log("OK:", res.ok);
    // // console.log("DATA:", data);

    return res.json()
}