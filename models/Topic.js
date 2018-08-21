const { slugifyModel } = require('sequelize-slugify')

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
            slug: {
                unique: true,
                type: DataTypes.STRING
            },
            description: DataTypes.STRING
        },
        {
            tableName: 'topics',
            underscored: true
        }
    )
    slugifyModel(Topic, {
        source: ['name'],
        slugOptions: {
            symbol: false,
            lower: true
        },
        overwrite: false
    })
    Topic.associate = models => {
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