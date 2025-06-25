
import { serial, text, pgTable, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tasks table
export const tasksTable = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tags: json('tags').$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('todo'), // 'todo', 'in_progress', 'completed'
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Time tracking sessions table
export const timeSessionsTable = pgTable('time_sessions', {
  id: serial('id').primaryKey(),
  task_id: integer('task_id'), // Nullable - can track time without a specific task
  task_name: text('task_name').notNull(), // Always store task name for display
  description: text('description'),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time'),
  total_duration: integer('total_duration'), // Total seconds worked (excluding pauses)
  is_active: boolean('is_active').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Time pauses table (for tracking pause periods within a session)
export const timePausesTable = pgTable('time_pauses', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull(),
  pause_start: timestamp('pause_start').notNull(),
  pause_end: timestamp('pause_end'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const tasksRelations = relations(tasksTable, ({ many }) => ({
  timeSessions: many(timeSessionsTable),
}));

export const timeSessionsRelations = relations(timeSessionsTable, ({ one, many }) => ({
  task: one(tasksTable, {
    fields: [timeSessionsTable.task_id],
    references: [tasksTable.id],
  }),
  pauses: many(timePausesTable),
}));

export const timePausesRelations = relations(timePausesTable, ({ one }) => ({
  session: one(timeSessionsTable, {
    fields: [timePausesTable.session_id],
    references: [timeSessionsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Task = typeof tasksTable.$inferSelect;
export type NewTask = typeof tasksTable.$inferInsert;
export type TimeSession = typeof timeSessionsTable.$inferSelect;
export type NewTimeSession = typeof timeSessionsTable.$inferInsert;
export type TimePause = typeof timePausesTable.$inferSelect;
export type NewTimePause = typeof timePausesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  tasks: tasksTable,
  timeSessions: timeSessionsTable,
  timePauses: timePausesTable,
};
