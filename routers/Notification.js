import express from 'express'
import {
  getNotifications
} from '../controllers/Notification'

const router = express.Router()
const Authenticate = require('../middleware/authenticate')

router.get('/', Authenticate, getNotifications)

export default router
