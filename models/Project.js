const { slugifyModel } = require('sequelize-slugify')

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
            slug: {
                unique: true,
                type: DataTypes.STRING,
            },
            tagline: DataTypes.STRING,
            description: DataTypes.TEXT
        },
        {
            tableName: 'projects',
            underscored: true
        }
    )
    slugifyModel(Project, {
        source: ['name'],
        // suffixSource: ['id'], // Current being ignored by sequelize-slugify
        slugOptions: {
            symbol: false,
            lower: true
        },
        overwrite: false
    })
    Project.associate = models => {
        Project.hasMany(models.ProjectComment, {
            foreignKey: {
                name: 'project_id',
                allowNull: false
            },
            as: 'comments'
        })
        Project.belongsToMany(models.User, {
            through: models.ProjectCreator,
            foreignKey: {
                name: 'project_id',
                allowNull: false
            },
            as: 'creators'
        })
        Project.hasMany(models.ProjectLink, {
            as: 'links'
        })
        Project.belongsToMany(models.Topic, {
            through: models.ProjectTopic,
            foreignKey: {
                name: 'project_id',
                allowNull: false,
            },
            as: 'topics'
        })
        Project.belongsToMany(models.User, {
            through: models.ProjectUpvote,
            foreignKey: {
                name: 'project_id',
                allowNull: false
            },
            as: 'upvotes'
        })
    }

    return Project
}