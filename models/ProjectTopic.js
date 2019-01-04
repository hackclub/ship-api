module.exports = (sequelize, DataTypes) => {
    const ProjectTopic = sequelize.define(
        'ProjectTopic',
        {
            project_id: DataTypes.INTEGER,
            topic_id: DataTypes.INTEGER
        },
        {
            tableName: 'project_topics',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['project_id'] }
            }
        }
    )

    return ProjectTopic
}