"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

// Mock data for ATC categories
const atcCategories = [
  { code: "A", name: "Alimentary tract and metabolism" },
  { code: "B", name: "Blood and blood forming organs" },
  { code: "C", name: "Cardiovascular system" },
  { code: "D", name: "Dermatologicals" },
  { code: "G", name: "Genito-urinary system and sex hormones" },
  { code: "H", name: "Systemic hormonal preparations, excluding sex hormones and insulins" },
  { code: "J", name: "Antiinfectives for systemic use" },
  { code: "L", name: "Antineoplastic and immunomodulating agents" },
  { code: "M", name: "Musculo-skeletal system" },
  { code: "N", name: "Nervous system" },
  { code: "P", name: "Antiparasitic products, insecticides and repellents" },
  { code: "R", name: "Respiratory system" },
  { code: "S", name: "Sensory organs" },
  { code: "V", name: "Various" },
]

// Mock data for medicines
const medicines = [
  { id: 1, name: "Paracetamol", atcCode: "N02BE01", image: "/placeholder.svg", strength: "500 mg", form: "Tablet" },
  { id: 2, name: "Amoxicillin", atcCode: "J01CA04", image: "/placeholder.svg", strength: "250 mg", form: "Capsule" },
  { id: 3, name: "Omeprazole", atcCode: "A02BC01", image: "/placeholder.svg", strength: "20 mg", form: "Tablet" },
  // Add more medicines as needed
]

export default function MedicinesCategory() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = medicines.filter(
    (medicine) =>
      (selectedCategory === "" || medicine.atcCode.startsWith(selectedCategory)) &&
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">หมวดหมู่ยา</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ATC Categories Sidebar */}
        <div className="w-full md:w-1/4">
          <h2 className="text-xl font-semibold mb-4">หมวดหมู่ ATC</h2>
          <ul className="space-y-2">
            {atcCategories.map((category) => (
              <li key={category.code}>
                <button
                  className={`w-full text-left p-2 rounded ${selectedCategory === category.code ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setSelectedCategory(category.code)}
                >
                  {category.code}: {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search and Filter */}
          <div className="mb-6 flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ค้นหายา..."
                className="w-full p-2 pl-10 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <select className="ml-4 p-2 border rounded">
              <option>เรียงตามชื่อ</option>
              <option>เรียงตามรหัส ATC</option>
            </select>
          </div>

          {/* Medicine Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <Link
                href={`/medicines/${medicine.id}`}
                key={medicine.id}
                className="border rounded-lg p-4 hover:shadow-lg transition duration-300"
              >
                <Image
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mb-1">ATC: {medicine.atcCode}</p>
                <p className="text-sm text-gray-600 mb-1">ความแรง: {medicine.strength}</p>
                <p className="text-sm text-gray-600">รูปแบบ: {medicine.form}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

