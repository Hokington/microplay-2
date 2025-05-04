export interface Category {
    id: number;
    name: string;
    parent: number | null;
    parent_name: string | null;
    subcategories: Category[];
}

export interface Platform {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    release_date: string;
    category: Category;
    platform?: Platform;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

export interface GetProductParams {
    id?: number;
    name?: string;
    description?: string;
    priceMin?: number;
    priceMax?: number;
    stockMin?: number;
    releaseDateMin?: string; 
    category?: number;
    categoryName?: string;
    categoryParent?: number;
    platform?: number;
    platformName?: string;
    ordering?: string;
    limit?: number;
}

export interface ApiResponse<T> {
    count: number;      
    next: string | null;
    previous: string | null;
    results: T[];
  }