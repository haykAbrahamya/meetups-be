import express from 'express'
import {
  joinMeetup,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  getMeetupsList,
  getMeetupById
} from '../controllers/Meetup'

const router = express.Router()
const Authenticate = require('../middleware/authenticate')

router.post('/', Authenticate, createMeetup)
router.put('/', Authenticate, updateMeetup)
router.delete('/', Authenticate, deleteMeetup)
router.post('/toggle-join', Authenticate, joinMeetup)
router.get('/search', Authenticate, getMeetupsList)
router.get('/', Authenticate, getMeetupById)

export default router
