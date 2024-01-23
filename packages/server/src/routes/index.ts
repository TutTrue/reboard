import { Hono } from 'hono'
import { app as usersRoutes } from './users'

export const app = new Hono()

app.route('/users', usersRoutes)