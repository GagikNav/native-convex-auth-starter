import { httpRouter } from 'convex/server'
import { authComponent, createAuth } from './auth'

const http = httpRouter()

// Register BetterAuth routes with CORS enabled for web compatibility
authComponent.registerRoutes(http, createAuth, { cors: true })

export default http
