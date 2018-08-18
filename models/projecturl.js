module.exports = (sequelize, DataTypes) => {
    const ProjectURL = sequelize.define(
        'ProjectURL',
        {
            project_id: DataTypes.INTEGER,
            url: DataTypes.STRING
        },
        {
            tableName: 'project_urls',
            underscored: true,
        }
    )
    ProjectURL.associate = models => {
        ProjectURL.belongsTo(models.Project)
    }

    return ProjectURL
}