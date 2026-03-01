"use client"
"use client"

import ProductsCard from "@/components/customer-ui/products-card"
import React from "react"
import { colors } from "@/lib/colors"
import { useParams } from "next/navigation"

interface ProductProps {
  name: string
  price: number
  type: string
  img: string
}

const FALLBACK_IMAGE = "/file.svg"

export default function ProductsPage() {
  const params = useParams<{ type: string | string[] }>()
  const typeParam = params?.type
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam ?? ""

  const [products, setProducts] = React.useState<ProductProps[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    const fetchProducts = async () => {
      if (!type) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/product/getproductType?type=${encodeURIComponent(type)}`,
          { method: "GET" }
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.message ?? "Failed to fetch products")
        }

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data?.products)
          ? data.data.products
          : []

        const mapped: ProductProps[] = list.map((item: any, index: number) => ({
          name: item.name ?? item.productName ?? "Product",
          price: Number(item.price ?? item.cost ?? 0),
          type: item.type ?? item.category ?? type,
          img:
            item.img ??
            item.image ??
            (Array.isArray(item.images) ? item.images[0] : null) ??
            FALLBACK_IMAGE,
        }))

        if (alive) {
          setProducts(mapped)
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch products"
        if (alive) {
          setError(message)
          setProducts([])
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      alive = false
    }
  }, [type])

  return (
    <div className="p-6" style={{ backgroundColor: colors.background.app }}>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text.accent }}
      >
        {type ? type.toUpperCase() : "PRODUCTS"} Products
      </h1>

      {loading ? (
        <p className="text-sm" style={{ color: colors.text.muted }}>
          Loading products...
        </p>
      ) : error ? (
        <p className="text-sm" style={{ color: colors.text.muted }}>
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="text-sm" style={{ color: colors.text.muted }}>
          No products found.
        </p>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-6
          "
        >
          {products.map((product, index) => (
            <ProductsCard
              key={`${product.name}-${index}`}
              name={product.name}
              price={product.price}
              type={product.type}
              img={product.img}
            />
          ))}
        </div>
      )}
    </div>
  )
}
