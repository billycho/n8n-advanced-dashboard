import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Product as ProductType } from "./types";

// GET
export async function getProductsFromDB(): Promise<ProductType[]> {
  await connectDB();

  return await Product.find().lean();
}

// CREATE
export async function createProductInDB(data: ProductType) {
  await connectDB();

  return await Product.create({
    name: data.name,
    price: data.price,
    description: data.description,
    image: data.image,
    stock: data.stock,
  });
}