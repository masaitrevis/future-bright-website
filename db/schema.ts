import { pgTable, serial, text, integer, decimal, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }).notNull().default('service'),
  cover_image: text('cover_image'),
  file_path: text('file_path'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow(),
});
