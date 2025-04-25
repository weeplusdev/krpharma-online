// แก้ไขข้อมูลผู้ใช้ในฐานข้อมูลจำลอง โดยเปลี่ยนรหัสผ่านให้เป็นข้อความธรรมดา
// จำลองฐานข้อมูลและ Prisma Client ด้วย Mock Data

// นิยามประเภทข้อมูลพื้นฐาน
type User = {
    id: string
    name: string | null
    email: string
    password: string
    role: string
    image?: string | null
    emailVerified?: Date | null
  }
  
  type Product = {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    discount?: number
    image?: string
    category: string
    subcategory: string
    inStock: boolean
    stock: number
    rating: number
    popular: boolean
    isNew?: boolean
    requiresPrescription?: boolean
    form?: string
  }
  
  type Order = {
    id: string
    userId: string
    status: string
    totalPrice: number
    createdAt: Date
    updatedAt: Date
    items: OrderItem[]
  }
  
  type OrderItem = {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    product?: Product
  }
  
  // ข้อมูลจำลองสำหรับผู้ใช้
  export const users: User[] = [
    {
      id: "1",
      name: "Test User",
      email: "user@example.com",
      password: "password",
      role: "user",
    },
    {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      role: "admin",
    },
    {
      id: "3",
      name: "Doctor",
      email: "doctor@example.com",
      password: "password",
      role: "doctor",
    },
    {
      id: "4",
      name: "Pharmacist",
      email: "pharmacist@example.com",
      password: "password",
      role: "pharmacist",
    },
  ]
  
  const products: Product[] = [
    {
      id: "1",
      name: "เครื่องวัดความดันโลหิตดิจิตอล Omron HEM-7120",
      description: "เครื่องวัดความดันโลหิตอัตโนมัติแบบพกพา ใช้งานง่าย แม่นยำสูง",
      price: 1990,
      originalPrice: 2490,
      discount: 20,
      image: "/placeholder.svg?height=200&width=200",
      category: "medical-equipment",
      subcategory: "blood-pressure",
      inStock: true,
      stock: 50,
      rating: 4,
      popular: true,
      form: "เครื่อง",
    },
    {
      id: "2",
      name: "เทอร์โมมิเตอร์วัดไข้ทางหน้าผากแบบอินฟราเรด",
      description: "เครื่องวัดอุณหภูมิแบบไม่สัมผัส วัดได้รวดเร็วภายใน 1 วินาที",
      price: 1290,
      originalPrice: 1590,
      discount: 20,
      image: "/placeholder.svg?height=200&width=200",
      category: "medical-equipment",
      subcategory: "thermometer",
      inStock: true,
      stock: 30,
      rating: 5,
      popular: true,
      isNew: true,
      form: "เครื่อง",
    },
    {
      id: "3",
      name: "หน้ากาก N95 (แพ็ค 10 ชิ้น)",
      description: "หน้ากากป้องกันฝุ่นละออง PM2.5 และเชื้อโรค กรองอนุภาคได้ถึง 95%",
      price: 350,
      image: "/placeholder.svg?height=200&width=200",
      category: "covid",
      subcategory: "masks",
      inStock: true,
      stock: 100,
      rating: 4,
      popular: false,
      form: "แพ็ค",
    },
    {
      id: "4",
      name: "พาราเซตามอล 500 มก. (100 เม็ด)",
      description: "ยาบรรเทาอาการปวด ลดไข้ ใช้สำหรับบรรเทาอาการปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ และลดไข้",
      price: 120,
      image: "/placeholder.svg?height=200&width=200",
      category: "medication",
      subcategory: "pain-relief",
      inStock: true,
      stock: 200,
      rating: 4.2,
      popular: true,
      requiresPrescription: false,
      form: "เม็ด",
    },
    {
      id: "5",
      name: "อะม็อกซีซิลลิน 500 มก. (20 แคปซูล)",
      description: "ยาปฏิชีวนะใช้รักษาการติดเชื้อแบคทีเรีย เช่น หูชั้นกลางอักเสบ ไซนัสอักเสบ",
      price: 180,
      image: "/placeholder.svg?height=200&width=200",
      category: "medication",
      subcategory: "antibiotics",
      inStock: true,
      stock: 150,
      rating: 4.5,
      popular: false,
      requiresPrescription: true,
      form: "แคปซูล",
    },
  ]
  
  const orders: Order[] = [
    {
      id: "order1",
      userId: "1",
      status: "delivered",
      totalPrice: 2490,
      createdAt: new Date("2023-12-10"),
      updatedAt: new Date("2023-12-12"),
      items: [
        {
          id: "item1",
          orderId: "order1",
          productId: "1",
          quantity: 1,
          price: 1990,
        },
        {
          id: "item2",
          orderId: "order1",
          productId: "3",
          quantity: 2,
          price: 350,
        },
      ],
    },
    {
      id: "order2",
      userId: "1",
      status: "processing",
      totalPrice: 1290,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "item3",
          orderId: "order2",
          productId: "2",
          quantity: 1,
          price: 1290,
        },
      ],
    },
  ]
  
  // จำลอง Prisma Client อย่างง่าย
  export const mockDb = {
    user: {
      findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
        if (where.id) {
          return users.find((user) => user.id === where.id) || null
        }
        if (where.email) {
          return users.find((user) => user.email === where.email) || null
        }
        return null
      },
      findMany: async () => {
        return [...users]
      },
      create: async ({ data }: { data: Omit<User, "id"> }) => {
        const newUser = {
          id: `user${users.length + 1}`,
          ...data,
        }
        users.push(newUser)
        return newUser
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
        const userIndex = users.findIndex((user) => user.id === where.id)
        if (userIndex === -1) return null
  
        const updatedUser = { ...users[userIndex], ...data }
        users[userIndex] = updatedUser
        return updatedUser
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const userIndex = users.findIndex((user) => user.id === where.id)
        if (userIndex === -1) return null
  
        const deletedUser = users[userIndex]
        users.splice(userIndex, 1)
        return deletedUser
      },
    },
    product: {
      findUnique: async ({ where }: { where: { id: string } }) => {
        return products.find((product) => product.id === where.id) || null
      },
      findMany: async ({ where }: { where?: { category?: string; subcategory?: string } } = {}) => {
        let result = [...products]
  
        if (where?.category) {
          result = result.filter((product) => product.category === where.category)
        }
  
        if (where?.subcategory) {
          result = result.filter((product) => product.subcategory === where.subcategory)
        }
  
        return result
      },
      create: async ({ data }: { data: Omit<Product, "id"> }) => {
        const newProduct = {
          id: `product${products.length + 1}`,
          ...data,
        }
        products.push(newProduct)
        return newProduct
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<Product> }) => {
        const productIndex = products.findIndex((product) => product.id === where.id)
        if (productIndex === -1) return null
  
        const updatedProduct = { ...products[productIndex], ...data }
        products[productIndex] = updatedProduct
        return updatedProduct
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const productIndex = products.findIndex((product) => product.id === where.id)
        if (productIndex === -1) return null
  
        const deletedProduct = products[productIndex]
        products.splice(productIndex, 1)
        return deletedProduct
      },
    },
    order: {
      findUnique: async ({ where, include }: { where: { id: string }; include?: { items?: boolean } }) => {
        const order = orders.find((order) => order.id === where.id)
        if (!order) return null
  
        if (include?.items) {
          return {
            ...order,
            items: order.items.map((item) => {
              if (include.items) {
                return {
                  ...item,
                  product: products.find((p) => p.id === item.productId),
                }
              }
              return item
            }),
          }
        }
  
        return order
      },
      findMany: async ({ where, include }: { where?: { userId?: string }; include?: { items?: boolean } } = {}) => {
        let result = [...orders]
  
        if (where?.userId) {
          result = result.filter((order) => order.userId === where.userId)
        }
  
        if (include?.items) {
          return result.map((order) => ({
            ...order,
            items: order.items.map((item) => ({
              ...item,
              product: products.find((p) => p.id === item.productId),
            })),
          }))
        }
  
        return result
      },
      create: async ({
        data,
      }: {
        data: { userId: string; totalPrice: number; items: { productId: string; quantity: number; price: number }[] }
      }) => {
        const newOrder = {
          id: `order${orders.length + 1}`,
          userId: data.userId,
          status: "pending",
          totalPrice: data.totalPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: data.items.map((item, index) => ({
            id: `item${orders.reduce((acc, order) => acc + order.items.length, 0) + index + 1}`,
            orderId: `order${orders.length + 1}`,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }
  
        orders.push(newOrder)
        return newOrder
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<Omit<Order, "items">> }) => {
        const orderIndex = orders.findIndex((order) => order.id === where.id)
        if (orderIndex === -1) return null
  
        const updatedOrder = { ...orders[orderIndex], ...data, updatedAt: new Date() }
        orders[orderIndex] = updatedOrder
        return updatedOrder
      },
    },
    orderItem: {
      findMany: async ({ where }: { where: { orderId: string } }) => {
        const order = orders.find((order) => order.id === where.orderId)
        return order ? order.items : []
      },
      create: async ({ data }: { data: Omit<OrderItem, "id"> }) => {
        const orderIndex = orders.findIndex((order) => order.id === data.orderId)
        if (orderIndex === -1) throw new Error("Order not found")
  
        const newItem = {
          id: `item${orders.reduce((acc, order) => acc + order.items.length, 0) + 1}`,
          ...data,
        }
  
        orders[orderIndex].items.push(newItem)
        return newItem
      },
    },
  }
  
  export { products, orders }
  