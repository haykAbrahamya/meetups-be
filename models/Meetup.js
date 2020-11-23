'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meetup = sequelize.define(
    'meetup',
    {
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      startDate: {
        type: DataTypes.DATE
      },
      creatorId: {
        type: DataTypes.INTEGER
      }
    }
  )
  Meetup.associate = (models) => {
    Meetup.hasOne(models.user, {
      sourceKey: 'creatorId',
      foreignKey: 'id',
      as: 'creator'
    })
  }

  return Meetup
}