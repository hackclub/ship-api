module.exports = (sequelize, DataTypes) => {
    const ProjectComment = sequelize.define(
        'ProjectComment',
        {
            project_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            parent_id: DataTypes.INTEGER,
            body: DataTypes.TEXT
        },
        {
            tableName: 'project_comments',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['project_id', 'user_id'] }
            }
        }
    )
    ProjectComment.associate = models => {
        ProjectComment.belongsTo(models.Project, {
            foreignKey: 'project_id',
            allowNull: false
        })
        ProjectComment.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            allowNull: false
        })
    }

    return ProjectComment
}