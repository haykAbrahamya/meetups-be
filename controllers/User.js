import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'
import config from '../config'

const User = Models.user
const Following = Models.following
const { Op } = require('sequelize')

export const createUser = async (req, res) => {
  const {
    fullname,
    username,
    password
  } = req.body

  if (!fullname) {
    return res.status(400).json({ message: 'input fullname' })
  }

  if (!username) {
    return res.status(400).json({ message: 'input username' })
  }

  if (!password) {
    return res.status(400).json({ message: 'input password' })
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: 'something went wrong'
      })
    }

    try {
      const user = await User.create({
        fullname,
        username,
        password: hash
      })

      let response = user.get()
      delete response.password

      return res.status(201).json(response)
    } catch (ex) {
      if (ex instanceof Sequelize.UniqueConstraintError) {
        return res.status(409).json({ message: 'Տվյալ մուտքանունն արդեն զբաղված է' })
      }

      return res.status(500).json({ message: 'something went wrong' })
    }
  })
}

export const updateUser = async (req, res) => {
  const userId = req.params.userId
  const {
    fullname,
    username,
    password
  } = req.body

  let updateData = {}

  if (!fullname) {
    return res.status(400).json({ message: 'input fullname' })
  }
  updateData.fullname = fullname

  if (!username) {
    return res.status(400).json({ message: 'input username' })
  }
  updateData.username = username

  if (!password) {
    return res.status(400).json({ message: 'input password' })
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: 'something went wrong'
      })
    }

    updateData.password = hash
  })

  try {
    await User.update(
      updateData,
      {
        where: { id: userID }
      }
    )

    return res.status(200).json({ message: 'user updated successfully' })
  } catch (ex) {
    if (ex instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ message: 'user already exists' })
    }

    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const deleteUser = async (req, res) => {
  const userID = req.params.userId

  try {
    await User.destroy({
      where: {
        id: userId
      }
    })

    return res.status(200).json({ message: 'user deleted successfully' })
  } catch (ex) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const getUsersList = async (req, res) => {
  const pageSize = req.query.pageSize || 10
  const pageNo = req.query.pageNo || 0
  const sortField = req.query.sortField || 'id'
  const sortOrder = req.query.sortOrder || 'DESC'
  const {
    name
  } = req.query

  try {
    let whereStatement = {}
    if (name) {
      whereStatement[Op.or] = [
        {
          fullname: {
            [Op.like]: '%' + name + '%'
          }
        },
        {
          username: {
            [Op.like]: '%' + name + '%'
          }
        }
      ]
    }

    const users = await User.findAll({
      ...paginate({ pageNo, pageSize }),
      order: [[ sortField, sortOrder ]],
      where: whereStatement,
      attributes: {
        exclude: ['password'],
        include: [
          [
            Sequelize.literal(`(
                SELECT COUNT(*)
                FROM followings as following
                WHERE
                  following.userId = user.id
              )`),
            'followersCount'
          ]
        ]
      },
      order: [[ Sequelize.literal(sortField), 'DESC' ]]
    })

    return res.status(200).json(users)
  } catch (ex) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const getUserById = async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'input userId' })
  }

  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Following,
          as: 'followers',
          include: {
            model: User,
            as: 'follower',
            attributes: { exclude: ['password'] }
          },
          attributes: ['id']
        },
        {
          model: Following,
          as: 'following',
          include: {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          },
          attributes: ['id']
        }
      ],
      attributes: {
        exclude: ['password']
      }
    })

    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const userLogin = async (req, res) => {
  const {
    username,
    password
  } = req.body

  if (!username) {
    return res.status(400).json({ message: 'input username' })
  }

  if (!password) {
    return res.status(400).json({ message: 'input password' })
  }

  try {
    const user = await User.findOne({
      where: {
        username
      },
      raw: true
    })

    if (!user) {
      return res.status(403).json({ message: 'Սխալ մուտքանուն կամ գաղտնաբառ' })
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err){
        return res.status(500).json({ message: 'something went wrong' })
      }  
      if (result) {
        let userData = user
        const token = jwt.sign(
          {
            userId: user.id,
            fullname: user.fullname
          },
          config.JWT_KEY,
          {
            expiresIn: '7d'
          }
        );

        delete userData.password

        return res.status(200).json({ token, userData })
      } else {
        return res.status(403).json({ message: 'Սխալ մուտքանուն կամ գաղտնաբառ' })
      }
    })
  } catch (ex) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}