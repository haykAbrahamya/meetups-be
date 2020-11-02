import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import { paginate } from './functions'
import Models, { Sequelize } from '../models'
import config from '../config'

const User = Models.user

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
        return res.status(409).json({ message: 'user already exists' })
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
  let pageSize = req.query.pageSize || 10
  let pageNo = req.query.pageNo || 0

  const sortField = req.query.sortField || 'id'
  const sortOrder = req.query.sortOrder || 'DESC'

  try {
    const users = await User.findAndCountAll({
      ...paginate({ pageNo, pageSize }),
      order: [[ sortField, sortOrder ]],
      attributes: { exclude: ['password'] }
    })

    return res.status(200).json(users)
  } catch (ex) {
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
      return res.status(403).json({ message: 'Invalid username or password' })
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
        return res.status(403).json({ message: 'Invalid username or password' })
      }
    })
  } catch (ex) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}