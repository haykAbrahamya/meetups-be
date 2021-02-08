import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'

const User = Models.user
const Meetup = Models.meetup
const MeetupUser = Models.meetupUser
const { Op } = require('sequelize')

export const createMeetup = async (req, res) => {
  const { userId } = req.userData
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
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const updateMeetup = async (req, res) => {
  const { userId } = req.userData
  const {
    id,
    name,
    description,
    startDate
  } = req.body

  try {
    const meetup = await Meetup.update(
      {
        name,
        startDate,
        description
      },
      {
        where: {
          id,
          creatorId: userId
        }
      }
    )

    return res.status(200).json({ message: 'meetup updated successfully' })
  } catch (e) {
    console.log('e', e)
    return res.status(500).json({ message: 'something went wrong' }) 
  }
}

export const getMeetupsList = async (req, res) => {
  const { userId } = req.userData

// Sequelize.literal(`( SELECT IF ((SELECT COUNT (*) FROM meetupUsers as meetupUser WHERE meetupUser.meetupId = meetup.id AND meetupUser.userId = ${userId}) > 0, true, false ) )`),
//           'joined'

  try {
    const meetups = await Meetup.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { 
            exclude: ['password'],
          }
        },
      ],
      attributes: [
        [
          Sequelize.literal(`(
              SELECT EXISTS(
                SELECT *
                FROM meetupUsers as meetupUser
                WHERE meetupUser.userId = ${userId}
                AND meetupUser.meetupId = meetup.id
              )
            )`),
          'joined'
        ],
        [
          Sequelize.literal(`(
              SELECT COUNT(*)
              FROM meetupUsers as meetupUser
              WHERE
                meetupUser.meetupId = meetup.id
            )`),
          'participantsCount'
        ],
        'id',
        'name',
        'startDate',
        'description'
      ]
    })

    return res.status(200).json(meetups)
  } catch (e) {
    console.log('e', e)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const getMeetupById = async (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'input meetup id' })
  }

  try {
    const meetup = await Meetup.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        },
      ]
    })

    return res.status(200).json(meetup)
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const joinMeetup = async (req, res) => {
  const { userId } = req.userData
  const {
    meetupId,
    isJoin
  } = req.body

  if (!meetupId) {
    return res.status(400).json({ message: 'input meetup id' })
  }

  try {
    if (isJoin) {
      const meetup = await Meetup.findOne({
        where: {
          id: meetupId
        }
      })

      if (!meetup) {
        return res.status(404).json({ message: 'meetup not found' })
      }

      const meetupUser = MeetupUser.create({
        meetupId,
        userId
      })
    } else {
        await MeetupUser.destroy({
          where: {
            meetupId,
            userId
          }
        })
    }

    return res.status(201).json({ message: 'succes join to meetup' })
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const deleteMeetup = async (req, res) => {
  const { userId } = req.userData
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'input meetup id' })
  }

  try {
    await Meetup.destroy({
      where: {
        id,
        creatorId: userId
      }
    })

    return res.status(200).json({ message: 'success delete meetup' })
  } catch (e) {
    console.log('e', e)
    return res.status(500).json({ message: 'something went wrong' })
  }
}