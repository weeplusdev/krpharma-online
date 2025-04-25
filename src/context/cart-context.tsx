"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// กำหนดโครงสร้างข้อมูลสินค้าในตะกร้า
export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  prescription?: boolean
  form?: string
}

// กำหนดโครงสร้าง Context
type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  isLoading: boolean // เพิ่มสถานะการโหลด
}

// สร้าง Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// สร้าง Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true) // เพิ่มสถานะการโหลด

  // โหลดข้อมูลตะกร้าจาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error)
    } finally {
      setIsLoading(false) // ตั้งค่าการโหลดเป็นเสร็จสิ้น
    }
  }, [])

  // บันทึกข้อมูลตะกร้าลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (!isLoading) {
      // บันทึกเฉพาะเมื่อไม่ได้อยู่ในสถานะการโหลด
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoading])

  // ฟังก์ชันต่างๆ สำหรับจัดการตะกร้า
  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
