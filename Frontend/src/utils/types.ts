export interface Category {
    id: number;
    name: string;
    parent: number | null;
    subcategories: Category[];
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}