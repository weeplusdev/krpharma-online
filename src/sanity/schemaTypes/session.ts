import { defineType, defineField } from "sanity";

export default defineType({
  name: "session",
  title: "Session",
  type: "document",
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
    }),
    defineField({
      name: "sessionToken",
      title: "Session Token",
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
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
});

