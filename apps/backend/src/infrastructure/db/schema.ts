import { pgTable, text, timestamp, integer, uuid, index } from 'drizzle-orm/pg-core';

export const folders = pgTable('folders', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  path: text('path').notNull(),
  depth: integer('depth').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  parentIdIdx: index('folders_parent_id_idx').on(table.parentId),
  pathIdx: index('folders_path_idx').on(table.path),
}));

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  folderId: uuid('folder_id').references(() => folders.id).notNull(),
  size: integer('size').notNull(),
  extension: text('extension').notNull(),
  mimeType: text('mime_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  folderIdIdx: index('files_folder_id_idx').on(table.folderId),
}));