module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: DataTypes.STRING,
            username: DataTypes.STRING,
            github_id: DataTypes.INTEGER,
            slack_id: DataTypes.STRING
        },
        {
            tableName: 'users',
            underscored: true
        }
    )
    User.associate = models => {
        User.hasMany(models.ProjectComment, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            },
            as: 'comments'
        })
        User.belongsToMany(models.Project, {
            through: models.ProjectCreator,
            foreignKey: {
                name: 'user_id',
                allowNull: false,
            }
        })
        User.belongsToMany(models.Project, {
            through: models.ProjectUpvote,
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        })
    }

    return User
}