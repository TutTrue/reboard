import { Hono } from 'hono'
import { user as usersRoutes } from './users'
import { board } from './boards'

export const app = new Hono()

app.route('/users', usersRoutes)
app.route('/boards', board)
