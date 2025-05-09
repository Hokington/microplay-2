const BASE_URL = import.meta.env.API_URL;

export async function getOrders(token: string) {
    const res = await fetch(`${BASE_URL}/orders/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function getOrder(token: string, orderId: string) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}