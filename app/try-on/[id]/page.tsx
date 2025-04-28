"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CameraModal from "@/components/camera-modal"

// Sample product data with prices directly in INR
const products = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    category: "Shirts",
    price: 1299,
    image: "/images/tshirt.jpeg",
    description: "A comfortable, classic fit t-shirt made from 100% cotton.",
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    category: "Pants",
    price: 2499,
    image: "/images/jeans.jpeg",
    description: "Modern slim fit jeans with a comfortable stretch fabric.",
  },
  {
    id: "3",
    name: "Blessed Hoodie",
    category: "Hoodies",
    price: 1999,
    image: "/images/hoodie.webp",
    description: "A warm and comfortable hoodie perfect for casual wear.",
  },
  {
    id: "4",
    name: "Running Shoes",
    category: "Shoes",
    price: 3499,
    image: "/placeholder.svg?height=400&width=300",
    description: "Lightweight running shoes with responsive cushioning.",
  },
  {
    id: "5",
    name: "Leather Jacket",
    category: "Jackets",
    price: 4999,
    image: "/images/leather-jacket.webp",
    description: "Premium leather jacket with a classic design.",
  },
  {
    id: "6",
    name: "Summer Beach Set",
    category: "Sets",
    price: 2999,
    image: "/images/summer-set.webp",
    description: "Light and stylish summer beach set with tropical print.",
  },
  {
    id: "7",
    name: "Classic Aviator Sunglasses",
    category: "Accessories",
    price: 1499,
    image: "/placeholder.svg?height=400&width=300&text=Sunglasses",
    description: "Timeless aviator sunglasses with UV protection.",
  },
  {
    id: "8",
    name: "Leather Watch",
    category: "Accessories",
    price: 2999,
    image: "/placeholder.svg?height=400&width=300&text=Watch",
    description: "Elegant leather watch with stainless steel case.",
  },
  {
    id: "9",
    name: "Silver Necklace",
    category: "Accessories",
    price: 1799,
    image: "/placeholder.svg?height=400&width=300&text=Necklace",
    description: "Delicate silver necklace with pendant.",
  },
]

export default function TryOnPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = products.find((p) => p.id === params.id) || products[0]
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const [tryOnComplete, setTryOnComplete] = useState(false)

  const handleCameraCapture = () => {
    setIsCameraModalOpen(false)
    setTryOnComplete(true)
  }

  // Check if we're in a preview environment
  const isPreviewEnvironment = () => {
    return (
      typeof window !== "undefined" &&
      (window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("v0.dev") ||
        window.location.hostname === "localhost")
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Button>
      </div>

      {isPreviewEnvironment() && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Mode</AlertTitle>
          <AlertDescription>
            You're viewing this in a preview environment. The virtual try-on feature will use simulation mode.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-6">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl font-medium mb-4">₹{product.price}</div>
          <p className="text-muted-foreground mb-6">{product.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-muted rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">Virtual Try-On</h2>
            <p className="text-muted-foreground mb-6 text-center">
              See how this {product.name.toLowerCase()} will look on you using our virtual try-on technology.
            </p>

            {tryOnComplete ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium">Try-On Complete!</h3>
                <p className="text-muted-foreground">You've successfully tried on the {product.name.toLowerCase()}.</p>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden my-6 border-2 border-primary">
                  <Image
                    src="/placeholder.svg?height=600&width=450&text=Try-On+Result"
                    alt="Virtual try-on result"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button onClick={() => setIsCameraModalOpen(true)} className="w-full">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-dashed border-border">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <Button onClick={() => setIsCameraModalOpen(true)} className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  {isPreviewEnvironment() ? "View in Simulation" : "View in Camera"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        productImage={product.image}
        productName={product.name}
      />
    </div>
  )
}
