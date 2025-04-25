import { defineType, defineField } from "sanity";

export default defineType({
  name: "account",
  title: "Account",
  type: "document",
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
    }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
    }),
    defineField({
      name: "providerAccountId",
      title: "Provider Account ID",
      type: "string",
    }),
    defineField({
      name: "refresh_token",
      title: "Refresh Token",
      type: "string",
    }),
    defineField({
      name: "access_token",
      title: "Access Token",
      type: "string",
    }),
    defineField({
      name: "expires_at",
      title: "Expires At",
      type: "number",
    }),
    defineField({
      name: "token_type",
      title: "Token Type",
      type: "string",
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "string",
    }),
    defineField({
      name: "id_token",
      title: "ID Token",
      type: "string",
    }),
    defineField({
      name: "session_state",
      title: "Session State",
      type: "string",
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
