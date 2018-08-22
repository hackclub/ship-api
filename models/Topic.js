const isHexColor = require('is-hex-color')
const { slugifyModel } = require('sequelize-slugify')
const stringToColor = require('string-to-color')

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
            color: {
                type: DataTypes.STRING,
                validate: {
                    isHexColor: val => {
                        if (!isHexColor(val)) {
                            throw new Error('topic has an invalid color (needs to be in hex form)')
                        }
                    }
                }
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
    // Generates a hex color for the topic if one wasn't specified
    Topic.hook('beforeCreate', topic => {
        if (!topic.color) {
            topic.color = stringToColor(topic.name)
        }
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