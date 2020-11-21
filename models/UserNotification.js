'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define(
    'userNotification',
    {
      userId: {
        type: DataTypes.INTEGER
      },
      notificationId: {
        type: DataTypes.INTEGER
      }
    }
  )

  UserNotification.associate = (models) => {
    UserNotification.hasOne(models.notification, {
      sourceKey: 'notificationId',
      foreignKey: 'id',
      as: 'notification'
    })
  }

  return UserNotification
}