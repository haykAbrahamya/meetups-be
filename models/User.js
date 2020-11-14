'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      fullname: {
        type: DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      }
    }
  )
  User.associate = (models) => {
    User.hasMany(models.following, {
      sourceKey: 'id',
      foreignKey: 'userId'   ,
      as: 'followers'
    }),
    User.hasMany(models.following, {
      sourceKey: 'id',
      foreignKey: 'followerId'   ,
      as: 'following'
    })
  }

  return User
}