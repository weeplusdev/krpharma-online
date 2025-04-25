import { defineType, defineField } from "sanity";

export default defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "emailVerified",
      title: "Email Verified",
      type: "datetime",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
    }),
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Staff", value: "staff" },
          { title: "Customer", value: "customer" },
        ],
      },
      initialValue: "customer",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Pending", value: "pending" },
          { title: "Suspended", value: "suspended" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "lineProfile",
      title: "LINE Profile",
      type: "object",
      fields: [
        defineField({ name: "userId", title: "User ID", type: "string" }),
        defineField({ name: "displayName", title: "Display Name", type: "string" }),
        defineField({ name: "pictureUrl", title: "Picture URL", type: "url" }),
      ],
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
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'image'
    }
  }
});
