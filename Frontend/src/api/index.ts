import type { Product } from "../utils/types";
import type { GetProductParams } from "../utils/types";
import type { ApiResponse } from "../utils/types";

const BASE_URL = import.meta.env.API_URL;

export async function getPlatforms() {
    const res = await fetch(`${BASE_URL}/platforms`);
    if (!res.ok) throw new Error("Error fetching platforms");
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Error fetching categories");
    return res.json();
}

export async function getProducts({
    id,
    name,
    description,
    priceMin,
    priceMax,
    stockMin,
    releaseDateMin,
    category,
    categoryName,
    categoryParent,
    platform,
    platformName,
    ordering,
    limit,
  }:GetProductParams = {}): Promise<ApiResponse<Product>> {
    const params = new URLSearchParams();
  
    if (id) params.append('id', (id).toString());
    if (name) params.append('name__icontains', name);
    if (description) params.append('description__icontains', description);
    if (priceMin) params.append('price__gte', (priceMin).toString() );
    if (priceMax) params.append('price__lte', (priceMax).toString());
    if (stockMin) params.append('stock__gte', (stockMin).toString());
    if (releaseDateMin) params.append('release_date__gte', releaseDateMin);
    if (category) params.append('category__id', (category).toString());
    if (categoryName) params.append('category__name__icontains', categoryName);
    if (categoryParent) params.append('category__parent', (categoryParent).toString());
    if (platform) params.append('platform', platform.toString())
    if (platformName) params.append('platform__name__icontains', platformName);
    if (ordering) params.append('ordering', ordering);
    if (limit) params.append('limit', limit.toString());
  
    const url = `${BASE_URL}/products/?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
}

export async function getOrders(token: string) {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function createReview(token: string, productId: number, rating: number, comment: string) {
    const res = await fetch(`${BASE_URL}/reviews/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            product_id: productId,
            rating,
            comment,
        }),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function getReviews(productId: number) {
    const res = await fetch(`${BASE_URL}/reviews/?product_id=${productId}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}