import { defineType, defineField } from "sanity";

export default defineType({
  name: "verificationToken",
  title: "Verification Token",
  type: "document",
  fields: [
    defineField({
      name: "identifier",
      title: "Identifier",
      type: "string",
    }),
    defineField({
      name: "token",
      title: "Token",
      type: "string",
    }),
    defineField({
      name: "expires",
      title: "Expires",
      type: "datetime",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],
}); 