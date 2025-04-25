import { defineType, defineField } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          name: "orderItem",
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "price",
              title: "Price at Order Time",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
      ],
    }),
    defineField({
      name: "paymentInfo",
      title: "Payment Information",
      type: "object",
      fields: [
        defineField({ name: "method", title: "Method", type: "string" }),
        defineField({ name: "transactionId", title: "Transaction ID", type: "string" }),
        defineField({ name: "status", title: "Status", type: "string" }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
