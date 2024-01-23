import { Hono } from 'hono'
import { app as usersRoutes } from './users'
import { app as boardsRoutes } from './boards'

export const app = new Hono()

app.route('/users', usersRoutes)
app.route('/boards', boardsRoutes)