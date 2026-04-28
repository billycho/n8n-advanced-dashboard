import { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);
  return res.json();
}

export async function createProduct(data: Product) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}