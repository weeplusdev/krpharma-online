// Anatomical Therapeutic Chemical (ATC) classification system
export type ATCCategory = {
    code: string
    name: {
      th: string
      en: string
    }
    subgroups: ATCSubgroup[]
  }
  
  export type ATCSubgroup = {
    code: string
    name: {
      th: string
      en: string
    }
  }
  
  export const atcCategories: ATCCategory[] = [
    {
      code: "A",
      name: {
        th: "ระบบทางเดินอาหารและเมตาบอลิซึม",
        en: "Alimentary tract and metabolism",
      },
      subgroups: [
        {
          code: "A01",
          name: {
            th: "ยาในช่องปาก",
            en: "Stomatological preparations",
          },
        },
        {
          code: "A02",
          name: {
            th: "ยารักษาโรคที่เกี่ยวข้องกับภาวะกรด",
            en: "Drugs for acid related disorders",
          },
        },
        {
          code: "A03",
          name: {
            th: "ยารักษาโรคเกี่ยวกับการทำงานของทางเดินอาหาร",
            en: "Drugs for functional gastrointestinal disorders",
          },
        },
        {
          code: "A04",
          name: {
            th: "ยาแก้อาเจียนและแก้คลื่นไส้",
            en: "Antiemetics and antinauseants",
          },
        },
        {
          code: "A05",
          name: {
            th: "ยารักษาโรคทางเดินน้ำดีและตับ",
            en: "Bile and liver therapy",
          },
        },
        {
          code: "A06",
          name: {
            th: "ยาระบาย",
            en: "Drugs for constipation",
          },
        },
        {
          code: "A07",
          name: {
            th: "ยาแก้ท้องเสีย",
            en: "Antidiarrheals",
          },
        },
        {
          code: "A10",
          name: {
            th: "ยารักษาเบาหวาน",
            en: "Drugs used in diabetes",
          },
        },
      ],
    },
    {
      code: "B",
      name: {
        th: "เลือดและอวัยวะสร้างเลือด",
        en: "Blood and blood forming organs",
      },
      subgroups: [
        {
          code: "B01",
          name: {
            th: "ยาต้านการแข็งตัวของเลือด",
            en: "Antithrombotic agents",
          },
        },
        {
          code: "B02",
          name: {
            th: "ยาห้ามเลือด",
            en: "Antihemorrhagics",
          },
        },
        {
          code: "B03",
          name: {
            th: "ยารักษาโลหิตจาง",
            en: "Antianemic preparations",
          },
        },
        {
          code: "B05",
          name: {
            th: "สารทดแทนพลาสมาและสารละลายสำหรับฉีด",
            en: "Blood substitutes and perfusion solutions",
          },
        },
      ],
    },
    {
      code: "C",
      name: {
        th: "ระบบหัวใจและหลอดเลือด",
        en: "Cardiovascular system",
      },
      subgroups: [
        {
          code: "C01",
          name: {
            th: "ยารักษาโรคหัวใจ",
            en: "Cardiac therapy",
          },
        },
        {
          code: "C02",
          name: {
            th: "ยาลดความดันโลหิต",
            en: "Antihypertensives",
          },
        },
        {
          code: "C03",
          name: {
            th: "ยาขับปัสสาวะ",
            en: "Diuretics",
          },
        },
        {
          code: "C07",
          name: {
            th: "เบต้าบล็อกเกอร์",
            en: "Beta blocking agents",
          },
        },
        {
          code: "C08",
          name: {
            th: "แคลเซียมแชนแนลบล็อกเกอร์",
            en: "Calcium channel blockers",
          },
        },
        {
          code: "C09",
          name: {
            th: "ยาที่มีผลต่อระบบเรนิน-แองจิโอเทนซิน",
            en: "Agents acting on the renin-angiotensin system",
          },
        },
        {
          code: "C10",
          name: {
            th: "ยาลดไขมันในเลือด",
            en: "Lipid modifying agents",
          },
        },
      ],
    },
    {
      code: "D",
      name: {
        th: "ผิวหนัง",
        en: "Dermatologicals",
      },
      subgroups: [
        {
          code: "D01",
          name: {
            th: "ยาต้านเชื้อราที่ใช้ภายนอก",
            en: "Antifungals for dermatological use",
          },
        },
        {
          code: "D02",
          name: {
            th: "ยาบรรเทาอาการคัน",
            en: "Emollients and protectives",
          },
        },
        {
          code: "D05",
          name: {
            th: "ยารักษาโรคสะเก็ดเงิน",
            en: "Antipsoriatics",
          },
        },
        {
          code: "D06",
          name: {
            th: "ยาต้านจุลชีพสำหรับรักษาโรคผิวหนัง",
            en: "Antibiotics and chemotherapeutics for dermatological use",
          },
        },
        {
          code: "D07",
          name: {
            th: "คอร์ติโคสเตียรอยด์ที่ใช้ภายนอก",
            en: "Corticosteroids, dermatological preparations",
          },
        },
      ],
    },
    {
      code: "J",
      name: {
        th: "ยาต้านการติดเชื้อสำหรับใช้ทั่วระบบ",
        en: "Antiinfectives for systemic use",
      },
      subgroups: [
        {
          code: "J01",
          name: {
            th: "ยาต้านแบคทีเรียสำหรับใช้ทั่วระบบ",
            en: "Antibacterials for systemic use",
          },
        },
        {
          code: "J02",
          name: {
            th: "ยาต้านเชื้อราสำหรับใช้ทั่วระบบ",
            en: "Antimycotics for systemic use",
          },
        },
        {
          code: "J04",
          name: {
            th: "ยารักษาวัณโรค",
            en: "Antimycobacterials",
          },
        },
        {
          code: "J05",
          name: {
            th: "ยาต้านไวรัสสำหรับใช้ทั่วระบบ",
            en: "Antivirals for systemic use",
          },
        },
        {
          code: "J07",
          name: {
            th: "วัคซีน",
            en: "Vaccines",
          },
        },
      ],
    },
    {
      code: "N",
      name: {
        th: "ระบบประสาท",
        en: "Nervous system",
      },
      subgroups: [
        {
          code: "N01",
          name: {
            th: "ยาระงับความรู้สึก",
            en: "Anesthetics",
          },
        },
        {
          code: "N02",
          name: {
            th: "ยาแก้ปวด",
            en: "Analgesics",
          },
        },
        {
          code: "N03",
          name: {
            th: "ยากันชัก",
            en: "Antiepileptics",
          },
        },
        {
          code: "N04",
          name: {
            th: "ยารักษาโรคพาร์กินสัน",
            en: "Anti-parkinson drugs",
          },
        },
        {
          code: "N05",
          name: {
            th: "ยารักษาโรคทางจิตเวช",
            en: "Psycholeptics",
          },
        },
        {
          code: "N06",
          name: {
            th: "ยากระตุ้นประสาท",
            en: "Psychoanaleptics",
          },
        },
      ],
    },
    {
      code: "R",
      name: {
        th: "ระบบทางเดินหายใจ",
        en: "Respiratory system",
      },
      subgroups: [
        {
          code: "R01",
          name: {
            th: "ยารักษาโรคที่จมูก",
            en: "Nasal preparations",
          },
        },
        {
          code: "R03",
          name: {
            th: "ยารักษาโรคทางเดินหายใจอุดกั้น",
            en: "Drugs for obstructive airway diseases",
          },
        },
        {
          code: "R05",
          name: {
            th: "ยาแก้ไอและยาบรรเทาอาการหวัด",
            en: "Cough and cold preparations",
          },
        },
        {
          code: "R06",
          name: {
            th: "ยาต้านฮิสตามีนสำหรับใช้ทั่วระบบ",
            en: "Antihistamines for systemic use",
          },
        },
      ],
    },
  ]
  
  // ยาตามระบบ ATC
  export type ATCMedication = {
    id: string
    name: string
    description: string
    atcCode: string
    subCode: string
    strength: string
    form: string
    price: number
    originalPrice?: number
    discount?: number
    manufacturer: string
    isRx: boolean
    requiresPrescription: boolean
    image: string
    stock: number
    minOrderQuantity: number
    maxOrderQuantity: number
    unitsPerPackage: number
    popularForProfessionals: boolean
    professionalOnly: boolean
  }
  
  export const professionalMedications: ATCMedication[] = [
    {
      id: "J01CA04-001",
      name: "อะม็อกซีซิลลิน 500 มก.",
      description: "ยาปฏิชีวนะกลุ่มเพนิซิลลิน ใช้รักษาการติดเชื้อแบคทีเรียทั่วไป เช่น หูชั้นกลางอักเสบ ไซนัสอักเสบ",
      atcCode: "J",
      subCode: "J01",
      strength: "500 mg",
      form: "แคปซูล",
      price: 280,
      originalPrice: 350,
      discount: 20,
      manufacturer: "Siam Pharmaceutical",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 1000,
      minOrderQuantity: 100,
      maxOrderQuantity: 5000,
      unitsPerPackage: 100,
      popularForProfessionals: true,
      professionalOnly: true,
    },
    {
      id: "J01FA10-001",
      name: "อะซิโธรมัยซิน 250 มก.",
      description: "ยาปฏิชีวนะกลุ่มแมคโครไลด์ ใช้รักษาการติดเชื้อทางเดินหายใจ ผิวหนัง และเนื้อเยื่ออ่อน",
      atcCode: "J",
      subCode: "J01",
      strength: "250 mg",
      form: "แคปซูล",
      price: 450,
      originalPrice: 520,
      discount: 15,
      manufacturer: "GSK Thailand",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 800,
      minOrderQuantity: 50,
      maxOrderQuantity: 2000,
      unitsPerPackage: 50,
      popularForProfessionals: true,
      professionalOnly: true,
    },
    {
      id: "C07AB03-001",
      name: "อะเทโนลอล 50 มก.",
      description: "ยากลุ่มเบต้าบล็อกเกอร์ ใช้รักษาความดันโลหิตสูง โรคหัวใจขาดเลือด และควบคุมอัตราการเต้นของหัวใจ",
      atcCode: "C",
      subCode: "C07",
      strength: "50 mg",
      form: "เม็ด",
      price: 320,
      manufacturer: "Bangkok Lab & Cosmetic",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 1200,
      minOrderQuantity: 100,
      maxOrderQuantity: 3000,
      unitsPerPackage: 100,
      popularForProfessionals: false,
      professionalOnly: true,
    },
    {
      id: "A02BC01-001",
      name: "โอเมพราโซล 20 มก.",
      description: "ยายับยั้งการหลั่งกรด ใช้รักษาโรคกรดไหลย้อน แผลในกระเพาะอาหาร และลำไส้เล็กส่วนต้น",
      atcCode: "A",
      subCode: "A02",
      strength: "20 mg",
      form: "แคปซูล",
      price: 380,
      originalPrice: 450,
      discount: 15,
      manufacturer: "Siam Bheasach",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 1500,
      minOrderQuantity: 100,
      maxOrderQuantity: 5000,
      unitsPerPackage: 100,
      popularForProfessionals: true,
      professionalOnly: true,
    },
    {
      id: "N02BE01-001",
      name: "พาราเซตามอล 500 มก.",
      description: "ยาบรรเทาอาการปวด ลดไข้ ใช้สำหรับบรรเทาอาการปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ และลดไข้",
      atcCode: "N",
      subCode: "N02",
      strength: "500 mg",
      form: "เม็ด",
      price: 120,
      manufacturer: "Government Pharmaceutical Organization",
      isRx: false,
      requiresPrescription: false,
      image: "/placeholder.svg?height=200&width=200",
      stock: 5000,
      minOrderQuantity: 500,
      maxOrderQuantity: 10000,
      unitsPerPackage: 500,
      popularForProfessionals: true,
      professionalOnly: false,
    },
    {
      id: "R06AX13-001",
      name: "โลราทาดีน 10 มก.",
      description: "ยาต้านฮิสตามีน ใช้รักษาอาการแพ้ เช่น น้ำมูกไหล คัดจมูก จาม คัน ลมพิษ",
      atcCode: "R",
      subCode: "R06",
      strength: "10 mg",
      form: "เม็ด",
      price: 180,
      originalPrice: 220,
      discount: 20,
      manufacturer: "Berlin Pharmaceutical",
      isRx: false,
      requiresPrescription: false,
      image: "/placeholder.svg?height=200&width=200",
      stock: 2000,
      minOrderQuantity: 100,
      maxOrderQuantity: 5000,
      unitsPerPackage: 100,
      popularForProfessionals: false,
      professionalOnly: false,
    },
    {
      id: "D07AC01-001",
      name: "เบตาเมทาโซน 0.05%",
      description: "ยาสเตียรอยด์ทาภายนอก ใช้รักษาอาการอักเสบผิวหนัง ผื่นแพ้ ผื่นคัน โรคสะเก็ดเงิน",
      atcCode: "D",
      subCode: "D07",
      strength: "0.05%",
      form: "ครีม",
      price: 150,
      manufacturer: "Greater Pharma",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 800,
      minOrderQuantity: 50,
      maxOrderQuantity: 1000,
      unitsPerPackage: 10,
      popularForProfessionals: false,
      professionalOnly: true,
    },
    {
      id: "J01CR02-001",
      name: "อะม็อกซีซิลลิน/คลาวูลานิค แอซิด 1000/200 มก.",
      description: "ยาปฏิชีวนะผสมระหว่างอะม็อกซีซิลลินกับคลาวูลานิค แอซิด ใช้รักษาการติดเชื้อแบคทีเรียที่ดื้อยา",
      atcCode: "J",
      subCode: "J01",
      strength: "1000/200 mg",
      form: "เม็ด",
      price: 850,
      manufacturer: "Siam Pharmaceutical",
      isRx: true,
      requiresPrescription: true,
      image: "/placeholder.svg?height=200&width=200",
      stock: 600,
      minOrderQuantity: 50,
      maxOrderQuantity: 1000,
      unitsPerPackage: 50,
      popularForProfessionals: true,
      professionalOnly: true,
    },
    {
      id: "B01AC06-001",
      name: "แอสไพริน 81 มก.",
      description: "ยาต้านเกล็ดเลือด ใช้ป้องกันการเกิดลิ่มเลือดในผู้ป่วยโรคหัวใจและหลอดเลือด",
      atcCode: "B",
      subCode: "B01",
      strength: "81 mg",
      form: "เม็ด",
      price: 250,
      originalPrice: 300,
      discount: 16,
      manufacturer: "Biolab",
      isRx: false,
      requiresPrescription: false,
      image: "/placeholder.svg?height=200&width=200",
      stock: 3000,
      minOrderQuantity: 200,
      maxOrderQuantity: 5000,
      unitsPerPackage: 100,
      popularForProfessionals: true,
      professionalOnly: false,
    },
  ]
  