"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"

// Product type definition
type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  tags?: string[]
}

export default function ShopSection() {
  // Sample product data with prices directly in INR
  const products: Product[] = [
    {
      id: "1",
      name: "Classic White T-Shirt",
      category: "Shirts",
      price: 1299,
      image: "/images/tshirt.jpeg",
      tags: ["New", "Popular"],
    },
    {
      id: "2",
      name: "Slim Fit Jeans",
      category: "Pants",
      price: 2499,
      image: "/images/jeans.jpeg",
      tags: ["Bestseller"],
    },
    {
      id: "3",
      name: "Blessed Hoodie",
      category: "Hoodies",
      price: 1999,
      image: "/images/hoodie.webp",
    },
    {
      id: "4",
      name: "Running Shoes",
      category: "Shoes",
      price: 3499,
      image: "/placeholder.svg?height=400&width=300",
      tags: ["New"],
    },
    {
      id: "5",
      name: "Leather Jacket",
      category: "Jackets",
      price: 4999,
      image: "/images/leather-jacket.webp",
      tags: ["Premium"],
    },
    {
      id: "6",
      name: "Summer Beach Set",
      category: "Sets",
      price: 2999,
      image: "/images/summer-set.webp",
    },
  ]

  const [filter, setFilter] = useState<string>("All")
  const categories = ["All", "Shirts", "Pants", "Hoodies", "Shoes", "Jackets", "Sets"]
  const { addToCart } = useCart()

  const filteredProducts = filter === "All" ? products : products.filter((product) => product.category === filter)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <section id="shop" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try-On Shop</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection and experience virtual try-on with just a few clicks.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden group">
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {product.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <div className="font-medium">₹{product.price}</div>
                </CardContent>
                <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/try-on/${product.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> Try-On
                    </Link>
                  </Button>
                  <Button className="w-full" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
