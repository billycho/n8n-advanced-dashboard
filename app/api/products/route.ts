import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find();

  return Response.json(products);
}

// CREATE new product
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      stock: body.stock,
    });

    return Response.json(product, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}