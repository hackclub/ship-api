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
    User.associate = models => {
        User.belongsToMany(models.Project, {
            through: models.ProjectCreator,
            foreignKey: {
                name: 'user_id',
                allowNull: false,
            }
        })
    }

    return User
}