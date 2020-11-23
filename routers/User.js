import express from 'express'
import {
  createUser,
  updateUser,
  deleteUser,
  getUsersList,
  getUserByIdOrUsername,
  userLogin
} from '../controllers/User'

const router = express.Router()

router.post('/', createUser)
router.post('/login', userLogin)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.get('/search', getUsersList)
router.get('/', getUserByIdOrUsername)

export default router
