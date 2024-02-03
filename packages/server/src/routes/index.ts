import { Hono } from 'hono'
import { app as usersRoutes } from './users'
import { app as boardRouter } from './boards'
import { app as invitationsRouter } from './invitations'

export const app = new Hono()

app.route('/users', usersRoutes)
app.route('/boards', boardRouter)
app.route('/invitations', invitationsRouter)
