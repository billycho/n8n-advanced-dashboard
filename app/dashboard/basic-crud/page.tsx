"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/hooks";
import type { Product } from "@/features/products/types";
import { AddProductDialog } from "@/features/products/components/add-product-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductsPage() {
  const [editing, setEditing] = useState<Product | null>(null);

  // ✅ use custom hook instead of useQuery
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold">Products</h1>
             <p className="text-muted-foreground">Manage your products</p>
           </div>
   
           <div className="max-w-[100px]">
             <AddProductDialog />
           </div>
         </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="max-w-[150px]">{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}