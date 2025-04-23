"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState("")

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link href="/#shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex gap-4 items-center">
                      <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-red-500 hover:text-red-600 p-0 h-auto mt-1 md:hidden"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">Price:</div>${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="md:hidden text-sm text-muted-foreground mr-2">Quantity:</div>
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right flex items-center justify-between md:justify-end">
                      <div className="md:hidden text-sm text-muted-foreground">Total:</div>
                      <div className="flex items-center gap-3">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hidden md:flex"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-background rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-medium">
                <span>Total</span>
                <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <Button variant="outline">Apply</Button>
              </div>
              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
