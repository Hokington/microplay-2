const BASE_URL = import.meta.env.API_URL;

export async function getProducts(amount?: number) {
    const res = await fetch(`${BASE_URL}/products/?limit=${amount}`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}

export async function getProductById(id: number) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error(`Error fetching product with id ${id}`);
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Error fetching categories");
    return res.json();
}

export async function getGames(amount?: number) {
    const res = await fetch(`${BASE_URL}/products/?category_parent=1&limit=${amount}`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}

export async function getAccesories(amount?: number) {
    const res = await fetch(`${BASE_URL}/products/?category_parent=2&limit=${amount}`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}