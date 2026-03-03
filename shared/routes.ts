import { z } from 'zod';
import { dayWorkoutSchema } from './schema';

export const api = {
  workouts: {
    list: {
      method: 'GET' as const,
      path: '/api/workouts' as const,
      responses: {
        200: z.array(dayWorkoutSchema),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type DayWorkoutResponse = z.infer<typeof api.workouts.list.responses[200]>[number];
