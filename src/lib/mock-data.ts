// จำลองข้อมูลสินค้า
export const products = [
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
      rating: 4,
      popular: true,
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
      rating: 5,
      popular: true,
      isNew: true,
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
      rating: 4,
      popular: false,
    },
  ]
  
  // จำลองข้อมูลผู้ใช้
  export const users = [
    {
      id: "1",
      name: "Test User",
      email: "test@example.com",
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
  ]
  
  // จำลองข้อมูลคำสั่งซื้อ
  export const orders = [
    {
      id: "order1",
      userId: "1",
      products: [
        { productId: "1", quantity: 1, price: 1990 },
        { productId: "3", quantity: 2, price: 350 },
      ],
      totalPrice: 2690,
      status: "delivered",
      createdAt: "2023-12-10T00:00:00.000Z",
    },
    {
      id: "order2",
      userId: "1",
      products: [{ productId: "2", quantity: 1, price: 1290 }],
      totalPrice: 1290,
      status: "processing",
      createdAt: "2024-01-15T00:00:00.000Z",
    },
  ]
  
  // ฟังก์ชันสำหรับดึงข้อมูลสินค้า
  export function getProducts(options?: {
    category?: string
    subcategory?: string
    search?: string
    inStock?: boolean
  }) {
    let result = [...products]
  
    if (options?.category) {
      result = result.filter((product) => product.category === options.category)
    }
  
    if (options?.subcategory) {
      result = result.filter((product) => product.subcategory === options.subcategory)
    }
  
    if (options?.search) {
      const search = options.search.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search),
      )
    }
  
    if (options?.inStock) {
      result = result.filter((product) => product.inStock)
    }
  
    return result
  }
  
  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าตาม ID
  export function getProductById(id: string) {
    return products.find((product) => product.id === id)
  }
  
  // ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อของผู้ใช้
  export function getUserOrders(userId: string) {
    return orders.filter((order) => order.userId === userId)
  }
  
  // ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อตาม ID
  export function getOrderById(id: string) {
    return orders.find((order) => order.id === id)
  }
  