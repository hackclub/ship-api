module.exports = (sequelize, DataTypes) => {
    const ProjectCreator = sequelize.define(
        'ProjectCreator',
        {
            project_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER
        },
        {
            tableName: 'project_creators',
            underscored: true
        }
    )

    return ProjectCreator
}