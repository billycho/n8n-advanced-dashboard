"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Product = {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
};

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);

  // TANSTACK FORM
  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
      stock: 0,
    },
    onSubmit: async ({ value }) => {
      saveMutation.mutate(value);
    },
  });

  // GET
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/products");
      return res.json();
    },
  });

  // CREATE / UPDATE
  const saveMutation = useMutation({
    mutationFn: async (data: Product) => {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `http://localhost:3001/api/products/${editing._id}`
        : "http://localhost:3001/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return res.json();
    },
    onSuccess: () => {
      toast.success(editing ? "Updated!" : "Created!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setEditing(null);
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleEdit = (product: Product) => {
    alert("123")
    setEditing(product);
    form.setValues(product); // 🔥 key difference
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Products (TanStack Form)</h1>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-3 border p-4 rounded"
      >
        <form.Field name="name">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Name"
              className="border p-2 w-full"
            />
          )}
        </form.Field>

        <form.Field name="price">
          {(field) => (
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              placeholder="Price"
              className="border p-2 w-full"
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Description"
              className="border p-2 w-full"
            />
          )}
        </form.Field>

        <form.Field name="image">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Image URL"
              className="border p-2 w-full"
            />
          )}
        </form.Field>

        <form.Field name="stock">
          {(field) => (
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              placeholder="Stock"
              className="border p-2 w-full"
            />
          )}
        </form.Field>

        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2">
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                form.reset();
              }}
              className="bg-gray-400 px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: Product) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => deleteMutation.mutate(p._id!)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
