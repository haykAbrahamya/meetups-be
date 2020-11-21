import dotenv from 'dotenv'
import http from 'http'


import app from './app'
import { initSocket } from './socket'

dotenv.config()

const PORT = process.env.PORT

const server = http.createServer(app)
initSocket(server)

server.listen(PORT)