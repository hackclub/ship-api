module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: DataTypes.STRING,
            username: DataTypes.STRING
        },
        {
            tableName: 'users',
            underscored: true,
        }
    )

    return User
}