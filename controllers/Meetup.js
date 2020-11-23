import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'

const User = Models.user
const Meetup = Models.meetup
const { Op } = require('sequelize')

export const createMeetup = async (req, res) => {
  const userId = req.userData.userId
  const {
    name,
    description,
    startDate
  } = req.body

  try {
    const meetup = await Meetup.create({
      name,
      description,
      startDate,
      creatorId: userId
    })

    return res.status(201).json(meetup)
  } catch (e) {
    console.log('e', e)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const getMeetupsList = async (req, res) => {
  try {
    const meetups = await Meetup.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        },
      ],
    })

    return res.status(200).json(meetups)
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}