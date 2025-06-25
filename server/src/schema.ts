
import { z } from 'zod';

// Task status enum
export const taskStatusSchema = z.enum(['todo', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

// Task schema
export const taskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  status: taskStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Task = z.infer<typeof taskSchema>;

// Time tracking session schema
export const timeSessionSchema = z.object({
  id: z.number(),
  task_id: z.number().nullable(), // Can track time without a specific task
  task_name: z.string(), // Always store the task name for display
  description: z.string().nullable(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date().nullable(),
  total_duration: z.number().nullable(), // Total seconds worked (excluding pauses)
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type TimeSession = z.infer<typeof timeSessionSchema>;

// Time pause schema (for tracking pause periods within a session)
export const timePauseSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  pause_start: z.coerce.date(),
  pause_end: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type TimePause = z.infer<typeof timePauseSchema>;

// Input schemas for creating/updating tasks
export const createTaskInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: taskStatusSchema.optional()
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: taskStatusSchema.optional()
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

// Input schemas for time tracking
export const startTrackingInputSchema = z.object({
  task_id: z.number().nullable().optional(),
  task_name: z.string().min(1),
  description: z.string().nullable().optional()
});

export type StartTrackingInput = z.infer<typeof startTrackingInputSchema>;

export const stopTrackingInputSchema = z.object({
  session_id: z.number()
});

export type StopTrackingInput = z.infer<typeof stopTrackingInputSchema>;

export const pauseTrackingInputSchema = z.object({
  session_id: z.number()
});

export type PauseTrackingInput = z.infer<typeof pauseTrackingInputSchema>;

export const resumeTrackingInputSchema = z.object({
  session_id: z.number()
});

export type ResumeTrackingInput = z.infer<typeof resumeTrackingInputSchema>;

// Query schemas
export const getTimelineInputSchema = z.object({
  date: z.string().optional(), // ISO date string (YYYY-MM-DD)
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export type GetTimelineInput = z.infer<typeof getTimelineInputSchema>;

// Quick command schema
export const quickCommandInputSchema = z.object({
  command: z.string().min(1)
});

export type QuickCommandInput = z.infer<typeof quickCommandInputSchema>;

// Response schemas
export const activeSessionSchema = z.object({
  session: timeSessionSchema,
  current_pause: timePauseSchema.nullable()
});

export type ActiveSession = z.infer<typeof activeSessionSchema>;

export const timelineEntrySchema = z.object({
  session: timeSessionSchema,
  pauses: z.array(timePauseSchema)
});

export type TimelineEntry = z.infer<typeof timelineEntrySchema>;

export const dailyTimelineSchema = z.object({
  date: z.string(),
  entries: z.array(timelineEntrySchema)
});

export type DailyTimeline = z.infer<typeof dailyTimelineSchema>;
