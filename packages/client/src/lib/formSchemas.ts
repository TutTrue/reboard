import { z } from 'zod'

export const listFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(255, { message: 'name must be at most 255 characters.' }),
})

export const boardFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(255, { message: 'name must be at most 120 characters.' })
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
      message: "Invalid board name, name can't contain spaces",
    }),
})