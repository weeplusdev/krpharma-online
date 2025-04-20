import {
  pgTable,
  serial,
  text,
  decimal,
  varchar,
  timestamp,
  uniqueIndex,
  integer,
  pgEnum,
  bigint,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';

// สร้าง Enum สำหรับบทบาทผู้ใช้
export const userRoleEnum = pgEnum('user_role', [
  'admin',       // ผู้ดูแลระบบ
  'pharmacist',  // เภสัชกร
  'medic',       // บุคลากรทางการแพทย์
  'stock',       // ผู้คุมสต็อกสินค้า
  'seller',      // ผู้ขาย
  'customer',    // ลูกค้าทั่วไป
  'user',        // ผู้ใช้ทั่วไป
  'doctor'       // แพทย์
]);

export type UserRole = 'admin' | 'pharmacist' | 'medic' | 'stock' | 'seller' | 'customer' | 'user' | 'doctor';

// สร้างตาราง users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  image: text('image'),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  lineId: text('line_id'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (users) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(users.email),
    lineIdIdx: uniqueIndex('line_id_idx').on(users.lineId),
  };
});

// สร้างตาราง accounts สำหรับ OAuth providers (เช่น Line)
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // oauth, email, etc.
  provider: text('provider').notNull(), // line, credentials, etc.
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: bigint('expires_at', { mode: 'bigint' }),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (accounts) => {
  return {
    providerProviderAccountIdIdx: uniqueIndex('provider_provider_account_id_idx')
      .on(accounts.provider, accounts.providerAccountId),
    userIdIdx: uniqueIndex('user_id_provider_idx')
      .on(accounts.userId, accounts.provider),
  };
});

// สร้างตาราง sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

// สร้างตาราง verification_tokens
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, (vt) => {
  return {
    compoundKey: uniqueIndex('verification_tokens_identifier_token_idx')
      .on(vt.identifier, vt.token),
    primaryKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  };
});

// สร้างตาราง permissions
export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// สร้างตาราง role_permissions สำหรับความสัมพันธ์ระหว่างบทบาทและสิทธิ์
export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  role: userRoleEnum('role').notNull(),
  permissionId: integer('permission_id').notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (rp) => {
  return {
    rolePermissionIdx: uniqueIndex('role_permission_idx')
      .on(rp.role, rp.permissionId),
  };
});


// สินค้า
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sanityId: varchar('sanity_id', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// สถานะออเดอร์
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'processing', 'completed', 'cancelled'
]);

// ออเดอร์
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  status: orderStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// รายการสินค้าในออเดอร์
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  pricePerUnit: decimal('price_per_unit', { precision: 10, scale: 2 }).notNull()
});

// ประเภทข้อมูลที่จะใช้ในแอปพลิเคชัน
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>;
export type Permission = InferSelectModel<typeof permissions>;
export type NewPermission = InferInsertModel<typeof permissions>;
export type RolePermission = InferSelectModel<typeof rolePermissions>;
export type NewRolePermission = InferInsertModel<typeof rolePermissions>;

// Types สำหรับใช้งาน
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;
