import dotenv from 'dotenv'
import app from './app'
import http from 'http'

dotenv.config()

const PORT = process.env.PORT

const server = http.createServer(app)

server.listen(PORT)