import { z } from 'zod'

export const boardNameSchema = z
  .string()
  .min(2, 'name must be at least 2 characters.')
  .max(255, 'name must be at most 120 characters.')
  .regex(
    /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
    "Invalid board name, name can't contain spaces"
  )

export const listNameSchema = z
    .string()
    .min(2, 'name must be at least 2 characters')
    .max(255, 'name must be at most 120 characters.')
