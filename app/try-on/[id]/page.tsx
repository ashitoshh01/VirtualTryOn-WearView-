"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Ruler, Check, ShoppingCart, Camera } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
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
]

export default function TryOnPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = products.find((p) => p.id === params.id) || products[0]
  const { addToCart } = useCart()

  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [measurementsComplete, setMeasurementsComplete] = useState(false)
  const [tryOnComplete, setTryOnComplete] = useState(false)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)

  // Measurements state
  const [measurements, setMeasurements] = useState({
    height: 170,
    weight: 70,
    chest: 90,
    waist: 80,
    hips: 95,
    inseam: 80,
  })

  const handleMeasurementChange = (name: keyof typeof measurements, value: number) => {
    setMeasurements((prev) => ({ ...prev, [name]: value }))
  }

  const handleCameraCapture = () => {
    setPhotoUploaded(true)
    setIsCameraModalOpen(false)

    // Simulate processing after capture
    setTimeout(() => {
      setTryOnComplete(true)
    }, 2000)
  }

  const handleMeasurementsSubmit = () => {
    setMeasurementsComplete(true)
    setTimeout(() => {
      setTryOnComplete(true)
    }, 2000)
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="sticky top-24">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-6">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>

              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <div className="text-xl font-medium mb-4">₹{product.price}</div>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative h-12 w-48">
                  <Image src="/images/wearview-logo.png" alt="WearView Logo" fill className="object-contain" />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 text-center">Virtual Try-On</h2>
              <p className="text-muted-foreground mb-6 text-center">
                See how this {product.name.toLowerCase()} will look on you using our virtual try-on technology.
              </p>

              <Tabs defaultValue="photo" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="photo">Use Camera</TabsTrigger>
                  <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
                </TabsList>

                <TabsContent value="photo" className="space-y-6">
                  {tryOnComplete ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium">Try-On Complete!</h3>
                      <p className="text-muted-foreground">
                        Your virtual model has been created with the {product.name.toLowerCase()}.
                      </p>
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden my-6 border-2 border-primary">
                        <Image
                          src="/placeholder.svg?height=600&width=450"
                          alt="Virtual try-on result"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : photoUploaded ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mx-auto"></div>
                      <h3 className="text-lg font-medium">Processing Your Image</h3>
                      <p className="text-muted-foreground">
                        We're creating your virtual model. This will take just a moment...
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Use Your Camera</h3>
                      <p className="text-muted-foreground mb-6">
                        See how this {product.name.toLowerCase()} will look on you in real-time.
                      </p>
                      <Button onClick={() => setIsCameraModalOpen(true)}>Open Camera</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="measurements" className="space-y-6">
                  {tryOnComplete ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium">Try-On Complete!</h3>
                      <p className="text-muted-foreground">
                        Your virtual model has been created with the {product.name.toLowerCase()}.
                      </p>
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden my-6 border-2 border-primary">
                        <Image
                          src="/placeholder.svg?height=600&width=450"
                          alt="Virtual try-on result"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : measurementsComplete ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mx-auto"></div>
                      <h3 className="text-lg font-medium">Creating Your Model</h3>
                      <p className="text-muted-foreground">
                        We're generating your virtual model based on your measurements...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Ruler className="w-5 h-5" />
                        <span>Enter your measurements for the most accurate fit</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="height">Height (cm)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="height"
                              min={140}
                              max={210}
                              step={1}
                              value={[measurements.height]}
                              onValueChange={(value) => handleMeasurementChange("height", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.height}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="weight"
                              min={40}
                              max={150}
                              step={1}
                              value={[measurements.weight]}
                              onValueChange={(value) => handleMeasurementChange("weight", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.weight}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="chest">Chest (cm)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="chest"
                              min={70}
                              max={130}
                              step={1}
                              value={[measurements.chest]}
                              onValueChange={(value) => handleMeasurementChange("chest", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.chest}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="waist">Waist (cm)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="waist"
                              min={60}
                              max={120}
                              step={1}
                              value={[measurements.waist]}
                              onValueChange={(value) => handleMeasurementChange("waist", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.waist}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="hips">Hips (cm)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="hips"
                              min={70}
                              max={130}
                              step={1}
                              value={[measurements.hips]}
                              onValueChange={(value) => handleMeasurementChange("hips", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.hips}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="inseam">Inseam (cm)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="inseam"
                              min={60}
                              max={100}
                              step={1}
                              value={[measurements.inseam]}
                              onValueChange={(value) => handleMeasurementChange("inseam", value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-right">{measurements.inseam}</span>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleMeasurementsSubmit} className="w-full">
                        Generate Virtual Model
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {tryOnComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-bold mb-4">Perfect Fit!</h3>
                  <p className="text-muted-foreground mb-4">
                    Based on your measurements, this {product.name.toLowerCase()} is a great fit for you.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Fit Rating</div>
                      <div className="text-lg font-medium">95% Match</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Recommended Size</div>
                      <div className="text-lg font-medium">M</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-bold mb-4">Try More Options</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products
                      .filter((p) => p.id !== product.id)
                      .slice(0, 3)
                      .map((p) => (
                        <Link key={p.id} href={`/try-on/${p.id}`} className="group">
                          <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-2">
                            <Image
                              src={p.image || "/placeholder.svg"}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-sm text-muted-foreground">₹{p.price}</div>
                        </Link>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
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
