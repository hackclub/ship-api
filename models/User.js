const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class User extends timestamps(Model) {
    static get tableName() {
        return 'users'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project, ProjectComment, ProjectCreator, ProjectUpvote } = require('.')
        return {
            comments: {
                relation: Model.HasManyRelation,
                modelClass: ProjectComment,
                join: {
                    from: 'users.id',
                    to: 'project_comments.user_id'
                }
            },
            projects: {
                relation: Model.ManyToManyRelation,
                modelClass: Project,
                join: {
                    from: 'users.id',
                    through: {
                        modelClass: ProjectCreator,
                        from: 'project_creators.user_id',
                        to: 'project_creators.project_id'
                    },
                    to: 'projects.id'
                }
            },
            upvotes: {
                relation: Model.HasManyRelation,
                modelClass: ProjectUpvote,
                join: {
                    from: 'users.id',
                    to: 'project_upvotes.user_id'
                }
            }
        }
    }
}

module.exports = User