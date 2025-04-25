import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { atcCategories } from "@/lib/atc-data"

export function ATCCategories() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">หมวดหมู่ยาตามระบบ ATC</h2>
        <Link href="/products_by_order" className="text-sm text-primary flex items-center hover:underline">
          ดูทั้งหมด
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {atcCategories.slice(0, 5).map((category) => (
          <AccordionItem key={category.code} value={category.code}>
            <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-md">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {category.code}
                </div>
                <span>{category.name.th}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-14">
              <ul className="space-y-1 py-2">
                {category.subgroups.slice(0, 3).map((subgroup) => (
                  <li key={subgroup.code}>
                    <Link
                      href={`/products_by_order?category=${category.code}&subgroup=${subgroup.code}`}
                      className="text-sm hover:text-primary hover:underline block py-1"
                    >
                      {subgroup.name.th}
                    </Link>
                  </li>
                ))}
                {category.subgroups.length > 3 && (
                  <li>
                    <Link
                      href={`/products_by_order?category=${category.code}`}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline block py-1"
                    >
                      + ดูทั้งหมด {category.subgroups.length} หมวดหมู่ย่อย
                    </Link>
                  </li>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center mt-4">
        <Link href="/products_by_order" className="text-sm text-primary hover:underline inline-flex items-center">
          ดูหมวดหมู่ทั้งหมด
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}
