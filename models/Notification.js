'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'notification',
    {
      payload: {
        type: DataTypes.STRING,
        get() {
          return JSON.parse(this.getDataValue('payload'))
        },
        set(value) {
          this.setDataValue('payload', JSON.stringify(value))
        }
      },
      createdAt: {
        type: DataTypes.DATE
      }
    }
  )

  return Notification
}