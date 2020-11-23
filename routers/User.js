import express from 'express'
import {
  createUser,
  updateUser,
  deleteUser,
  getUsersList,
  getUserById,
  userLogin
} from '../controllers/User'

const router = express.Router()

router.post('/', createUser)
router.post('/login', userLogin)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.get('/search', getUsersList)
router.get('/', getUserById)

export default router