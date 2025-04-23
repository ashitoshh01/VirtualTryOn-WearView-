"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Define the product type
export type CartProduct = {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
}

// Define the cart context type
type CartContextType = {
  cart: CartProduct[]
  addToCart: (product: Omit<CartProduct, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create a provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("wearview-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wearview-cart", JSON.stringify(cart))

    // Calculate totals
    const items = cart.reduce((total, item) => total + item.quantity, 0)
    const price = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    setTotalItems(items)
    setTotalPrice(price)
  }, [cart])

  // Add a product to the cart
  const addToCart = (product: Omit<CartProduct, "quantity">) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id)

      if (existingProduct) {
        // If product already exists, increase quantity
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Otherwise add new product with quantity 1
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Update the quantity of a product
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Clear the cart
  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
