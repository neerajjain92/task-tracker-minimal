
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  startTrackingInputSchema,
  stopTrackingInputSchema,
  pauseTrackingInputSchema,
  resumeTrackingInputSchema,
  getTimelineInputSchema,
  quickCommandInputSchema
} from './schema';

// Import handlers
import { createTask } from './handlers/create_task';
import { getTasks } from './handlers/get_tasks';
import { updateTask } from './handlers/update_task';
import { deleteTask } from './handlers/delete_task';
import { startTracking } from './handlers/start_tracking';
import { stopTracking } from './handlers/stop_tracking';
import { pauseTracking } from './handlers/pause_tracking';
import { resumeTracking } from './handlers/resume_tracking';
import { getActiveSession } from './handlers/get_active_session';
import { getTimeline } from './handlers/get_timeline';
import { processQuickCommand } from './handlers/process_quick_command';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Task management
  createTask: publicProcedure
    .input(createTaskInputSchema)
    .mutation(({ input }) => createTask(input)),

  getTasks: publicProcedure
    .query(() => getTasks()),

  updateTask: publicProcedure
    .input(updateTaskInputSchema)
    .mutation(({ input }) => updateTask(input)),

  deleteTask: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTask(input)),

  // Time tracking
  startTracking: publicProcedure
    .input(startTrackingInputSchema)
    .mutation(({ input }) => startTracking(input)),

  stopTracking: publicProcedure
    .input(stopTrackingInputSchema)
    .mutation(({ input }) => stopTracking(input)),

  pauseTracking: publicProcedure
    .input(pauseTrackingInputSchema)
    .mutation(({ input }) => pauseTracking(input)),

  resumeTracking: publicProcedure
    .input(resumeTrackingInputSchema)
    .mutation(({ input }) => resumeTracking(input)),

  getActiveSession: publicProcedure
    .query(() => getActiveSession()),

  // Timeline and reporting
  getTimeline: publicProcedure
    .input(getTimelineInputSchema)
    .query(({ input }) => getTimeline(input)),

  // Quick commands
  processQuickCommand: publicProcedure
    .input(quickCommandInputSchema)
    .mutation(({ input }) => processQuickCommand(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Personal Productivity Tracker TRPC server listening at port: ${port}`);
}

start();
