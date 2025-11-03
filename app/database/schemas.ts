import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";



export const items = pgTable("items", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: text("name").notNull(),
    amountInStock: integer("amount_in_stock").notNull().default(0),
    image: text("image").notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
})

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    itemId: uuid("item_id").references(() => items.id).notNull(),
    reason: text("reason").notNull(),
    type: text("type").notNull(),
    quantity: integer("quantity").notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
})


export const transactionRelations = relations(transactions, ({ one }) => ({
    item: one(items, {
        fields: [transactions.itemId],
        references: [items.id],
    }),
}));

export const itemsRelations = relations(items, ({ many }) => ({
    transactions: many(transactions),
}));