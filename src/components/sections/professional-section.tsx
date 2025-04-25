import Link from "next/link"
import Image from "next/image"
import { FileText, User, ChevronRight, BarChart, Heart, BookIcon as BookMedical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { professionalMedications } from "@/lib/atc-data"
import { Badge } from "@/components/ui/badge"

export function ProfessionalSection() {
  // แสดงเฉพาะยาที่เป็นที่นิยมสำหรับบุคลากรทางการแพทย์
  const popularMedications = professionalMedications.filter((med) => med.popularForProfessionals).slice(0, 4)

  return (
    <section className="py-10 border-t border-b border-muted/50 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">สำหรับบุคลากรทางการแพทย์</h2>
              </div>

              <p className="text-muted-foreground">
                ระบบสั่งซื้อยาและเวชภัณฑ์สำหรับบุคลากรทางการแพทย์ ได้แก่ แพทย์ พยาบาล และเภสัชกร เพื่อใช้ในสถานพยาบาลหรือคลินิก
                โดยได้รับราคาพิเศษและบริการเฉพาะสำหรับบุคลากรทางการแพทย์
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center text-center">
                  <BarChart className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm">
                    ส่วนลดเพิ่มเติม
                    <br />
                    สูงสุด 25%
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center text-center">
                  <Heart className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm">
                    บริการจัดส่งฟรี
                    <br />
                    ทั่วประเทศ
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center text-center">
                  <FileText className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm">
                    เอกสารกำกับยา
                    <br />
                    ครบถ้วน
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center text-center">
                  <BookMedical className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm">
                    ปรึกษาเภสัชกร
                    <br />
                    ฟรี 24 ชม.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/orders/new">สั่งซื้อยาสำหรับบุคลากรทางการแพทย์</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/products_by_order">ดูรายการยาทั้งหมด</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">ยาที่นิยมสำหรับสถานพยาบาล</h3>
                <Link href="/products_by_order" className="text-sm text-primary flex items-center hover:underline">
                  ดูทั้งหมด
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularMedications.map((medication) => (
                  <Card key={medication.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-24 h-24 sm:w-36 sm:h-36 bg-muted/30 flex-shrink-0">
                          <Image
                            src={medication.image || "/placeholder.svg"}
                            alt={medication.name}
                            fill
                            className="object-contain p-2"
                          />
                          {medication.discount && (
                            <Badge className="absolute top-2 left-2 z-10 bg-red-500">-{medication.discount}%</Badge>
                          )}
                          {medication.professionalOnly && (
                            <Badge className="absolute bottom-2 left-2 z-10 bg-primary">เฉพาะบุคลากร</Badge>
                          )}
                        </div>
                        <div className="p-3 flex-grow">
                          <Link href={`/products_by_order/${medication.id}`}>
                            <h4 className="font-medium text-sm leading-tight hover:underline mb-1">
                              {medication.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{medication.description}</p>
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">ขนาด:</span> {medication.strength}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">หน่วย:</span> {medication.unitsPerPackage} {medication.form}
                              /กล่อง
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-primary">{medication.price.toFixed(2)} บาท</span>
                              {medication.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {medication.originalPrice.toFixed(2)} บาท
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
