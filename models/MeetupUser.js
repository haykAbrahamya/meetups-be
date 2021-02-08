'use strict';
module.exports = (sequelize, DataTypes) => {
  const MeetupUser = sequelize.define(
    'meetupUser',
    {
      meetupId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      }
    }
  )

  MeetupUser.associate = (models) => {
    MeetupUser.hasOne(models.user, {
      sourceKey: 'userId',
      foreignKey: 'id',
      as: 'user'
    }),
    MeetupUser.hasOne(models.meetup, {
      sourceKey: 'meetupId',
      onDelete: 'cascade',
      hooks: true,
      foreignKey: 'id',
      as: 'meetup'
    })
  }

  return MeetupUser
}