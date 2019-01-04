module.exports = (sequelize, DataTypes) => {
    const ProjectLink = sequelize.define(
        'ProjectLink',
        {
            project_id: DataTypes.INTEGER,
            url: DataTypes.STRING
        },
        {
            tableName: 'project_links',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['project_id'] }
            }
        }
    )
    ProjectLink.associate = models => {
        ProjectLink.belongsTo(models.Project)
    }

    return ProjectLink
}