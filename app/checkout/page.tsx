"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { ArrowLeft, CreditCard, Truck, Check } from "lucide-react"
import { useState } from "react"

// Convert USD to INR (approximate conversion rate)
const convertToINR = (usdPrice: number) => {
  const conversionRate = 75
  return Math.round(usdPrice * conversionRate)
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Convert prices to INR
  const totalPriceINR = convertToINR(totalPrice)
  const taxINR = convertToINR(totalPrice * 0.1)
  const totalWithTaxINR = totalPriceINR + taxINR

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate checkout process
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
      clearCart()
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            You need to add items to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link href="/#shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link href="/cart">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" required />
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required />
                </div>
                <div>
                  <Label htmlFor="zip">PIN Code</Label>
                  <Input id="zip" required />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvc">CVV</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Shipping Method</h2>
              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Standard Shipping (3-5 business days) - Free
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Express Shipping (1-2 business days) - ₹749
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-background rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-[400px] overflow-auto mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <span>₹{convertToINR(item.price * item.quantity)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ₹{convertToINR(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPriceINR}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{taxINR}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-medium">
                <span>Total</span>
                <span>₹{totalWithTaxINR}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
