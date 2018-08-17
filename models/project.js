module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define(
        'Project',
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'topic needs to have a name'
                    }
                }
            },
            tagline: DataTypes.STRING,
            description: DataTypes.STRING
        },
        {
            tableName: 'projects',
            underscored: true,
        }
    )
    Project.associate = function (models) {
        Project.belongsToMany(models.Topic, {
            through: models.ProjectTopic,
            foreignKey: {
                name: 'project_id',
                allowNull: false,
            },
            as: 'topics'
        })
    }

    return Project
}