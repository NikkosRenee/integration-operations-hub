import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact: text("contact").notNull().default(""),
  email: text("email").notNull().default(""),
  services: text("services").notNull().default(""),
  website: text("website").notNull().default(""),
  phone: text("phone").notNull().default(""),
  notes: text("notes").notNull().default(""),
  lastContact: text("last_contact"),
  status: text("status").notNull().default("Active"),
  createdAt: text("created_at").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Active"),
  health: text("health").notNull().default("Green"),
  progress: integer("progress").notNull().default(0),
  dueDate: text("due_date"),
  nextAction: text("next_action").notNull().default(""),
  description: text("description").notNull().default(""),
  priority: text("priority").notNull().default("Medium"),
  createdAt: text("created_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id"),
  clientId: integer("client_id"),
  title: text("title").notNull(),
  status: text("status").notNull().default("Next"),
  priority: text("priority").notNull().default("Medium"),
  type: text("type").notNull().default("Standard"),
  dueDate: text("due_date"),
  notes: text("notes").notNull().default(""),
  estimatedMinutes: integer("estimated_minutes").notNull().default(30),
  createdAt: text("created_at").notNull(),
  completedAt: text("completed_at"),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: integer("entity_id"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
