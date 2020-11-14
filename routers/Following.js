import express from 'express'
import {
  followUser,
  unfollowUser,
  getFollowing
} from '../controllers/Following'

const router = express.Router()
const Authenticate = require('../middleware/authenticate')

router.post('/', Authenticate, followUser)
router.delete('/', Authenticate, unfollowUser)
router.get('/', Authenticate, getFollowing)

export default router
// 
// 1 hayk
// 2 harut
// 3 edgar
// 4 rafo
// 5 armen
// 
// 
// 
// followerId userId
//     1        3
//     1        5
//     5        1
