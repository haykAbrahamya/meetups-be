import express from 'express'
import {
  createMeetup,
  getMeetupsList
} from '../controllers/Meetup'

const router = express.Router()
const Authenticate = require('../middleware/authenticate')

router.post('/', Authenticate, createMeetup)
router.get('/', Authenticate, getMeetupsList)

export default router
