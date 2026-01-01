"use client";

import ProductsCard from "@/components/customer-ui/products-card";
import React from "react";
import { colors } from "@/lib/colors";

export default function ProductsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  interface ProductProps {
      name: string;
      price: number;
      type: string;
      img: string;
  }
  const products: ProductProps[] = [
    {
      name: "Wireless Headphones",
      price: 99.99,
      type: "Electronics",
      img: "/images/headphones.jpg",
    },
    {
      name: "Smart Watch",
      price: 149.99,
      type: "Electronics",
      img: "/images/smartwatch.jpg",
    },
    {
      name: "Running Shoes",
      price: 79.99,
      type: "Footwear",
      img: "/images/shoes.jpg",
    },
    {
      name: "Backpack",
      price: 59.99,
      type: "Accessories",
      img: "/images/backpack.jpg",
    },
    {
      name: "Coffee Maker",
      price: 129.99,
      type: "Home Appliances",
      img: "/images/coffeemaker.jpg",
    },
    {
      name: "Desk Lamp",
      price: 34.99,
      type: "Home Decor",
      img: "/images/lamps.jpg",
    },
    {
      name: "Gaming Mouse",
      price: 49.99,
      type: "Electronics",
      img: "/images/mouse.jpg",
    },
    {
      name: "Yoga Mat",
      price: 24.99,
      type: "Fitness",
      img: "/images/yogamat.jpg",
    },
    {
      name: "Water Bottle",
      price: 19.99,
      type: "Fitness",
      img: "/images/bottle.jpg",
    },
    {
      name: "Sunglasses",
      price: 89.99,
      type: "Accessories",
      img: "/images/sunglasses.jpg",
    },
  ];

  const { type } = React.use(params);
  return (
  <div className="p-6" style={{ backgroundColor: colors.background.app }}>
    <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text.accent }}>
      {type.toUpperCase()} Products
    </h1>

    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      gap-6
    ">
      {products.map((product, index) => (
        <ProductsCard
          key={index}
          name={product.name}
          price={product.price}
          type={product.type}
          img={product.img}
        />
      ))}
    </div>
  </div>
  );
}
