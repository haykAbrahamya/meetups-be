'use strict';
module.exports = (sequelize, DataTypes) => {
  const Following = sequelize.define(
    'following',
    {
      userId: {
        type: DataTypes.INTEGER
      },
      followerId: {
        type: DataTypes.INTEGER
      }
    }
  )

  Following.associate = (models) => {
    Following.hasOne(models.user, {
      sourceKey: 'userId',
      foreignKey: 'id',
      as: 'user'
    }),
    Following.hasOne(models.user, {
      sourceKey: 'followerId',
      foreignKey: 'id',
      as: 'follower'
    })
  }

  return Following
}