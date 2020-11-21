import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'
import { sendMessage } from '../socket'

const Notification = Models.notification
const UserNotification = Models.userNotification
const { Op } = require('sequelize')

export const createNotification = async (type, payload, userIds = []) => {
  try {
    const notification = await Notification.create({
      type,
      payload
    })

    for (const userId of userIds) {
      const userNotification = UserNotification.create({
        userId,
        notificationId: notification.id
      })
    }

    sendMessage(type, payload, userIds)
  } catch (e) {
    throw e
  }
}

export const getNotifications = async (req, res) => {
  const userId = req.userData.userId

  try {
    const notifications = await UserNotification.findAll({
      include: [
        {
          model: Notification,
          as: 'notification'
        }
      ],
      where: {
        userId
      },
      attributes: {
        exclude: [
          'id',
          'userId',
          'updatedAt',
          'createdAt',
          'notificationId'
        ]
      }
    })

    return res.status(200).json(notifications)
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}