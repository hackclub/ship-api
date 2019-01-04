module.exports = (sequelize, DataTypes) => {
    const ProjectUpvote = sequelize.define(
        'ProjectUpvote',
        {
            project_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER
        },
        {
            tableName: 'project_upvotes',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['project_id', 'user_id'] }
            }
        }
    )
    ProjectUpvote.associate = models => {
        ProjectUpvote.belongsTo(models.Project, {
            as: 'project',
            foreignKey: 'project_id',
            allowNull: false
        })
        ProjectUpvote.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            allowNull: false
        })
    }

    return ProjectUpvote
}