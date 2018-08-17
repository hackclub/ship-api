module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define(
        'Topic',
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'topic needs to have a name'
                    }
                }
            },
            description: DataTypes.STRING
        },
        {
            tableName: 'topics',
            underscored: true,
        }
    )
    Topic.associate = function (models) {
        Topic.belongsToMany(models.Project, {
            through: models.ProjectTopic,
            foreignKey: {
                name: 'topic_id',
                allowNull: false,
            }
        })
    }

    return Topic
}