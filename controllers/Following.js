import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'
import config from '../config'
import { sendMessage } from '../socket'

const User = Models.user
const Following = Models.following
const { Op } = require('sequelize')

export const followUser = async (req, res) => {
  const myId = req.userData.userId
  const {
    userId
  } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'input userId' })
  }

  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      attributes: {
        exclude: ['password']
      }
    })

    const myUser = await User.findOne({
      where: {
        id: myId
      },
      attributes: {
        exclude: ['password']
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'user was not found' })
    }

    const following = await Following.create({
      followerId: myId,
      userId
    })

    let response = {
      id: following.id,
      user
    }

    sendMessage('follow_user', { type: 1, user: myUser, followingId: following.id }, [userId])

    return res.status(201).json(response)
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const unfollowUser = async (req, res) => {
  const myId = req.userData.userId
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'input userId' })
  }

  try {
    const following = await Following.destroy({
      where: {
        followerId: myId,
        userId
      }
    })

    if (following === 0) {
      return res.status(404).json({ message: 'following was not found' })
    }

    sendMessage('unfollow_user', { type: 2, user:{ userId: myId, fullname: req.userData.fullname } }, [userId])
    return res.status(201).json({ message: 'success unfollow' })
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const getFollowing = async (req, res) => {
  const myId = req.userData.userId

  if (!myId) {
    return res.status(403).json({ message: 'Forbidden!' })
  }

  try {
    const followers = await Following.findAll({
      where: {
        userId: myId
      },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: { exclude: ['password'] }
        },
      ],
      attributes: ['id']
    })

    const following = await Following.findAll({
      where: {
        followerId: myId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
      ],
      attributes: ['id']
    })

    return res.status(200).json({ followers, following })
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}