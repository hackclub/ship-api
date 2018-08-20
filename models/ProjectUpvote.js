'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProjectUpvote = sequelize.define(
        'ProjectUpvote',
        {
            project_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER
        },
        {
            tableName: 'project_upvotes',
            underscored: true
        }
    )

    return ProjectUpvote
}