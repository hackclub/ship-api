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
            main_image_id: DataTypes.INTEGER,
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
        Project.hasMany(models.ProjectImage, {
            as: 'images'
        })
        Project.hasMany(models.ProjectLink, {
            as: 'links'
        })
        Project.belongsTo(models.ProjectImage, {
            as: 'main_image',
            foreignKey: 'main_image_id'
        })
        Project.belongsToMany(models.Topic, {
            through: models.ProjectTopic,
            foreignKey: {
                name: 'project_id',
                allowNull: false,
            },
            as: 'topics'
        })
        Project.hasMany(models.ProjectUpvote, {
            foreignKey: {
                name: 'project_id',
                allowNull: false
            },
            as: 'upvotes'
        })
    }

    return Project
}