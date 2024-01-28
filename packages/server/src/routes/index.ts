import { Hono } from 'hono'
import { user as usersRoutes } from './users'

export const app = new Hono()

app.route('/users', usersRoutes)
